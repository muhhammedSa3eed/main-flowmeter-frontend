"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { RfpDateField, RfpFormData } from "@/types";
import { useId, useState } from "react";
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

export const Step3 = () => {
  const { control } = useFormContext<RfpFormData>();
  const id = useId();

  const fields: RfpDateField[] = [
    {
      name: "approvalDetails.approvalExpiry",
      label: "Approval Expiry",
    },
    {
      name: "approvalDetails.approvedReapplication",
      label: "Approved Reapplication",
    },
    {
      name: "approvalDetails.appealApplication",
      label: "Appeal Application",
    },
    {
      name: "approvalDetails.appealExtensionApplication",
      label: "Appeal Extension Application",
    },
    {
      name: "approvalDetails.appealExtensionDecision",
      label: "Appeal Extension Decision",
    },
    {
      name: "approvalDetails.panelAppealMeeting",
      label: "Panel Appeal Meeting",
    },
    {
      name: "approvalDetails.panelAppealDecisionDate",
      label: "Panel Appeal Decision Date",
    },
    {
      name: "approvalDetails.doeAppealDecisionDate",
      label: "DOE Appeal Decision Date",
    },
    {
      name: "approvalDetails.panelAppealFinalResult",
      label: "Panel Final Result (APP/REJ)",
      type: "text",
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
                              {currentDate instanceof Date &&
                              !isNaN(currentDate.getTime())
                                ? format(currentDate, "PPP")
                                : "Pick a date"}{" "}
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
};
