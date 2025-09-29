'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { RfpFormData } from '@/types';
import { Select } from '@radix-ui/react-select';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const Region = [
  { id: 1, title: 'Abu Dhabi', value: 'abu_dhabi' },
  { id: 2, title: 'Al Ain', value: 'al_ain' },
  { id: 3, title: 'Western Region', value: 'western_region' },
];
const STPCC = [
  { id: 1, title: 'Abu Al Abyad Island', value: 'abu_alabyad_island' },
  { id: 2, title: 'Al Araad', value: 'al_araad' },
  { id: 3, title: 'Al Faqah', value: 'al_faqah' },
  { id: 4, title: 'Al Ghadeer', value: 'al_ghadeer' },
  { id: 5, title: 'Al Hayer', value: 'al_hayer' },
  { id: 6, title: 'Al Khatim', value: 'al_khatim' },
];
export const Step4 = () => {
  const { control } = useFormContext<RfpFormData>();

  return (
    <div className="rounded-xl border bg-muted/50 p-6 shadow-sm space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Location Description */}
        <FormField
          control={control}
          name="MonitoringDetails.location.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Main inlet chamber"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Region */}

        <FormField
          control={control}
          name="MonitoringDetails.location.region"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Region.map((item) => (
                      <SelectItem key={item.id} value={item.value}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Coordinate N */}
        <FormField
          control={control}
          name="MonitoringDetails.location.coordinateN"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coordinate N (North)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === '' ? undefined : Number(e.target.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Coordinate E */}
        <FormField
          control={control}
          name="MonitoringDetails.location.coordinateE"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coordinate E (East)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === '' ? undefined : Number(e.target.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* STPCC */}
        <FormField
          control={control}
          name="MonitoringDetails.location.stpcc"
          render={({ field }) => (
            <FormItem className="mb-2 flex-1">
              <FormLabel>STPCC</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {STPCC.map((item) => (
                      <SelectItem key={item.id} value={item.value}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Site Drawing Reference */}
        <FormField
          control={control}
          name="MonitoringDetails.location.siteDrawingRef"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Site Drawing Reference</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter site drawing reference"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="MonitoringDetails.location.flowDiagramRef"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flow Diagram Reference</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter flow diagram reference"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
