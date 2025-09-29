'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RfpDateField, RfpFormData } from '@/types';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useId, useState } from 'react';

export const Step2 = () => {
  const { control } = useFormContext<RfpFormData>();
  const id = useId();
  const fields: RfpDateField[] = [
    { name: 'GeneralInfo.reportDate', label: 'Report Date' },
  ];
  const years = Array.from({ length: 30 }, (_, i) => 2000 + i);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [dates, setDates] = useState<Record<string, Date | undefined>>({});
  const [monthsState, setMonthsState] = useState<Record<string, number>>({});
  const [yearsState, setYearsState] = useState<Record<string, number>>({});

  const radioGroups = [
    { id: 0, value: 'inletToWwTreatment', title: 'Inlet to WW Treatment' },
    {
      id: 1,
      value: 'outletFromWwTreatment',
      title: 'Outlet from WW Treatment',
    },
    { id: 2, value: 'terminalPumpingOutput', title: 'Terminal Pumping Output' },
    {
      id: 3,
      value: 'wastewaterTankerDischarge',
      title: 'Wastewater Tanker Discharge',
    },
    { id: 4, value: 'tankerFillPoint', title: 'Tanker Fill Point' },
    { id: 5, value: 'incidentReporting', title: 'Incident Reporting' },
  ];

  // Watch current values
  // const values = watch("GeneralInfo.locationType");

  // const handleSingleSelect = (selectedName: LocationTypeKeys) => {
  //   radioGroups.forEach(({ name }) => {
  //     setValue(`GeneralInfo.locationType.${name}`, name === selectedName);
  //   });
  // };

  return (
    <div className="rounded-xl border bg-muted/50 p-6 shadow-sm space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={control}
          name="GeneralInfo.licensee"
          render={({ field }) => (
            <FormItem>
              <label className="block text-sm font-medium">
                Licensee/Company <span className="text-red-500">*</span>
              </label>
              <FormControl>
                <Input
                  placeholder="Enter Licensee"
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
          name="GeneralInfo.address"
          render={({ field }) => (
            <FormItem>
              <label className="block text-sm font-medium">
                Address <span className="text-red-500">*</span>
              </label>
              <FormControl>
                <Input
                  placeholder="Enter Address"
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
          name="GeneralInfo.reportRef"
          render={({ field }) => (
            <FormItem>
              <label className="block text-sm font-medium">
                Report Reference <span className="text-red-500">*</span>
              </label>
              <FormControl>
                <Input
                  placeholder="Enter Report Reference"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields.map((fieldDef) => (
          <FormField
            key={fieldDef.name}
            control={control}
            name={fieldDef.name as keyof RfpFormData}
            render={({ field }) => {
              const currentDate =
                dates[fieldDef.name] ??
                (field.value
                  ? new Date(field.value as unknown as string)
                  : undefined);
              const year =
                yearsState[fieldDef.name] ??
                currentDate?.getFullYear() ??
                new Date().getFullYear();
              const month =
                monthsState[fieldDef.name] ??
                currentDate?.getMonth() ??
                new Date().getMonth();

              const updateDate = (newDate: Date | undefined) => {
                setDates((prev) => ({ ...prev, [fieldDef.name]: newDate }));
                field.onChange(newDate ? newDate.toISOString() : '');
              };

              return (
                <FormItem>
                  <FormControl>
                    <div className="*:not-first:mt-3">
                      <Label htmlFor={id}>{fieldDef.label}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px] mb-0',
                              !currentDate && 'text-muted-foreground'
                            )}
                          >
                            <span
                              className={cn(
                                'truncate',
                                !currentDate && 'text-muted-foreground'
                              )}
                            >
                              {currentDate
                                ? format(currentDate, 'PPP')
                                : 'Pick a date'}
                            </span>
                            <CalendarIcon
                              size={16}
                              className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-4 space-y-2"
                          align="start"
                        >
                          <div className="flex gap-2">
                            <Select
                              onValueChange={(v) =>
                                setMonthsState((prev) => ({
                                  ...prev,
                                  [fieldDef.name]: parseInt(v),
                                }))
                              }
                              value={String(month)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                              <SelectContent>
                                {months.map((m, i) => (
                                  <SelectItem key={m} value={String(i)}>
                                    {m}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              onValueChange={(v) =>
                                setYearsState((prev) => ({
                                  ...prev,
                                  [fieldDef.name]: parseInt(v),
                                }))
                              }
                              value={String(year)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                {years.map((y) => (
                                  <SelectItem key={y} value={String(y)}>
                                    {y}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Calendar
                            mode="single"
                            selected={currentDate}
                            onSelect={(selectedDate) =>
                              updateDate(selectedDate)
                            }
                            month={new Date(year, month)}
                            onMonthChange={(d) => {
                              setYearsState((prev) => ({
                                ...prev,
                                [fieldDef.name]: d.getFullYear(),
                              }));
                              setMonthsState((prev) => ({
                                ...prev,
                                [fieldDef.name]: d.getMonth(),
                              }));
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        ))}
        <FormField
          control={control}
          name="GeneralInfo.contactNumber"
          render={({ field }) => (
            <FormItem>
              <label className="block text-sm font-medium">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <FormControl>
                <Input type="text" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="GeneralInfo.faxNumber"
          render={({ field }) => (
            <FormItem>
              <label className="block text-sm font-medium">Fax Number</label>
              <FormControl>
                <Input type="text" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="GeneralInfo.responsiblePosition"
          render={({ field }) => (
            <FormItem>
              <label className="block text-sm font-medium">
                Position title
              </label>
              <FormControl>
                <Input
                  placeholder="Responsible person for flowmeter location"
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
          name="GeneralInfo.responsibleDepartment"
          render={({ field }) => (
            <FormItem>
              <label className="block text-sm font-medium">Department</label>
              <FormControl>
                <Input
                  placeholder="Responsible person for flowmeter location"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={control}
          name="GeneralInfo.fmIdScada"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                SCADA ID <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter SCADA ID"
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
          name="GeneralInfo.fmIdSwsAssetNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                SWS Asset No <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter SWS Asset No"
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
          name="GeneralInfo.siteManagerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Manager Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Site Manager Name"
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
          name="GeneralInfo.rfpNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RFP No</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter RFP No"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="GeneralInfo.locationType"
        render={({ field }) => (
          <FormItem className="mb-2 flex-1">
            <FormLabel>Location Type</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {radioGroups.map((item) => (
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
    </div>
  );
};
