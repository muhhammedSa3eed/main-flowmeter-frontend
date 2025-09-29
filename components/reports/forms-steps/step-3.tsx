'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ReportSchema } from '@/schemas';
import { CalendarIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { format, isValid, parseISO } from 'date-fns';

type StepThreeProps = {
  form: UseFormReturn<z.infer<typeof ReportSchema>>;
};
const StepThree = ({ form }: StepThreeProps) => {
  return (
    <div className=" px-6 space-y-6 ">
      <p className="text-gray-600  font-semibold text-center mb-8">
        Please provide the necessary information for this step.
      </p>
      <div className="space-y-6 mt-4">
        {/* Row 1 */}
        <div className="grid grid-cols-4 items-center gap-4">
          <h3 className="col-span-1 text-sm font-semibold">Weighted Error:</h3>

          <FormField
            control={form.control}
            name="Data Collection.weighted error.start date"
            render={({ field }) => {
              const parsed = field.value ? parseISO(field.value) : undefined;
              const selectedDate =
                parsed && isValid(parsed) ? parsed : undefined;

              return (
                <FormItem className="w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {selectedDate ? (
                            format(selectedDate, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) =>
                          // نخزن في الفورم كـ 'yyyy-MM-dd' أو نمرر undefined لو اتلغى
                          field.onChange(
                            date ? format(date, 'yyyy-MM-dd') : undefined
                          )
                        }
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="Data Collection.weighted error.probability distribution"
            render={({ field }) => (
              <FormItem className="col-span-1">
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Data Collection.weighted error.sensitivity coefficient"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Input placeholder="sens. factor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/*Row 2*/}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="display" className="col-span-1 text-sm font-semibold">
            Data Signal Conversion:
          </Label>
          <FormField
            control={form.control}
            name="Data Collection.data signal conversion.no decimal points"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Input id="display" placeholder="Decimal Pts" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Data Collection.data signal conversion.probability distribution"
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
            name="Data Collection.data signal conversion.sensitivity coefficient"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Input placeholder="sens. factor" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {/*Row 3 */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="signal" className="col-span-1 text-sm font-semibold">
            Estimates for missing data:
          </Label>
          <FormField
            control={form.control}
            name="Data Collection.estimates for missing data.relative uncertainty"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Input placeholder="2%" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Data Collection.estimates for missing data.probability distribution"
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
            name="Data Collection.estimates for missing data.sensitivity coefficient"
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

export default StepThree;

{
  /* <FormField
            control={form.control}
            name="Data Collection.weighted error.start date"
            render={({ field }) => (
              <FormItem className="w-full">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(
                          date ? format(date, 'yyyy-MM-dd') : undefined
                        )
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          /> */
}
