'use client';

import { Button } from '@/components/ui/button';
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReportSchema } from '@/schemas';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { useFieldArray } from 'react-hook-form';

type StepTwoProps = {
  form: UseFormReturn<z.infer<typeof ReportSchema>>;
};
const StepTwo = ({ form }: StepTwoProps) => {
  const [open, setOpen] = useState(false);
  const { control } = form;

  const { fields } = useFieldArray({
    control,
    name: 'Secondary Metering Device.signal conversion.test samples',
  });

  return (
    <div className=" px-6 space-y-6 ">
      <p className="text-gray-600  font-semibold text-center mb-8">
        Please provide the necessary information for this step.
      </p>
      <div className="space-y-6 mt-4">
        {/* Row 1 */}
        <div className="grid grid-cols-4 items-center gap-4">
          <h3 className="col-span-1 text-sm font-semibold">
            Electronic Instrumentation:
          </h3>

          <FormField
            control={form.control}
            name="Secondary Metering Device.electronic instrumentation.relative uncertainty"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormControl>
                  <Input placeholder="0.02" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Secondary Metering Device.electronic instrumentation.probability distribution"
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
            name="Secondary Metering Device.electronic instrumentation.sensitivity coefficient"
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
            Display Resolution:
          </Label>
          <FormField
            control={form.control}
            name="Secondary Metering Device.display resolution.no decimal points"
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
            name="Secondary Metering Device.display resolution.probability distribution"
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
            name="Secondary Metering Device.display resolution.sensitivity coefficient"
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
            Signal Conversion:
          </Label>

          <Button onClick={() => setOpen(true)}>Analyze</Button>

          <FormField
            control={form.control}
            name="Secondary Metering Device.signal conversion.probability distribution"
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
            name="Secondary Metering Device.signal conversion.sensitivity coefficient"
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
      {/*The Sheet Modal*/}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="!w-[450px] !max-w-none p-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">
              Signal Conversion Analysis
            </SheetTitle>
          </SheetHeader>
          {/* Row One */}
          <div className="mt-6 space-y-4">
            <div>
              <Label className="my-2 text-sm">
                Flow Full Scale (m
                <sup>3</sup>/hr)
              </Label>
              <FormField
                control={form.control}
                name="Secondary Metering Device.signal conversion.full flow scale"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormControl>
                      <Input placeholder="2000" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {/* Row Two */}
            <div className="flex items-center justify-between gap-3 ">
              <div className="w-1/2">
                <Label className="my-2 text-sm">
                  Output Current Range Min (mA)
                </Label>
                <FormField
                  control={form.control}
                  name="Secondary Metering Device.signal conversion.min current output"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="4.0" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <Label className="my-2 text-sm">
                  Output Current Range Max (mA)
                </Label>
                <FormField
                  control={form.control}
                  name="Secondary Metering Device.signal conversion.max current output"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="20" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Row Three */}
            <div className="flex items-center justify-between gap-3 ">
              <div className="w-1/2">
                <Label className="my-2 text-sm">
                  Repeatability Accurcy (%)
                </Label>
                <FormField
                  control={form.control}
                  name="Secondary Metering Device.signal conversion.repeatability error"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="0.1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <Label className="my-2 text-sm">Meter Accurcy (%)</Label>
                <FormField
                  control={form.control}
                  name="Secondary Metering Device.signal conversion.meter accuracy"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="0.015"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold mt-3">Test Sample</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Sample</TableHead>
                <TableHead>Current (mA)</TableHead>
                <TableHead>Flow (m³/hr)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">
                    Sample {index + 1}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="any"
                      {...form.register(
                        `Secondary Metering Device.signal conversion.test samples.${index}.0` as const,
                        { valueAsNumber: true }
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="any"
                      {...form.register(
                        `Secondary Metering Device.signal conversion.test samples.${index}.1` as const,
                        { valueAsNumber: true }
                      )}
                    />
                  </TableCell>
                </TableRow>

                // <TableRow key={field.id}>
                //   <TableCell className="font-medium">
                //     Sample {index + 1}
                //   </TableCell>
                //   <TableCell>
                //     <Input
                //       type="number"
                //       step="any"
                //       {...form.register(
                //         `Secondary Metering Device.signal conversion.test samples.${index}.0` as const,
                //         { valueAsNumber: true }
                //       )}
                //     />
                //   </TableCell>
                //   <TableCell>
                //     <Input
                //       type="number"
                //       step="any"
                //       {...form.register(
                //         `Secondary Metering Device.signal conversion.test samples.${index}.1` as const,
                //         { valueAsNumber: true }
                //       )}
                //     />
                //   </TableCell>
                // </TableRow>
              ))}
            </TableBody>
            {/* <TableBody>
              <TableRow>
                <TableCell className="font-medium">Sample 1</TableCell>
                <TableCell>
                  <Input defaultValue="8.0" />
                </TableCell>
                <TableCell>
                  <Input defaultValue="25.0" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Sample 2</TableCell>
                <TableCell>
                  <Input defaultValue="12.0" />
                </TableCell>
                <TableCell>
                  <Input defaultValue="50.0" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Sample 3</TableCell>
                <TableCell>
                  <Input defaultValue="16.0" />
                </TableCell>
                <TableCell>
                  <Input defaultValue="75.0" />
                </TableCell>
              </TableRow>
            </TableBody> */}
          </Table>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default StepTwo;

