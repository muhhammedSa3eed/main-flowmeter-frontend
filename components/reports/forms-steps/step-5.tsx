'use client';

import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReportSchema } from '@/schemas';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

type StepFiveProps = {
  form: UseFormReturn<z.infer<typeof ReportSchema>>;
};
const StepFive = ({ form }: StepFiveProps) => {
  return (
    <div className=" px-6 space-y-6 ">
      <p className="text-gray-600  font-semibold text-center mb-8">
        Please provide the necessary information for this step.
      </p>
      <div className="space-y-6 mt-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="signal" className="col-span-1 text-sm font-semibold">
            Coverage Probability:
          </Label>
          <FormField
            control={form.control}
            name="coverage probability"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Input placeholder="0.95" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default StepFive;
