"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RfpDateField, RfpFormData } from "@/types";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useId, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const flowMeasurement = [
  {
    id: 1,
    title: "24h cumulative flow (m³) with date",
    value: "24h_cumulative_flow_(m³)_with_date",
  },
  {
    id: 2,
    title: "15minute flow data (l/s) with time/ date",
    value: "15minute_flow_data_(l/s)_with_time/_date",
  },
  {
    id: 3,
    title: "Event recording with time/ date",
    value: "Event_recording_with_time/_date",
  },
];
export function Step5() {
  const { control } = useFormContext<RfpFormData>();
  const id = useId();
  const fields: RfpDateField[] = [
    {
      name: "FlowmeterDetails.flowMonitoring.meterInstallDate",
      label: "Meter Install Date",
    },
    {
      name: "FlowmeterDetails.flowMonitoring.meterRemovalDate",
      label: "Meter Removal Date",
    },
  ];
  const years = Array.from({ length: 30 }, (_, i) => 2000 + i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [dates, setDates] = useState<Record<string, Date | undefined>>({});
  const [monthsState, setMonthsState] = useState<Record<string, number>>({});
  const [yearsState, setYearsState] = useState<Record<string, number>>({});
  return (
    <div className="rounded-xl border bg-muted/50 p-6 shadow-sm space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Flow Diagram Reference */}
        <FormField
          control={control}
          name="FlowmeterDetails.flowMonitoring.flowDiagramRef"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flow Diagram Reference</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter flow diagram reference"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="FlowmeterDetails.flowMonitoring.selectedOption"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Flow data measurement capabilities</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {flowMeasurement.map((item) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                field.onChange(newDate ? newDate.toISOString() : "");
              };

              return (
                <FormItem>
                  <FormControl>
                    <div className="*:not-first:mt-2">
                      <Label htmlFor={id}>{fieldDef.label}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                              !currentDate && "text-muted-foreground"
                            )}
                          >
                            <span
                              className={cn(
                                "truncate",
                                !currentDate && "text-muted-foreground"
                              )}
                            >
                              {currentDate
                                ? format(currentDate, "PPP")
                                : "Pick a date"}
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
      </div>
    </div>
  );
}
