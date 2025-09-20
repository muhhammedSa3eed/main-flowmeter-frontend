declare module '@mapbox/mapbox-gl-geocoder' {
    import { IControl, Map } from 'mapbox-gl'
  
    export interface GeocoderOptions {
      accessToken: string
      mapboxgl: typeof Map
      marker?: boolean
    }
  
    export default class MapboxGeocoder implements IControl {
      constructor(options: GeocoderOptions)
      onAdd(map: Map): HTMLElement
      onRemove(): void
    }
  }
  