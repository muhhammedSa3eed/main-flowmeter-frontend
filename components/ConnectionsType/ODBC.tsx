import React from 'react';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@radix-ui/react-dropdown-menu';
import { z } from 'zod';
import { ConnectionSchema } from '@/schemas';
import { UseFormReturn } from 'react-hook-form';

type ConnectionFormValues = z.infer<typeof ConnectionSchema>;

interface S7Props {
  form: UseFormReturn<ConnectionFormValues>;
}

export default function ODBCForm({ form }: S7Props) {
  return (
    <>
      <Label>Configure ODBC </Label>

      <div className="col-span-4">
        <div className="flex gap-4">
         

          <FormField
            control={form.control}
            name="property.dsn"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>DSN</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter DSN"
                    {...field}
                    value={field.value ?? ""}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

     
      </div>
    </>
  );
}
