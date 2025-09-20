// components/Database.tsx
import {
  Select,
  SelectContent,
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
import PostgrSqlForm from './DataBaseType/postgrSql';
import MsSqlForm from './DataBaseType/MsSql';


const databaseOptions = [
  { id: 2, value: 'mssql', label: 'MsSql' },
  { id: 4, value: 'postgres', label: 'PostgreSql' },
];
type ConnectionFormValues = z.infer<typeof ConnectionSchema>;
interface DbProps {
  form: UseFormReturn<ConnectionFormValues>;
}

export default function DbForm({ form }: DbProps) {
  const selectedType = form.watch('property.dbType');
  console.log(typeof form.watch('property.dbType'), form.watch('property.dbType'));
  return (
    <>
      <div className="group relative w-full mt-2">
            <FormLabel className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[select:disabled]:opacity-50">
              Database Type
            </FormLabel>
            <FormField
              control={form.control}
              name="property.dbType"
              render={({ field }) => (
                <FormItem className="mb-2 flex-1">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        {databaseOptions.map((item) => (
                          <SelectItem key={item.id} value={item.value}>
                            {item.label}
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
      {selectedType === 'postgres' && <PostgrSqlForm form={form} />}
      {selectedType === 'mssql' && <MsSqlForm form={form} />}
  
    </>
  );
}
