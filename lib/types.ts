export interface Location {
  id: number;
  name: string;
  area: string;
  coordinates: [number, number];
  path: string;
  capacity: number;
  installation_date: string;
  hours_til_maintenance: number;
}
