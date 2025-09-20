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

export function Step6() {
  const { control } = useFormContext<RfpFormData>();

  return (
    <div className="rounded-xl border bg-muted/50 p-6 shadow-sm space-y-3">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={control}
          name="FlowmeterInventory.inventory.make"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Make</FormLabel>
              <FormControl>
                <Input placeholder="Enter make" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="FlowmeterInventory.inventory.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input placeholder="Enter type" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="FlowmeterInventory.inventory.model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="Enter model" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="FlowmeterInventory.inventory.serial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter serial number" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="FlowmeterInventory.inventory.fmSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flowmeter Size</FormLabel>
              <FormControl>
                <Input placeholder="Enter flowmeter size" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="FlowmeterInventory.inventory.pipelineSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pipeline Size</FormLabel>
              <FormControl>
                <Input placeholder="Enter pipeline size" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="FlowmeterInventory.inventory.velocityRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Velocity Range</FormLabel>
              <FormControl>
                <Input placeholder="Enter velocity range" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="FlowmeterInventory.inventory.accuracyReading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accuracy (Reading)</FormLabel>
              <FormControl>
                <Input placeholder="Enter accuracy for reading" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="FlowmeterInventory.inventory.accuracyFullScale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accuracy (Full Scale)</FormLabel>
              <FormControl>
                <Input placeholder="Enter accuracy full scale" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="FlowmeterInventory.inventory.readingMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reading Method</FormLabel>
              <FormControl>
                <Input placeholder="Enter reading method" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
