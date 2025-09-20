/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import { layers, namedFlavor } from '@protomaps/basemaps';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { FeatureCollection, Point } from 'geojson';
import { Location, LOCATIONS } from '@/lib/static-data';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CheckIcon,
  ChevronsUpDownIcon,
  ListFilterPlus,
  MapPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
type MapFlavor = 'light' | 'dark' | 'white' | 'grayscale' | 'black';

// PMTiles protocol
const protocol = new Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

// Map constants
const UAE_CENTER: [number, number] = [54.3, 24.5];
const DEFAULT_ZOOM = 6.5;
const LOCATION_ZOOM = 12;
const flavors: MapFlavor[] = ['light', 'dark', 'white', 'grayscale', 'black'];
interface locationProps {
  locations: Location[];
}
export default function Map({ locations }: locationProps) {
  console.log({ locations });
  const router = useRouter();
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [openArea, setOpenArea] = useState(false);
  const [capacityFilter, setCapacityFilter] = useState<number | null>(null);
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const [hoursFilter, setHoursFilter] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [filteredLocations, setFilteredLocations] =
    useState<Location[]>(locations);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const areas = [...new Set(LOCATIONS.map((l) => l.area))];
  const [isFiltering, setIsFiltering] = useState(false);

  // const filteredLocations = LOCATIONS.filter(
  //   (l) =>
  //     (!capacityFilter || l.capacity === capacityFilter) &&
  //     (!areaFilter || l.area === areaFilter)
  // );
  // const filteredLocations = LOCATIONS.filter(
  //   (l) =>
  //     (!capacityFilter || l.capacity === capacityFilter) &&
  //     (!areaFilter || l.area === areaFilter) &&
  //     (!hoursFilter || l.hours_til_maintenance === hoursFilter)
  // );
  // const filteredLocations = LOCATIONS.filter((l) => {
  //   const installDate = new Date(l.installation_date ?? '');

  //   return (
  //     (!capacityFilter || l.capacity === capacityFilter) &&
  //     (!areaFilter || l.area === areaFilter) &&
  //     (!hoursFilter || l.hours_til_maintenance === hoursFilter) &&
  //     (!dateFrom || installDate >= new Date(dateFrom)) &&
  //     (!dateTo || installDate <= new Date(dateTo))
  //   );
  // });

  console.log({ filteredLocations });

  // URL params
  const initialFlavor = (searchParams.get('flavor') as MapFlavor) || 'light';
  const initialLocationId = searchParams.get('location')
    ? Number(searchParams.get('location'))
    : null;

  const [selectedFlavor, setSelectedFlavor] =
    useState<MapFlavor>(initialFlavor);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    initialLocationId
      ? LOCATIONS.find((l) => l.id === initialLocationId) || null
      : null
  );

  // Update URL when flavor/location changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedFlavor !== 'light') params.set('flavor', selectedFlavor);
    if (selectedLocation)
      params.set('location', selectedLocation.id.toString());

    const currentParams = new URLSearchParams(window.location.search);
    if (params.toString() !== currentParams.toString()) {
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [selectedFlavor, selectedLocation, router]);

  const resetMapView = () => {
    setSelectedLocation(null);
    setAreaFilter(null);
    setCapacityFilter(null);
    setHoursFilter(null);
    setFilteredLocations(locations);
    if (mapInstance.current && mapLoaded) {
      mapInstance.current.flyTo({
        center: UAE_CENTER,
        zoom: DEFAULT_ZOOM,
        essential: true,
      });
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstance.current) mapInstance.current.remove();

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: {
        version: 8,
        glyphs: `${window.location.origin}/fonts/{fontstack}/{range}.pbf`,
        sprite: `${window.location.origin}/sprites/v4/${selectedFlavor}`,
        sources: {
          protomaps: {
            type: 'vector',
            url: 'pmtiles:///tiles/gcc.pmtiles',
            attribution: '© Neuss and Protomaps Contributors',
          },
        },
        layers: layers('protomaps', namedFlavor(selectedFlavor), {
          lang: 'en',
        }),
      },
      center: UAE_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    map.on('load', () => {
      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.addControl(
        new maplibregl.GeolocateControl({ trackUserLocation: true }),
        'top-right'
      );
      map.addControl(new maplibregl.AttributionControl({ compact: false }));

      // --- Clustering ---
      const geojson: FeatureCollection<
        Point,
        { id: number; name: string; path: string }
      > = {
        type: 'FeatureCollection',
        features: filteredLocations.map((loc) => ({
          type: 'Feature',
          properties: {
            id: loc.id,
            name: loc.name,
            path: loc.path,
            area: loc.area,
            capacity: loc.capacity,
            installation_date: loc.installation_date,
            hours_til_maintenance: loc.hours_til_maintenance,
          },
          geometry: { type: 'Point', coordinates: loc.coordinates },
        })),
      };

      map.addSource('locations', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 100,
      });

      // Cluster layers
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'locations',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            5,
            '#f1f075',
            10,
            '#f28cb1',
          ],
          //               ['step', ['get', 'point_count'], defaultRadius, threshold1, radius1, threshold2, radius2, ...]
          'circle-radius': ['step', ['get', 'point_count'], 16, 5, 20, 20, 28],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'locations',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Noto Sans Regular'],
          'text-size': 12,
        },
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'locations',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 12,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });

      // Cluster click -> zoom
      map.on('click', 'clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        });
        if (!features.length) return;

        const clusterId = features[0].properties?.cluster_id;
        if (!clusterId) return;

        const source = map.getSource('locations') as maplibregl.GeoJSONSource;
        const zoom = await source.getClusterExpansionZoom(clusterId);
        const coordinates = (features[0].geometry as Point).coordinates as [
          number,
          number
        ];
        map.easeTo({ center: coordinates, zoom });
      });

      // Cluster hover popup
      let clusterPopup: maplibregl.Popup | null = null;
      map.on('mouseenter', 'clusters', async (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        });
        if (!features.length) return;
        const cluster = features[0];
        const clusterId = cluster.properties?.cluster_id;
        if (!clusterId) return;
        const source = map.getSource('locations') as maplibregl.GeoJSONSource;

        const leaves = await new Promise<
          GeoJSON.Feature<
            Point,
            {
              id: number;
              name: string;
              path: string;
              capacity: number;
              installation_date: string;
              hours_til_maintenance: number;
            }
          >[]
        >((resolve) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (source.getClusterLeaves as any)(
            clusterId,
            100,
            0,
            (err: Error | null, features?: GeoJSON.Feature[]) => {
              if (err || !features) return resolve([]);
              resolve(
                features as GeoJSON.Feature<
                  Point,
                  {
                    id: number;
                    name: string;
                    path: string;
                    capacity: number;
                    installation_date: string;
                    hours_til_maintenance: number;
                  }
                >[]
              );
            }
          );
        });

        if (!leaves.length) return;

        const html = `<div class="p-2 max-h-40 overflow-auto">
          <strong>${leaves.length} locations in this cluster:</strong>
          <ul class="list-disc ml-4 mt-1">
            ${leaves
              .map(
                (leaf) =>
                  `<li><a href="${leaf.properties?.path}" class="text-red-600 hover:underline">${leaf.properties?.name}</a>
                  </li>`
              )
              .join('')}
          </ul>
        </div>`;

        clusterPopup = new maplibregl.Popup({ closeButton: false, offset: 10 })
          .setLngLat(
            (cluster.geometry as Point).coordinates as [number, number]
          )
          .setHTML(html)
          .addTo(map);
      });

      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
        clusterPopup?.remove();
        clusterPopup = null;
      });

      // Unclustered point click popup
      map.on('click', 'unclustered-point', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const coordinates = (feature.geometry as Point).coordinates as [
          number,
          number
        ];
        const props = feature.properties as {
          id: number;
          name: string;
          path: string;
          area: string;
          capacity: number;
          installation_date: string;
          hours_til_maintenance: number;
        };

        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            `<div class="p-2">
            <h2 class="font-semibold mb-1">Name: ${props.name}</h2>
            <p class="mb-1">Area: ${props.area}</p>
            <p class="mb-1">Capacity: ${props.capacity}</p>
            <p class="mb-1">Installation date: ${props.installation_date}</p>
            <p class="mb-1">Hours til maintenance: ${props.hours_til_maintenance} </p>
          <button onclick="window.location.href='${props.path}'" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
        Go to SRS Station
            </button></div>`
          )
          .addTo(map);
      });

      setMapLoaded(true);
    });

    mapInstance.current = map;

    return () => {
      // Only remove map instance if it exists
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [selectedFlavor, router, filteredLocations]);

  useEffect(() => {
    if (mapInstance.current && mapLoaded && selectedLocation) {
      mapInstance.current.flyTo({
        center: selectedLocation.coordinates,
        zoom: LOCATION_ZOOM,
        essential: true,
      });
    }
  }, [selectedLocation, mapLoaded]);
  console.log({ selectedLocation });

  // const handleFilter = async (e: React.FormEvent) => {
  //   e.preventDefault(); // This will now have proper typing
  //   console.log('filter popup clicked');
  //   const params = new URLSearchParams(searchParams.toString());
  //   if (selectedLocation) {
  //     setSelectedLocation(null);

  //     if (params.has('location')) {
  //       params.delete('location'); // remove it
  //       const newUrl = `/map?${params.toString()}`;
  //       router.replace(newUrl); // replace without full reload
  //     }
  //   }
  //   const res = await fetch(
  //     `/api/location?area=${encodeURIComponent(
  //       areaFilter ?? ''
  //     )}&capacity=${encodeURIComponent(
  //       capacityFilter?.toString() ?? ''
  //     )}&hours=${encodeURIComponent(hoursFilter?.toString() ?? '')}`
  //   );
  //   if (!res.ok) throw new Error('Failed to fetch locations');
  //   const data = await res.json();

  //   setFilteredLocations(data);
  //   console.log({ data });
  // };

  const handleFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('filter popup clicked');

    setIsFiltering(true); // Set filtering state instead of using mapLoaded

    try {
      const res = await fetch(
        `/api/location?area=${encodeURIComponent(
          areaFilter ?? ''
        )}&capacity=${encodeURIComponent(
          capacityFilter?.toString() ?? ''
        )}&hours=${encodeURIComponent(hoursFilter?.toString() ?? '')}`
      );

      if (!res.ok) throw new Error('Failed to fetch locations');
      const data = await res.json();
      setFilteredLocations(data);
      console.log({ data });
    } catch (error) {
      console.error('Error filtering locations:', error);
    } finally {
      setIsFiltering(false);
    }
  };

  // setSelectedLocation(capacityFilter)
  // const params = new URLSearchParams();
  // if (selectedFlavor !== 'light') params.set('flavor', selectedFlavor);
  // if (selectedLocation)
  //   params.set('location', selectedLocation.id.toString());
  // if (capacityFilter) params.set('capacity', capacityFilter.toString());
  // if (areaFilter) params.set('area', areaFilter);
  // if (hoursFilter) params.set('hours', hoursFilter.toString());
  // const currentParams = new URLSearchParams(window.location.search);
  // if (params.toString() !== currentParams.toString()) {
  //   router.replace(`?${params.toString()}`, { scroll: false });
  // }

  console.log({ selectedLocation });

  return (
    <div className="w-full h-full relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4  bg-transparent  min-w-[452px]">
        <div className="bg-white shadow-sm rounded-sm p-3 space-y-2.5">
          <div className="flex gap-2">
            <Label htmlFor="location" className="text-slate-950 w-[20%]">
              Flowmeter
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[70%] max-w-full justify-between rounded-sm"
                >
                  {selectedLocation
                    ? selectedLocation.name
                    : 'Select a location...'}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[240px] p-0">
                <Command>
                  <CommandInput placeholder="Search location..." />
                  <CommandList>
                    <CommandEmpty>No location found.</CommandEmpty>
                    <CommandGroup>
                      {filteredLocations.map((l) => (
                        <CommandItem
                          key={l.id}
                          value={l.name}
                          onSelect={() => {
                            setSelectedLocation(l);
                            setOpen(false);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedLocation?.id === l.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {l.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {/* <Button
              onClick={() => setShowFilterDialog(!showFilterDialog)}
              className="text-white  bg-purple-500 *:hover:bg-purple-600 *:duration-200"
            >
              <ListFilterPlus color="white"  size={80}/>
            </Button> */}
            <div className="w-[10%] ">
              <ListFilterPlus
                size={24}
                className=" text-black  w-9 h-9 p-1 rounded-sm shadow-2xl border-2 border-gray-400 ml-auto cursor-pointer"
                strokeLinejoin="round"
                strokeLinecap="square"
                opacity={0.8}
                onClick={() => setShowFilterDialog(!showFilterDialog)}
              />
            </div>
          </div>
        </div>
        {showFilterDialog && (
          <div className="bg-white shadow-md rounded-sm p-3 space-y-2.5">
            <h2 className="font-bold text-xl text-center mb-2 text-blue-600">
              Filters
            </h2>
            <div className="flex">
              <Label className="text-slate-950 w-[25%] basis-[25%]">Area</Label>
              <Popover open={openArea} onOpenChange={setOpenArea}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-[75%] basis-[75%] max-w-full justify-between rounded-sm"
                  >
                    {areaFilter ? areaFilter : 'Select area...'}
                    <ChevronsUpDownIcon className="ml-0 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search area..." />
                    <CommandList>
                      <CommandEmpty>No area found.</CommandEmpty>
                      <CommandGroup>
                        {areas.map((area) => (
                          <CommandItem
                            key={area}
                            value={area}
                            onSelect={() => {
                              setAreaFilter(area ?? '');
                              setOpenArea(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                areaFilter === area
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {area}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex">
              <Label
                htmlFor="capacity"
                className="text-slate-950 w-[25%] basis-[25%]"
              >
                Capacity
              </Label>
              <Input
                className="w-[75%] basis-[75%] rounded-sm"
                placeholder="Enter capacity"
                id="capacity"
                type="number"
                value={capacityFilter ?? ''}
                onChange={(e) =>
                  setCapacityFilter(Number(e.target.value) || null)
                }
              />
            </div>

            <div className="flex">
              <Label
                htmlFor="hours"
                className="text-slate-950 w-[25%] basis-[25%]"
              >
                Hrs till maint.
              </Label>
              <Input
                className="w-[75%] basis-[75%] rounded-sm"
                placeholder="Enter hours till maintenance"
                id="hours"
                type="number"
                value={hoursFilter ?? ''}
                onChange={(e) =>
                  setHoursFilter(e.target.value ? Number(e.target.value) : null)
                }
              />
            </div>
            <div className="flex">
              <Label className='"text-slate-950 w-[25%] basis-[25%]'>
                Installation Date
              </Label>
              <div className="flex items-center gap-2 w-[75%] basis-[75%]">
                <Input
                  type="date"
                  className="rounded-sm"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
                <span className="text-sm font-semibold">To</span>
                <Input
                  type="date"
                  className="rounded-sm"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end mt-3 gap-2">
              <button
                onClick={resetMapView}
                className="px-3 py-1.5 rounded-sm bg-gray-800 text-gray-200 hover:bg-gray-300 text-sm font-medium"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleFilter}
                className="px-3 py-1.5 text-white bg-purple-500 rounded-sm font-medium"
              >
                Search
              </button>
            </div>
          </div>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MapPlus
            size={24}
            className="text-black cursor-pointer w-9 h-9 p-1 rounded-sm shadow-2xl border border-gray-400 bg-white absolute top-2 right-24 z-50 "
            strokeLinejoin="round"
            strokeLinecap="square"
            opacity={0.8}
          />
          {/* <Button className="bg-blue-600 text-white  hover:text-gray-200 duration-200 w-5 h-5 rounded shadow-md  text-center flex items-center justify-center absolute top-2 right-20 z-50">
            <span className="ml-1 font-medium capitalize flex items-center gap-1">
              {selectedFlavor}
              <MapPlus size={28}/>
            </span>
          </Button> */}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-20">
          {flavors.map((flavor) => (
            <DropdownMenuItem
              key={flavor}
              onClick={() => setSelectedFlavor(flavor)}
              className={`capitalize cursor-pointer px-3  py-1.5 rounded-sm text-sm font-medium transition-colors ${
                selectedFlavor === flavor
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {flavor}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-screen"
        style={{
          visibility: mapLoaded ? 'visible' : 'hidden',
          backgroundColor: mapLoaded ? 'transparent' : '#f3f4f6',
        }}
      />
      {/* Map loading spinner - only shows on initial map load */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600" />
        </div>
      )}

      {/* Filtering spinner - shows during filtering */}
      {isFiltering && mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
            <span className="text-gray-700 font-medium">
              Filtering locations...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

{
  /* <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover> */
}

// <div>
//   <div className="md:flex md:items-center">
//     <label
//       htmlFor="capacity"
//       className="md:w-3/12 md:basis-3/12 md:mb-0 mb-2 text-sm md:text-base"
//     >
//       Capacity :
//     </label>
//     <input
//       type="text"
//       id="capacity"
//       placeholder="Search By Bay Number"
//       value={bayNumberFilter}
//       onChange={(event) =>
//         setBayNumberFilter(event.target.value)
//       }
//       className="border border-primary-color px-3 bg-transparent rounded py-1 w-full md:w-9/12 md:basis-9/12 text-left placeholder:text-sm "
//     />
//   </div>
// </div>

{
  /* <select
            value={selectedLocation?.id || ''}
            onChange={(e) =>
              setSelectedLocation(
                e.target.value
                  ? LOCATIONS.find((l) => l.id === Number(e.target.value)) ||
                      null
                  : null
              )
            }
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a location --</option>
            {LOCATIONS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select> */
}

{
  /* <div className="bg-white p-2 rounded-md shadow-md flex gap-1 flex-wrap">
          {(['light', 'dark', 'white', 'grayscale', 'black'] as const).map(
            (flavor) => (
              <button
                key={flavor}
                onClick={() => setSelectedFlavor(flavor)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedFlavor === flavor
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {flavor.charAt(0).toUpperCase() + flavor.slice(1)}
              </button>
            )
          )}
        </div> */
}
{
  /* <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[240px] justify-between"
            >
              {selectedFlavor
                ? selectedFlavor.charAt(0).toUpperCase() +
                  selectedFlavor.slice(1)
                : 'Select flavor...'}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-0">
            <Command>
              <CommandInput placeholder="Search flavor..." />
              <CommandList>
                <CommandEmpty>No flavor found.</CommandEmpty>
                <CommandGroup>
                  {(
                    ['light', 'dark', 'white', 'grayscale', 'black'] as const
                  ).map((flavor) => (
                    <CommandItem
                      key={flavor}
                      value={flavor}
                      onSelect={() => {
                        setSelectedFlavor(flavor);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedFlavor === flavor
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {flavor.charAt(0).toUpperCase() + flavor.slice(1)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover> */
}
