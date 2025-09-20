/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { ChevronDownIcon } from "lucide-react";

import { ConnectionSchema } from "@/schemas";
import { SelectPolling, SelectType } from "@/types";
import WebAPIForm from "@/components/ConnectionsType/WebAPI";
import DbForm from "@/components/ConnectionsType/DB";
import ODBCForm from "@/components/ConnectionsType/ODBC";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Link from "next/link";
import MultipleSelector from "@/components/ui/multiselect";
interface AddConnectionsProps {
  selectType: SelectType[];
  selectPolling: SelectPolling[];
}
type Option = {
  label: string;
  value: string;
};
export default function AddConnections({
  selectType,
  selectPolling,
}: AddConnectionsProps) {
  const token = Cookies.get("token");

  const [isTestConnectionSuccessful, setIsTestConnectionSuccessful] =
    useState(false);
  const [tableOptions, setTableOptions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [tableFields, setTableFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<Option[]>([]);
  const form = useForm<z.infer<typeof ConnectionSchema>>({
    resolver: zodResolver(ConnectionSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "",
      property: {
        dbType: "",
        databaseName: "",
        method: "",
        format: "",
        address: "",
        ip: "",
        port: undefined,
        host: "",
        user: "",
        password: "",
      },
      polling: undefined,
      enabled: false,
    },
  });

  const selectedType = form.watch("type");
  useEffect(() => {
    if (!form.formState.isDirty) return;

    // Clear property fields
    form.setValue("property", {
      dbType: "",
      databaseName: "",
      method: "",
      format: "",
      address: "",
      ip: "",
      port: undefined,
      host: "",
      user: "",
      password: "",
      tableName: "",
      dsn: "",
    });

    setIsTestConnectionSuccessful(false);
    setTableOptions([]);
  }, [selectedType]);

  async function onSubmit(values: z.infer<typeof ConnectionSchema>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/devices/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(values),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          errorData.message || errorData.error || "Failed to add connection"
        );
        return;
      }

      toast.success("Connection has been successfully added.");
      form.reset();
      setIsTestConnectionSuccessful(false);
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function testConnection(values: z.infer<typeof ConnectionSchema>) {
    console.log("Running testConnection with:", values);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/devices/test-connection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(values),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Connection test failed.");
        setIsTestConnectionSuccessful(false);
        return;
      }

      toast.success("Connection test successful!");
      setIsTestConnectionSuccessful(true);
      if (Array.isArray(data.tables)) setTableOptions(data.tables);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      setIsTestConnectionSuccessful(false);
    }
  }
  useEffect(() => {
    const tableName = form.watch("property.tableName");
    if (!tableName) return;

    const fetchFields = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/devices/tables/${tableName}/Fields`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              Accept: "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch table fields");

        const data = await res.json();
        setTableFields(data.fields || []);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error fetching table fields"
        );

        setTableFields([]);
      }
    };

    fetchFields();
  }, [form.watch("property.tableName")]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ResizablePanelGroup direction="horizontal">
          {/* LEFT PANEL */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="p-4 space-y-4">
              <>
                {/* Name + Enabled Switch */}
                <div className="flex gap-4 my-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="group relative">
                            <FormLabel className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground">
                              <span className="inline-flex bg-background px-2">
                                Name
                              </span>
                            </FormLabel>
                            <Input type="name" placeholder="" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col items-center gap-4 ml-auto">
                    <FormField
                      control={form.control}
                      name="enabled"
                      render={({ field }) => (
                        <div>
                          <div className="relative inline-grid h-10 grid-cols-[1fr_1fr] items-center text-sm font-medium">
                            <Switch
                              id="isActive-switch"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="peer absolute inset-0 h-[inherit] w-auto rounded-lg data-[state=unchecked]:bg-gray-500 data-[state=checked]:bg-[rgba(72,195,137,1)] [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
                            />
                            <span className="min-w-78flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full">
                              <span className="text-[10px] font-medium uppercase text-white">
                                Disabled
                              </span>
                            </span>
                            <span className="min-w-78flex pointer-events-none relative me-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=unchecked]:invisible peer-data-[state=checked]:-translate-x-full peer-data-[state=checked]:text-background rtl:peer-data-[state=checked]:translate-x-full">
                              <span className="text-[10px] font-medium uppercase">
                                Enabled
                              </span>
                            </span>
                          </div>
                          <Label className="sr-only">Enabled</Label>
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Polling */}
                <FormField
                  control={form.control}
                  name="polling"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Polling</FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select polling" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectPolling.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.value.toString()}
                            >
                              {item.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Access</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectType.map((item) => (
                            <SelectItem key={item.id} value={item.value}>
                              {item.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </>

              <div className="flex justify-between">
                <Link href="/dashboard/connections">
                  <Button className="ml-auto" variant={"default"}>
                    Back
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="Accepted"
                  disabled={!isTestConnectionSuccessful}
                >
                  Save
                </Button>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-green-500" />

          {/* RIGHT PANEL */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="p-4 border-l border-muted relative">
              {selectedType === "WebAPI" && <WebAPIForm form={form} />}
              {selectedType === "database" && <DbForm form={form} />}
              {selectedType === "ODBC" && <ODBCForm form={form} />}

              {/* Table Options after test */}
              {tableOptions.length > 0 && (
                <div className="mt-4">
                  <p className="text-green-600 text-sm mb-4">
                    Connection success ✅
                  </p>
                  <FormField
                    control={form.control}
                    name="property.tableName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Table</FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              {field.value || "Select table"}
                              <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-full p-0 z-[999]"
                            align="start"
                          >
                            <Command>
                              <CommandInput placeholder="Search tables..." />
                              <CommandList>
                                <CommandEmpty>No table found.</CommandEmpty>
                                <CommandGroup>
                                  {tableOptions.map((table) => (
                                    <CommandItem
                                      key={table}
                                      value={table}
                                      onSelect={() => {
                                        field.onChange(table);
                                        setOpen(false);
                                      }}
                                    >
                                      {table}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {tableFields.length > 0 && (
                <div className="mt-4">
                  <Label className="mb-2 block text-sm">Select Fields</Label>
                  <MultipleSelector
                    options={tableFields.map((field) => ({
                      label: field,
                      value: field,
                    }))}
                    value={selectedFields}
                    onChange={(options) => setSelectedFields(options)}
                    placeholder="Select fields..."
                  />
                </div>
              )}
              {!isTestConnectionSuccessful && selectedType && (
                <Button
                  type="button"
                  variant="edit"
                  onClick={form.handleSubmit(testConnection)}
                  className="w-full mt-5"
                >
                  Test Connection
                </Button>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </form>
    </Form>
  );
}
