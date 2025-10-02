/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Label } from '@/components/ui/label';
import { useState, Dispatch, SetStateAction, useEffect } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { cn } from '@/lib/utils';

interface FlowProps {
  setShowStepsForm: Dispatch<SetStateAction<boolean>>;
 
}
const FlowMeterSearch = ({ setShowStepsForm }: FlowProps) => {
  const [location, setLocation] = useState<string | number>('');
  const [searchTerm, setSearchTerm] = useState('');
  console.log({ searchTerm });
  const [comboboxOptions, setComboboxOptions] = useState<any>([]);
  useEffect(() => {
    if (!searchTerm) return;

    const handler = setTimeout(() => {
      const fetchOptions = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/rfps/quick?q=${searchTerm}`,
            { headers: { 'Content-Type': 'application/json' } }
          );
          const result = await res.json();
          setComboboxOptions(result.data || []);
        } catch (error) {
          console.error('Error fetching options:', error);
        }
      };

      fetchOptions();
    }, 3000); // debounce 500ms

    return () => clearTimeout(handler); // cleanup لو اليوزر كمل كتابة بسرعة
  }, [searchTerm]);
  // request for combobox
  // const sendLocationRequest = async (query: string | number) => {
  //   console.log({ query });
  //   if (!query) return;

  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/rfps/quick?q=${query}`,
  //       {
  //         method: 'GET',
  //         headers: { 'Content-Type': 'application/json' },
  //       }
  //     );
  //     const result = await res.json();
  //     console.log('Combobox Response:', result);
  //     setComboboxOptions(result.data);
  //   } catch (error) {
  //     console.error('Error (combobox):', error);
  //   }
  // };

  // // debounced versions
  // const debouncedLocationRequest = useCallback(
  //   debounce((loc: string | number) => {
  //     sendLocationRequest(loc);
  //   }, 3000),
  //   []
  // );

  // const handleLocationChange = (val: string | number) => {
  //   console.log({ val });
  //   setLocation(val);
  //   debouncedLocationRequest(val);
  // };

  console.log({ comboboxOptions });
  return (
    <div className="grid grid-cols-4 gap-20">
      <div className="bg-white"></div>
      <div className="col-span-2 bg-white shadow p-12">
        <div className="flex item-center justify-center">
          <div className="w-[85%]">
            <h2 className="text-2xl font-bold mb-2">Select Flow Meter</h2>
            <p className="mb-6 text-gray-500">
              Please select the flow meter to begin generating the Uncertainty
              Budget report.
            </p>

            <div className="space-y-2 w-[100%] mb-6">
              <div>
                <Label htmlFor="meter" className="mb-2 text-base gap-0.5">
                  <span className="text-red-500">*</span>Meter ID, Meter Area,
                  Meter Capacity
                </Label>
                {/* <Combobox value={location} onChange={handleLocationChange} /> */}
                <Combobox
                  value={location}
                  onChange={setLocation}
                  setSearchTerm={setSearchTerm}
                  options={comboboxOptions}
                />
              </div>
            </div>

            <Button
              className="w-full bg-green-500 text-lg"
              onClick={() => setShowStepsForm(true)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white"></div>
    </div>
  );
};

export default FlowMeterSearch;

function Combobox({
  value,
  onChange,
  setSearchTerm,
  options,
}: {
  value: any;
  onChange: (val: any) => void;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  options: any[];
}) {
  const [open, setOpen] = useState(false);
  // const debouncedSearch = useCallback(
  //   debounce((val: string | number) => {
  //     onSearch(val);
  //   }, 500),
  //   []
  // );
  console.log({ options });
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? value.RfpReference : 'e.g.. WF-2023-001...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="e.g.. WF-2023-001..."
            onValueChange={(val) => setSearchTerm(val)}
          />
          <CommandEmpty>No flow meter found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.RfpReference}
                  onSelect={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value?.id === option.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div>
                    <p className="font-medium">{option.RfpReference}</p>
                    <p className="text-xs text-gray-500">
                      {option.generalInfo?.licensee} –{' '}
                      {option.location?.description}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
// function Combobox({
//   value,
//   onChange,
// }: {
//   value: string | number;
//   onChange: (val: string | number) => void;
// }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-full justify-between"
//         >
//           {value
//             ? LOCATION_OPTIONS.find((option) => option.value === value)?.label
//             : 'e.g.. WF-2023-001...'}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>

//       <PopoverContent className="w-full p-0">
//         <Command>
//           <CommandInput placeholder="e.g.. WF-2023-001..." />
//           <CommandEmpty>No location found.</CommandEmpty>
//           <CommandList>
//             <CommandGroup>
//               {LOCATION_OPTIONS.map((option) => (
//                 <CommandItem
//                   key={option.value}
//                   value={String(option.value)}
//                   onSelect={() => {
//                     onChange(option.value);
//                     setOpen(false);
//                   }}
//                 >
//                   <Check
//                     className={cn(
//                       'mr-2 h-4 w-4',
//                       value === option.value ? 'opacity-100' : 'opacity-0'
//                     )}
//                   />
//                   {option.label}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }

export const LOCATION_OPTIONS = [
  { label: '1 - Abu Dhabi - 58', value: 1 },
  { label: '2 - Dubai - 124', value: 2 },
  { label: '3 - Sharjah - 358', value: 3 },
  { label: '4 - Ajman - 237', value: 4 },
  { label: '5 - Fujairah - 351', value: 5 },
  { label: '6 - Ras Al Khaimah - 87', value: 6 },
  { label: '7 - Umm Al Quwain - 254', value: 7 },
  { label: '8 - Abu Dhabi - 218', value: 8 },
  { label: '9 - Dubai - 124', value: 9 },
  { label: '10 - Sharjah - 288', value: 10 },
];
