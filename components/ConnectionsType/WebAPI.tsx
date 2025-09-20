// components/WebApi.tsx

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { ConnectionSchema } from '@/schemas';
import { UseFormReturn } from 'react-hook-form';

type ConnectionFormValues = z.infer<typeof ConnectionSchema>;

interface WebAPIFormProps {
  form: UseFormReturn<ConnectionFormValues>;
}

export default function WebAPIForm({ form }: WebAPIFormProps) {
  return (
    <>
      <Label>Configure WebAPI </Label>
      <div className="col-span-4">
        <div className="flex gap-4 mb-2">
          <FormField
            control={form.control}
            name="property.method"
            render={({ field }) => (
              <FormItem className="mt-2 w-full flex-1">
                <FormLabel>Method</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="GET">GET</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="property.format"
            render={({ field }) => (
              <FormItem className="mt-2 w-full flex-1">
                <FormLabel>Format</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="JSON">JSON </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="property.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL (http://[server]:[port])</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter URL"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
