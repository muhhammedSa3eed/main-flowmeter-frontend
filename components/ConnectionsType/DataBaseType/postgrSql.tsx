import React, { useId, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Eye, EyeOff } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ConnectionSchema } from '@/schemas';
import { z } from 'zod';
import { Label } from '@radix-ui/react-dropdown-menu';

type ConnectionFormValues = z.infer<typeof ConnectionSchema>;

interface PostgrSqlProps {
  form: UseFormReturn<ConnectionFormValues>;
}
export default function PostgrSqlForm({ form }: PostgrSqlProps) {
  const id = useId();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <>
      <Label>Configure Postgresql </Label>

      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="property.host"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="group relative w-full  mt-7">
                  <FormLabel className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground">
                    <span className="inline-flex bg-background px-2">Host</span>
                  </FormLabel>

                  <Input type="text" placeholder="Host" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="property.port"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="group relative w-full  mt-7">
                  <FormLabel
                    htmlFor={id}
                    className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                  >
                    <span className="inline-flex bg-background px-2">Port</span>
                  </FormLabel>

                  <Input
                    id={id}
                    type="number"
                    placeholder="Port"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="property.databaseName"
        render={({ field }) => (
          <FormItem className="mb-2">
            <FormControl>
              <div className="group relative  mt-7">
                <FormLabel
                  htmlFor={id}
                  className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                >
                  <span className="inline-flex bg-background px-2">
                  Database Name
                  </span>
                </FormLabel>

                <Input
                  id={id}
                  type="text"
                  placeholder=" Database Name"
                  {...field}
                  className="w-full"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="property.user"
          render={({ field }) => (
            <FormItem className="mb-2 flex-1">
              <FormControl>
                <div className="group relative mt-3">
                  <FormLabel
                    htmlFor={id}
                    className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                  >
                    <span className="inline-flex bg-background px-2">
                    Username
                    </span>
                  </FormLabel>

                  <Input
                    id={id}
                    type="text"
                    placeholder="Username"
                    {...field}
                    className="w-full"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="property.password"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="space-y-2">
                  <div className="relative">
                    <div className="group relative mt-3">
                      <FormLabel
                        htmlFor={id}
                        className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                      >
                        <span className="inline-flex bg-background px-2">
                          Password
                        </span>
                      </FormLabel>

                      <Input
                        id={id}
                        className="pe-9"
                        placeholder="Password"
                        type={isVisible ? 'text' : 'password'}
                        {...field}
                      />
                    </div>

                    <button
                      className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10  focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label={isVisible ? 'Hide password' : 'Show password'}
                      aria-pressed={isVisible}
                      aria-controls="password"
                    >
                      {isVisible ? (
                        <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                      ) : (
                        <Eye size={16} strokeWidth={2} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