{
  /* <CardContent className="space-y-6 mt-4">
         
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="electronic"
              className="col-span-1 text-sm font-semibold"
            >
              Electronic Instrumentation:
            </Label>
            <Input id="electronic" className="col-span-1" placeholder="2%" />
            <Select>
              <SelectTrigger className="col-span-1 w-full">
                <SelectValue placeholder="Prob. dist." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="uniform">Uniform</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="sens. factor" className="col-span-1" />
          </div>

       
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="display"
              className="col-span-1 text-sm font-semibold"
            >
              Display Resolution:
            </Label>
            <Input
              id="display"
              className="col-span-1"
              placeholder="Decimal Pts"
            />
            <Select>
              <SelectTrigger className="col-span-1 w-full">
                <SelectValue placeholder="Prob. dist." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="uniform">Uniform</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="sens. factor" className="col-span-1" />
          </div>

        
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="signal"
              className="col-span-1 text-sm font-semibold"
            >
              Signal Conversion:
            </Label>

            <Button onClick={() => setOpen(true)}>Analyze</Button>

            <Select>
              <SelectTrigger className="col-span-1 w-full">
                <SelectValue placeholder="Prob. dist." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="uniform">Uniform</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="sens. factor" className="col-span-1" />
          </div>
        </CardContent>
      </Card>

      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="!w-[450px] !max-w-none p-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">
              Signal Conversion Analysis
            </SheetTitle>
          </SheetHeader>
          {/* Row One */
}
//       <div className="mt-6 space-y-4">
//         <div>
//           <Label className="my-2 text-sm">
//             Flow Full Scale (m
//             <sup>3</sup>/hr)
//           </Label>
//           <Input placeholder="2000" />
//         </div>
//         Row Two
//         <div className="flex items-center justify-between gap-3 ">
//           <div className="w-1/2">
//             <Label className="my-2 text-sm">
//               Output Current Range Min (mA)
//             </Label>
//             <Input placeholder="4.0" className="w-full" />
//           </div>
//           <div className="w-1/2">
//             <Label className="my-2 text-xs">
//               Output Current Range Max (mA)
//             </Label>
//             <Input placeholder="20" className="w-full" />{" "}
//           </div>
//         </div>
//         Row Three
//         <div className="flex items-center justify-between gap-3 ">
//           <div className="w-1/2">
//             <Label className="my-2 text-xs">
//               Repeatability Accurcy (%)
//             </Label>
//             <Input placeholder="0.1" className="w-full" />
//           </div>
//           <div className="w-1/2">
//             <Label className="my-2 text-xs">Meter Accurcy (%)</Label>
//             <Input placeholder="0.015" className="w-full" />{" "}
//           </div>
//         </div>
//       </div>
//       <h2 className="text-xl font-semibold">Test Sample</h2>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-[150px]">Sample</TableHead>
//             <TableHead>Current (mA)</TableHead>
//             <TableHead>Flow (m³/hr)</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           <TableRow>
//             <TableCell className="font-medium">Sample 1</TableCell>
//             <TableCell>
//               <Input defaultValue="8.0" />
//             </TableCell>
//             <TableCell>
//               <Input defaultValue="25.0" />
//             </TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell className="font-medium">Sample 2</TableCell>
//             <TableCell>
//               <Input defaultValue="12.0" />
//             </TableCell>
//             <TableCell>
//               <Input defaultValue="50.0" />
//             </TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell className="font-medium">Sample 3</TableCell>
//             <TableCell>
//               <Input defaultValue="16.0" />
//             </TableCell>
//             <TableCell>
//               <Input defaultValue="75.0" />
//             </TableCell>
//           </TableRow>
//         </TableBody>
//       </Table>
//     </SheetContent>
//   </Sheet>
// </div>
// );
