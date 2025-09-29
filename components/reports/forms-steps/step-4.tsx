'use client';

import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReportSchema } from '@/schemas';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

type StepfourProps = {
  form: UseFormReturn<z.infer<typeof ReportSchema>>;
};
const StepFour = ({ form }: StepfourProps) => {
  return (
    <div className=" px-6 space-y-6 ">
      <p className="text-gray-600  font-semibold text-center mb-8">
        Please provide the necessary information for this step.
      </p>
      <div className="space-y-6 mt-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="signal" className="col-span-1 text-sm font-semibold">
            Flow Reference Standard:
          </Label>
          <FormField
            control={form.control}
            name="In Situ Flow comparison.flow reference standard"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Input placeholder="0.0" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="In Situ Flow comparison.probability distribution"
            render={({ field }) => (
              <FormItem className="col-span-1  w-full">
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Prob. dist." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="uniform">Uniform</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="In Situ Flow comparison.sensitivity coefficient"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Input placeholder="sens. factor" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default StepFour;
