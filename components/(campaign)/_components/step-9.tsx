'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RfpFormData } from '@/types';


export function Step9() {
  const { control } = useFormContext<RfpFormData>();
 

 
  return (
    <div className="rounded-xl border bg-muted/50 p-6 shadow-sm space-y-5">

      {/* Data Collection Section */}


      {/* MAF Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        <FormField
          control={control}
          name="maf.sopRef"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference to MAF Standard Operating Procedure</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter SOP reference"
                  {...field}
                  value={typeof field.value === 'string' ? field.value : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="maf.selectionSummary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flowmeter Selection Assessment Summary</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter summary"
                  {...field}
                  value={typeof field.value === 'string' ? field.value : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

     

      {/* RFP Conditions Section */}

        <FormField
          control={control}
          name="maf.detail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RFP Conditions</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter RFP condition details"
                  {...field}
                  value={typeof field.value === 'string' ? field.value : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       {/* Flowmeter Action Section */}
      
        </div>
  );
}
