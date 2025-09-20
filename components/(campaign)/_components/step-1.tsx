"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
// import { ResponseGroup } from "@/types";

// interface Step1Props {
//   RfpType?: ResponseGroup[]; // Optional with default value
// }

export const RfpTypeData = [
  {
    label: "Treatment Types",
    options: [
      { value: "Inlet", label: "Inlet", icon: "🟢" },
      { value: "Outlet", label: "Outlet", icon: "🔵" },
    ],
  },
  {
    label: "Other",
    options: [
      { value: "Monitoring", label: "Monitoring", icon: "📊" },
      { value: "Discharge", label: "Discharge", icon: "🚛" },
    ],
  },
];
export const Step1 = () => {// { RfpType = [] }: Step1Props

  const { control } = useFormContext();

  return (
    <div className="rounded-xl border bg-muted/50 p-6 shadow-sm space-y-3">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Type of RFP Field */}
        <FormField
          control={control}
          name="BasicInformation.typeOfRfp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Type of RFP <span className="text-red-500">*</span>
              </FormLabel>

              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger className="select-trigger">
                    <SelectValue placeholder="Select RFP type..." />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {RfpTypeData.length > 0 ? (
                    <>
                      {RfpTypeData.map((group) => (
                        <SelectGroup key={group.label}>
                          <div className="text-muted-foreground text-sm p-2 font-semibold">
                            {group.label}
                          </div>
                          {group.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.icon
                                ? `${option.icon} ${option.label}`
                                : option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </>
                  ) : (
                    <div className="text-muted-foreground text-sm p-2">
                      No RFP Types Available
                    </div>
                  )}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* RFP Reference Field */}
        <FormField
          control={control}
          name="BasicInformation.rfpReference"
          render={({ field }) => (
            <FormItem >
              <FormLabel>
                RFP Reference <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="E.g. GHNT-RFP001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
