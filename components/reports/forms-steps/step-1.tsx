'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { ReportSchema } from '@/schemas';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
type StepOneProps = {
  form: UseFormReturn<z.infer<typeof ReportSchema>>;
};
const StepOne = ({ form }: StepOneProps) => {
  return (
    <div className=" px-6 space-y-6 ">
      <p className="text-gray-600  font-semibold text-center mb-8">
        Please provide the necessary information for this step.
      </p>
      <div className="space-y-6 mt-4">
        {/* Row 1 */}
        <div className="grid grid-cols-4 items-center gap-4">
          <h3 className="col-span-1 text-sm font-semibold">
            Specified Uncertainty from Manufacturer:
          </h3>

          <FormField
            control={form.control}
            name="Primary Metering Device.specified uncertainty from manufacturer.relative uncertainty"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Input placeholder="2%" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Primary Metering Device.specified uncertainty from manufacturer.probability distribution"
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
            name="Primary Metering Device.specified uncertainty from manufacturer.sensitivity coefficient"
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

        {/* Row 2 */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="col-span-1">Installation Effect:</Label>
          <FormField
            control={form.control}
            name="Primary Metering Device.installation effects.effects_relative_uncertainty_list"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Select
                    onValueChange={(val) => field.onChange([val])}
                    value={field.value?.[0]}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Drop-down" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="effect1">Effect 1</SelectItem>
                      <SelectItem value="effect2">Effect 2</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Primary Metering Device.installation effects.probability distribution"
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
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Primary Metering Device.installation effects.probability distribution"
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

        {/* Row 3 */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="col-span-1">Hydraulic Effects:</Label>
          <FormField
            control={form.control}
            name="Primary Metering Device.hydraulic effect.effects_relative_uncertainty_list"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Select
                    onValueChange={(val) => field.onChange([val])}
                    value={field.value?.[0]}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Drop-down" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hydro1">Hydraulic 1</SelectItem>
                      <SelectItem value="hydro2">Hydraulic 2</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Primary Metering Device.hydraulic effect.probability distribution"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="col-span-1">
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
            name="Primary Metering Device.installation effects.sensitivity coefficient"
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

        {/* Row 4 */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="col-span-1">Unsteady Flow:</Label>
          <FormField
            control={form.control}
            name="Primary Metering Device.unsteady flow.relative uncertainty"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Input placeholder="1%" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Primary Metering Device.unsteady flow.probability distribution"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="col-span-1">
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
            name="Primary Metering Device.unsteady flow.sensitivity coefficient"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Input placeholder="1.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Row 5 */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="col-span-1">
            Environmental Factors - Temperature:
          </Label>
          <FormField
            control={form.control}
            name="Primary Metering Device.env temperature effect.opert_temperature_c"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Input placeholder="T oper | [C]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 6 */}
        <div className="grid grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="Primary Metering Device.env temperature effect.uncert_temperature_c"
            render={({ field }) => (
              <FormItem className="col-span-1 col-start-2">
                <FormControl>
                  <Input placeholder="Delta (T) | [C]" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Primary Metering Device.env temperature effect.probability distribution"
            render={({ field }) => (
              <FormItem className="col-start-3">
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
            name="Primary Metering Device.env temperature effect.sensitivity coefficient"
            render={({ field }) => (
              <FormItem className="col-span-1 col-start-4">
                <FormControl>
                  <Input placeholder="sens. factor" className="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default StepOne;

// export default function PrimaryMeteringDevices() {
//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-6">
//       {/* this is the header of step 1 form */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-xl font-bold">
//             1. Primary Metering Devices
//           </CardTitle>
//           <div className="flex items-center gap-4 px-4 py-1">
//             <Badge variant="secondary">Needs Review</Badge>
//             <Check size={20} />
//           </div>
//         </CardHeader>
//         <CardContent className="text-gray-600  font-semibold">
//           Please provide the necessary information for this step.
//         </CardContent>

//         {/* this is the content of the form */}

//         <CardContent className="space-y-6 mt-4">
//           {/* Row 1 */}
//           <div className="grid grid-cols-4 items-center gap-4">
//             <h1 className="col-span-1 text-base font-semibold">
//               Specified Uncertainty - from Manufacturer:
//             </h1>
//             <Input className="col-span-1" placeholder="2%" />
//             <Select>
//               <SelectTrigger className="col-span-1">
//                 <SelectValue placeholder="Prob. dist." />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="normal">Normal</SelectItem>
//                 <SelectItem value="uniform">Uniform</SelectItem>
//               </SelectContent>
//             </Select>
//             <Input placeholder="sens. factor" className="col-span-1" />
//           </div>

//           {/* Row 2 */}
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label className="col-span-1">Installation Effect:</Label>
//             <Select>
//               <SelectTrigger className="col-span-1">
//                 <SelectValue placeholder="Drop-down" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="effect1">Effect 1</SelectItem>
//                 <SelectItem value="effect2">Effect 2</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select>
//               <SelectTrigger className="col-span-1">
//                 <SelectValue placeholder="Prob. dist." />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="normal">Normal</SelectItem>
//                 <SelectItem value="uniform">Uniform</SelectItem>
//               </SelectContent>
//             </Select>
//             <Input placeholder="sens. factor" className="col-span-1" />
//           </div>

//           {/* Row 3 */}
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label className="col-span-1">Hydraulic Effects:</Label>
//             <Select>
//               <SelectTrigger className="col-span-1">
//                 <SelectValue placeholder="Drop-down" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="hydro1">Hydraulic 1</SelectItem>
//                 <SelectItem value="hydro2">Hydraulic 2</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select>
//               <SelectTrigger className="col-span-1">
//                 <SelectValue placeholder="Prob. dist." />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="normal">Normal</SelectItem>
//                 <SelectItem value="uniform">Uniform</SelectItem>
//               </SelectContent>
//             </Select>
//             <Input placeholder="sens. factor" className="col-span-1" />
//           </div>

//           {/* Row 4 */}
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label className="col-span-1">Unsteady Flow:</Label>
//             <Input className="col-span-1" placeholder="1%" />
//             <Select>
//               <SelectTrigger className="col-span-1">
//                 <SelectValue placeholder="Prob. dist." />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="normal">Normal</SelectItem>
//                 <SelectItem value="uniform">Uniform</SelectItem>
//               </SelectContent>
//             </Select>
//             <Input placeholder="sens. factor" className="col-span-1" />
//           </div>
//           {/* Row 5 */}
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label className="col-span-1">
//               Environmental Factors - Temperature:
//             </Label>
//             <Input placeholder="T oper | [C]" className="col-span-1" />
//           </div>

//           {/* Row 6 */}
//           <div className="grid grid-cols-4 gap-4">
//             <Input
//               placeholder="Delta (T) | [C]"
//               className="col-span-1 col-start-2"
//             />
//             <Select className="col-start-3">
//               <SelectTrigger>
//                 <SelectValue placeholder="Prob. dist." />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="normal">Normal</SelectItem>
//                 <SelectItem value="uniform">Uniform</SelectItem>
//               </SelectContent>
//             </Select>
//             <Input
//               placeholder="sens. factor"
//               className="col-span-1 col-start-4"
//             />
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
