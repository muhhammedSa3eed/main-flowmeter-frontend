'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '../ui/label';

// نوع الداتا
type Rfp = {
  id: number;
  RfpReference: string;
  typeOfRfp: string;
  generalInfo: {
    licensee: string;
  };
};

interface Props {
  data: Rfp[];
  onSelect?: (item: Rfp | null) => void;
  setShowStepsForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FlowMeterSearch({ data, onSelect, setShowStepsForm }: Props) {
  console.log('from search', data);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Rfp | null>(null);

  const handleSelect = (item: Rfp) => {
    setSelected(item);
    onSelect?.(item);
    setOpen(false);
  };

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
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[88%] justify-between"
                    >
                      {selected ? (
                        <span>
                          {selected.RfpReference} —{' '}
                          {selected.generalInfo.licensee}
                        </span>
                      ) : (
                        'Select RFP...'
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0 w-auto"
                    align="start"
                    style={{ width: 'var(--radix-popover-trigger-width)' }}
                  >
                    {/* <PopoverContent className="w-[528px] p-0"> */}
                    <Command>
                      <CommandInput placeholder="Search RFP..." />
                      <CommandEmpty>No RFP found.</CommandEmpty>
                      <CommandGroup>
                        {Array.isArray(data) &&
                          data.length > 0 &&
                          data.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={`${item.RfpReference} ${item.generalInfo.licensee} ${item.typeOfRfp}`}
                              onSelect={() => handleSelect(item)}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  selected?.id === item.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {item.RfpReference}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {item.generalInfo.licensee} ({item.typeOfRfp})
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button
              className="w-[88%] bg-green-500 text-lg"
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
}
