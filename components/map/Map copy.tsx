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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import { useTheme } from 'next-themes';

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
  const router = useRouter();
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [openArea, setOpenArea] = useState(false);
  const [openCapacity, setOpenCapacity] = useState(false);
  const [openHours, setOpenHours] = useState(false);
  const [capacityFilter, setCapacityFilter] = useState<number | null>(null);
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const [hoursFilter, setHoursFilter] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [filteredLocations, setFilteredLocations] =
    useState<Location[]>(locations);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const globalFilteredLocations = locations.filter((l) => {
    return (
      (areaFilter === null || l.area === areaFilter) &&
      (capacityFilter === null || l.capacity === capacityFilter) &&
      (hoursFilter === null || l.hours_til_maintenance === hoursFilter)
    );
  });
  console.log({ areaFilter });
  useEffect(() => {
    console.log('Filtered:', globalFilteredLocations);
  }, [globalFilteredLocations]);

  const areas = [...new Set(globalFilteredLocations.map((l) => l.area))];
  const capacities = [
    ...new Set(
      globalFilteredLocations
        .map((l) => l.capacity)
        .filter((c): c is number => c !== undefined)
    ),
  ].sort((a, b) => a - b);

  const hoursMaint = [
    ...new Set(
      globalFilteredLocations
        .map((l) => l.hours_til_maintenance)
        .filter((c): c is number => c !== undefined)
    ),
  ].sort((a, b) => a - b);

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
  const isSearchDisabled =
    !areaFilter && !capacityFilter && !hoursFilter && !dateFrom && !dateTo;

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  console.log({ hydrated });
  useEffect(() => {
    if (!hydrated) return;

    // init map here (Mapbox / Leaflet / أي حاجة بتستخدم window/document)
    setMapLoaded(true);
  }, [hydrated]);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 992); // sm = 640px
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);
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

  useEffect(() => {
    if (theme === 'dark' && selectedFlavor !== 'dark') {
      setSelectedFlavor('dark');
    }
  }, [theme, selectedFlavor]);

  const resetMapView = () => {
    setSelectedLocation(null);
    setAreaFilter(null);
    setCapacityFilter(null);
    setHoursFilter(null);
    setFilteredLocations(locations);
    setShowFilterDialog(false);
    setDateFrom('');
    setDateTo('');
    setIsFiltered(false);
    if (mapInstance.current && mapLoaded) {
      mapInstance.current.flyTo({
        center: UAE_CENTER,
        zoom: DEFAULT_ZOOM,
        essential: true,
      });
    }
  };

  // Create map - only re-runs when flavor changes
  useEffect(() => {
    if (!hydrated) return; // 👈 اشتغل بس بعد hydration

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
            attribution: '© Neuss for App Dev.', //'© Neuss and Protomaps Contributors',
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
        clusterRadius: 50,
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

      // Add unclustered points layer
      map.addLayer({
        id: 'unclustered-point',
        type: 'symbol',
        source: 'locations',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': 'flowmeter-icon',
          'icon-size': 1,
          'icon-allow-overlap': false,
          'icon-ignore-placement': false,
        },
      });

      // Unclustered point click popup (add this after adding the unclustered-point layer)
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
            `<div class="p-4 bg-white rounded-lg shadow-lg max-w-xs">
                <div class="pb-2 mb-3">
                  <h2 class="text-lg font-bold text-gray-800">${props.name}</h2>
                </div>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="font-medium text-gray-600">Area:</span>
                    <span class="text-gray-800">${props.area}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-medium text-gray-600">Capacity:</span>
                    <span class="text-gray-800">${props.capacity}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-medium text-gray-600">Installed:</span>
                    <span class="text-gray-800">${props.installation_date}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-medium text-gray-600">Maintenance:</span>
                    <span class="text-gray-800">${props.hours_til_maintenance} hrs</span>
                  </div>
                </div>
                <div class="mt-4">
                  <button onclick="window.location.href='${props.path}'" 
                          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105">
                    View Flometer details
                  </button>
                </div>
              </div>`
          )
          .addTo(map);
      });

      // Load the SVG icon
      // Create a function to load the SVG image
      const loadSvgImage = (svgData: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Failed to load SVG image'));
          img.src =
            'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
        });
      };

      // Use it in your map initialization
      loadSvgImage(`
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 48 48">
        <rect x="12" y="18" width="24" height="12" rx="2" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
        <rect x="12" y="15" width="4" height="24" rx="2" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
        <rect x="32" y="15" width="4" height="24" rx="2" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
        <circle cx="24" cy="24" r="10" fill="#ffffff" stroke="#1e40af" stroke-width="2"/>
        <path d="M24 19.5 A5.5 5.5 0 0 1 24 29.5 A5.5 5.5 0 0 1 24 19.5 Z" fill="#e5e7eb"/>
        <path d="M24 24 L24 20" stroke="#1e40af" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `)
        .then((image) => {
          map.addImage('flowmeter-icon', image);
        })
        .catch((error) => {
          console.error('Error loading flow meter icon:', error);
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

      setMapLoaded(true);
    });

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFlavor, hydrated]); // Only re-create map when flavor changes

  // Update map data and markers when filteredLocations changes
  useEffect(() => {
    if (mapInstance.current && mapLoaded) {
      const map = mapInstance.current;

      // Remove existing markers
      const existingMarkers = document.querySelectorAll(
        '.flowmeter-marker-container'
      );
      existingMarkers.forEach((marker) => marker.remove());

      // Update source data
      const source = map.getSource('locations') as maplibregl.GeoJSONSource;
      if (source) {
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
        source.setData(geojson);
      }
    }
  }, [filteredLocations, mapLoaded]); // Only update data and markers, not recreate map

  useEffect(() => {
    if (mapInstance.current && mapLoaded && selectedLocation) {
      const map = mapInstance.current;

      // Fly to the selected location
      map.flyTo({
        center: selectedLocation.coordinates,
        zoom: LOCATION_ZOOM,
        essential: true,
      });

      // Create and show popup for the selected location after a short delay
      // This ensures the popup opens after the fly animation starts
      const popupTimeout = setTimeout(() => {
        if (mapInstance.current) {
          const popup = new maplibregl.Popup()
            .setLngLat(selectedLocation.coordinates)
            .setHTML(
              `<div class="p-4 bg-white rounded-lg shadow-lg max-w-xs">
              <div class="pb-2 mb-3">
                <h2 class="text-lg font-bold text-gray-800">${selectedLocation.name}</h2>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="font-medium text-gray-600">Area:</span>
                  <span class="text-gray-800">${selectedLocation.area}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-600">Capacity:</span>
                  <span class="text-gray-800">${selectedLocation.capacity}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-600">Installed:</span>
                  <span class="text-gray-800">${selectedLocation.installation_date}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-600">Maintenance:</span>
                  <span class="text-gray-800">${selectedLocation.hours_til_maintenance} hrs</span>
                </div>
              </div>
              <div class="mt-4">
                <button onclick="window.location.href='${selectedLocation.path}'" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105">
                  View SRS Station
                </button>
              </div>
            </div>`
            )
            .addTo(map);

          // Hide popup when zoom changes (but not during the initial fly)
          const onZoom = () => {
            popup.remove();
            map.off('zoom', onZoom);
          };

          // Add zoom listener after a delay to avoid immediate closing
          const zoomListenerTimeout = setTimeout(() => {
            map.on('zoom', onZoom);
          }, 1000);

          // Cleanup function
          return () => {
            clearTimeout(zoomListenerTimeout);
            map.off('zoom', onZoom);
          };
        }
      }, 3000); // Small delay to ensure flyTo has started

      // Cleanup function for the main timeout
      return () => {
        clearTimeout(popupTimeout);
      };
    }
  }, [selectedLocation, mapLoaded]);
  // console.log({ dateFrom }, { dateTo });
  const handleFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('filter popup clicked');

    setIsFiltering(true);

    try {
      const res = await fetch(
        `/api/location?area=${encodeURIComponent(
          areaFilter ?? ''
        )}&capacity=${encodeURIComponent(
          capacityFilter?.toString() ?? ''
        )}&hours=${encodeURIComponent(
          hoursFilter?.toString() ?? ''
        )}&fromdate=${dateFrom}&todate=${dateTo}`
      );

      if (!res.ok) throw new Error('Failed to fetch locations');
      const data = await res.json();
      setFilteredLocations(data);
      setIsFiltered(true);
      console.log({ data });

      // Reset map view to initial zoom level after filtering
      if (mapInstance.current && mapLoaded) {
        mapInstance.current.flyTo({
          center: UAE_CENTER,
          zoom: DEFAULT_ZOOM,
          essential: true,
        });
      }

      // Clear selected location since we're resetting the view
      setSelectedLocation(null);
    } catch (error) {
      setIsFiltered(false);
      console.error('Error filtering locations:', error);
    } finally {
      setIsFiltering(false);
    }
  };
  console.log({ isFiltered });
  console.log({ theme });
  console.log({ mapLoaded });
  if (!hydrated) return null;
  return (
    <div className="w-full relative" style={{ height: 'calc(100vh - 205px)' }}>
      {/* Controls */}
      <div
        className="absolute z-10 flex flex-col gap-4"
        style={{
          minWidth: isSmallScreen ? '260px' : '452px',
          top: isSmallScreen ? '4px' : '16px',
          left: isSmallScreen ? '4px' : '16px',
        }}
      >
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-sm p-3 space-y-2.5 w-full">
          <div
            className="flex gap-2 "
            style={{ flexWrap: isSmallScreen ? 'wrap' : 'nowrap' }}
          >
            <Label
              htmlFor="location"
              className="text-slate-950 dark:text-slate-50  "
              style={{
                width: isSmallScreen ? '100%' : '20%',
                flexBasis: isSmallScreen ? '100%' : '20%',
              }}
            >
              Flowmeter
            </Label>
            <div
              style={{
                width: isSmallScreen ? '100%' : '80%',
                flexBasis: isSmallScreen ? '100%' : '80%',
                // backgroundColor: 'red',
              }}
            >
              <div className="flex  gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="justify-between rounded-sm border-green-500"
                      style={{
                        width: isSmallScreen ? '75%' : '75%',
                        flexBasis: isSmallScreen ? '75%' : '75%',
                      }}
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
                <div
                  style={{
                    width: isSmallScreen ? '20%' : '20%',
                    flexBasis: isSmallScreen ? '20%' : '20%',
                  }}
                >
                  <div className=" flex gap-1">
                    <ListFilterPlus
                      size={24}
                      style={{
                        width: '36px',
                        height: '36px',
                        padding: '4px',
                        borderRadius: '6px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        flexShrink: 0,
                        border: isFiltered
                          ? '2px solid green'
                          : '2px solid gray',
                        color: isFiltered
                          ? 'green'
                          : theme == 'light'
                          ? 'black'
                          : 'white', // بيتحكم في لون الـ stroke (الأيقونة نفسها)
                      }}
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeLinecap="square"
                      opacity={0.8}
                      onClick={() => setShowFilterDialog(!showFilterDialog)}
                    />

                    <button
                      onClick={resetMapView}
                      className={`${
                        theme == 'light' ? 'text-black' : 'text-white'
                      } w-9 h-9 p-1 rounded-sm shadow-2xl border-2 border-gray-400 cursor-pointer flex-shrink-0 flex items-center justify-center`}
                      title="Reset filters"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                        <path d="M3 21v-5h5" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showFilterDialog && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm p-3 space-y-2.5">
            <h2 className="font-bold text-xl text-center mb-2 text-green-500">
              Filters
            </h2>
            <div
              className="flex"
              style={{
                flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
              }}
            >
              <Label
                className="text-slate-950 dark:text-slate-50 "
                style={{
                  width: isSmallScreen ? '100%' : '20%',
                  flexBasis: isSmallScreen ? '100%' : '20%',
                  marginBottom: isSmallScreen ? '8px' : '0',
                }}
              >
                Area
              </Label>
              <Popover open={openArea} onOpenChange={setOpenArea}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="border-green-500 max-w-full justify-between rounded-sm"
                    style={{
                      width: isSmallScreen ? '100%' : '80%',
                      flexBasis: isSmallScreen ? '100%' : '80%',
                    }}
                  >
                    {areaFilter ? areaFilter : 'Select area...'}
                    <ChevronsUpDownIcon className="ml-0 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0"
                  style={{ backgroundColor: 'red' }}
                >
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
            <div
              className="flex"
              style={{
                flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
              }}
            >
              <Label
                className="text-slate-950 dark:text-slate-50"
                style={{
                  width: isSmallScreen ? '100%' : '20%',
                  flexBasis: isSmallScreen ? '100%' : '20%',
                  marginBottom: isSmallScreen ? '8px' : '0',
                }}
              >
                Capacity
              </Label>
              <Popover open={openCapacity} onOpenChange={setOpenCapacity}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="border-green-500 max-w-full justify-between rounded-sm"
                    style={{
                      width: isSmallScreen ? '100%' : '80%',
                      flexBasis: isSmallScreen ? '100%' : '80%',
                    }}
                  >
                    {capacityFilter ? capacityFilter : 'Select capacity...'}
                    <ChevronsUpDownIcon className="ml-0 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search capacity..." />
                    <CommandList>
                      <CommandEmpty>No capacity found.</CommandEmpty>
                      <CommandGroup>
                        {capacities.map((capacity) => (
                          <CommandItem
                            key={capacity}
                            value={capacity.toString()}
                            onSelect={() => {
                              setCapacityFilter(capacity ?? '');
                              setOpenCapacity(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                capacityFilter === capacity
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {capacity}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div
              className="flex"
              style={{
                flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
              }}
            >
              <Label
                className="text-slate-950 dark:text-slate-50 "
                style={{
                  width: isSmallScreen ? '100%' : '20%',
                  flexBasis: isSmallScreen ? '100%' : '20%',
                  marginBottom: isSmallScreen ? '8px' : '0',
                }}
              >
                Hrs till maint.
              </Label>
              <Popover open={openHours} onOpenChange={setOpenHours}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="border-green-500 max-w-full justify-between rounded-sm"
                    style={{
                      width: isSmallScreen ? '100%' : '80%',
                      flexBasis: isSmallScreen ? '100%' : '80%',
                    }}
                  >
                    {hoursFilter
                      ? hoursFilter
                      : 'Select hours till maintenance...'}
                    <ChevronsUpDownIcon className="ml-0 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search hours till maintenance..." />
                    <CommandList>
                      <CommandEmpty>No hrs till maint found.</CommandEmpty>
                      <CommandGroup>
                        {hoursMaint.map((hour) => (
                          <CommandItem
                            key={hour}
                            value={hour.toString()}
                            onSelect={() => {
                              setHoursFilter(hour ?? '');
                              setOpenHours(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                hoursFilter === hour
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {hour}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div
              className="flex"
              style={{
                flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
              }}
            >
              <Label
                className="text-slate-950 dark:text-slate-50"
                style={{
                  width: isSmallScreen ? '100%' : '20%',
                  flexBasis: isSmallScreen ? '100%' : '20%',
                  marginBottom: isSmallScreen ? '8px' : '0',
                }}
              >
                Installation Date
              </Label>
              <div
                style={{
                  width: isSmallScreen ? '100%' : '35%',
                  flexBasis: isSmallScreen ? '100%' : '35%',
                  marginBottom: isSmallScreen ? '8px' : '0',
                }}
              >
                <Input
                  type="date"
                  className="rounded-sm w-full "
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <span
                className="text-sm font-semibold "
                style={{
                  width: isSmallScreen ? '100%' : '10%',
                  flexBasis: isSmallScreen ? '100%' : '10%',
                  marginBottom: isSmallScreen ? '8px' : '0',

                  display: isSmallScreen ? 'block' : 'flex',
                  justifyContent: isSmallScreen ? 'start' : 'center',
                  alignItems: isSmallScreen ? 'start' : 'center',
                }}
              >
                To
              </span>
              <div
                style={{
                  width: isSmallScreen ? '100%' : '35%',
                  flexBasis: isSmallScreen ? '100%' : '35%',
                  marginBottom: isSmallScreen ? '8px' : '0',
                }}
              >
                <Input
                  type="date"
                  className="rounded-sm"
                  style={{ width: '100%' }}
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
                disabled={isFiltering || isSearchDisabled}
                className="px-3 py-1.5 text-white bg-green-500 rounded-sm font-medium text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isFiltering ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild className="">
          <MapPlus
            className="text-black cursor-pointer w-[34px] h-[34px] p-1 absolute  z-50 rounded-sm  "
            style={{
              // top: '8px',
              // right: '96px',
              top: '145px',
              right: '8px',
              display: isSmallScreen ? 'none' : 'block',
              backgroundColor: 'white',
              border: '3px solid #d1d1d1',
            }}
            size={24}
            strokeLinejoin="round"
            strokeLinecap="square"
            opacity={0.8}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="map-dropdown"
          // style={{
          //   minWidth: '64px !important',
          // }}
        >
          {flavors.map((flavor) => (
            <DropdownMenuItem
              key={flavor}
              onClick={() => setSelectedFlavor(flavor)}
              className={`capitalize cursor-pointer px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                selectedFlavor === flavor
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200 dark:text-gray-100'
              }`}
            >
              {flavor}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Drawer>
        <DrawerTrigger asChild>
          <MapPlus
            className="text-black cursor-pointer w-8 h-8 p-1 absolute z-50 rounded-sm shadow-2xl border border-gray-400 bg-white"
            style={{
              top: '145px',
              right: '10px',
              display: isSmallScreen ? 'block' : 'none',
              backgroundColor: 'white',
              zIndex: '9',
            }}
            size={24}
            strokeLinejoin="round"
            strokeLinecap="square"
            opacity={0.8}
          />
        </DrawerTrigger>

        <DrawerContent
          style={{
            bottom: '0',
            width: '100%',
            position: 'fixed',
            zIndex: '500',
            backgroundColor: '#f9fafb',
          }}
        >
          <DrawerHeader>
            <DrawerTitle
              className="pb-0 text-xl"
              style={{ paddingBottom: '0px' }}
            >
              CHOOSE A FLAVOR
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-4 " style={{ paddingTop: '0px' }}>
            <RadioGroup
              className="flex flex-wrap gap-2 "
              value={selectedFlavor}
              onValueChange={(v: string) => setSelectedFlavor(v as MapFlavor)}
            >
              {flavors.map((flavor) => (
                <div
                  key={flavor}
                  className="flex items-center space-x-2 rounded-sm px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <RadioGroupItem
                    value={flavor}
                    id={flavor}
                    className="checked:bg-red-500"
                  />
                  <Label
                    htmlFor={flavor}
                    style={{
                      marginLeft: '8px',
                    }}
                    className={`capitalize text-base font-medium cursor-pointer ${
                      selectedFlavor === flavor
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    {flavor}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <DrawerClose asChild>
            <button
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'white',
                zIndex: '501',
                border: '1px solid red',
                color: 'red',
              }}
              className="border px-3 py-1.6 text-lg  rounded-sm shadow-sm "
            >
              X
            </button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full  "
        style={{
          visibility: mapLoaded ? 'visible' : 'hidden',
          backgroundColor: mapLoaded ? 'transparent' : '#f3f4f6',
          height: 'calc(100vh - 205px)',
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
// useEffect(() => {
//   if (mapInstance.current && mapLoaded && selectedLocation) {
//     mapInstance.current.flyTo({
//       center: selectedLocation.coordinates,
//       zoom: LOCATION_ZOOM,
//       essential: true,
//     });
//   }
// }, [selectedLocation, mapLoaded]);
// const areas = [...new Set(locations.map((l) => l.area))];
// const capacities = [
//   ...new Set(
//     locations
//       .map((l) => l.capacity)
//       .filter((c): c is number => c !== undefined)
//   ),
// ].sort((a, b) => a - b);
// const hoursMaint = [
//   ...new Set(
//     locations
//       .map((l) => l.hours_til_maintenance)
//       .filter((c): c is number => c !== undefined)
//   ),
// ].sort((a, b) => a - b);
{
  {
    /* <div className="bg-white shadow-sm rounded-sm p-3 space-y-2.5">
          <div className="flex gap-2">
            <Label htmlFor="location" className="text-slate-950 dark:text-slate-50 w-[20%]">
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
            <div className="w-[10%]">
              <ListFilterPlus
                size={24}
                className="text-black w-9 h-9 p-1 rounded-sm shadow-2xl border-2 border-gray-400 ml-auto cursor-pointer"
                strokeLinejoin="round"
                strokeLinecap="square"
                opacity={0.8}
                onClick={() => setShowFilterDialog(!showFilterDialog)}
              />
            </div>
          </div>
        </div> */
  }
  {
    /* <button
                type="button"
                onClick={handleFilter}
                disabled={isFiltering}
                className="px-3 py-1.5 text-white bg-purple-500 rounded-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isFiltering ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </button> */
  }
  /* <div className="flex">
              <Label
                htmlFor="capacity"
                className="text-slate-950 dark:text-slate-50 w-full basis-full w-[25%] basis-[25%] mb-2 mb-0"
              >
                Capacity
              </Label>
              <Input
                className="w-[75%] basis-[75%] w-full basis-full rounded-sm"
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
                className="text-slate-950 dark:text-slate-50 w-[25%] basis-[25%]"
              >
                Hrs till maint.
              </Label>
              <Input
                className="sm:w-[75%] sm:basis-[75%] w-full basis-full rounded-sm"
                placeholder="Enter hours till maintenance"
                id="hours"
                type="number"
                value={hoursFilter ?? ''}
                onChange={(e) =>
                  setHoursFilter(e.target.value ? Number(e.target.value) : null)
                }
              />
            </div> */
}
