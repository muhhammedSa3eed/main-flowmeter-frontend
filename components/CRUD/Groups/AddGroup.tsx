/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-hot-toast";
import { SheetDescription, SheetTitle } from "@/components/ui/sheet";
import Cookies from "js-cookie";
import MultipleSelector from "@/components/ui/multiselect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { GroupSchema } from "@/schemas";

const CrudOptions = [
  { label: "Create", value: "canCreate" },
  { label: "Read", value: "canRead" },
  { label: "Update", value: "canUpdate" },
  { label: "Delete", value: "canDelete" },
];

const availableTables = ["Devices", "Users", "Rfp","Permissions"];



export default function AddGroup() {
  const id = useId();
  const token = Cookies.get("token");
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [tablePermissions, setTablePermissions] = useState<
    Record<string, string[]>
  >({});
  const form = useForm<z.infer<typeof GroupSchema>>({
    resolver: zodResolver(GroupSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  async function onSubmit(values: z.infer<typeof GroupSchema>) {
    const permissionsPayload = selectedTables.map((table) => {
      const perms = tablePermissions[table] || [];
      return {
        tableName: table,
        canCreate: perms.includes("canCreate"),
        canRead: perms.includes("canRead"),
        canUpdate: perms.includes("canUpdate"),
        canDelete: perms.includes("canDelete"),
      };
    });
    console.log("🟡 Final Payload to API:", {
      name: values.name,
      permissions: permissionsPayload,
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/with-permissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            name: values.name,
            permissions: permissionsPayload,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "An error occurred.");
        return;
      }

      toast.success("Group has been successfully added.");
      form.reset();
      window.location.reload();
    } catch (err) {
      toast.error("Failed to add Group.");
    }
  }

  return (
    <>
      <SheetTitle className="mb-2">Add Group</SheetTitle>
      <SheetDescription className="mb-2">
        Fill in the details to add a new Group.
      </SheetDescription>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Group Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Admin" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Permissions Table */}
          <div className="mx-auto max-w-auto ">
            <div className="bg-background overflow-hidden rounded-md border border-green-500">
              <Table>
                <TableHeader>
                  <TableRow className="border-green-500 [&>*:not(:last-child)]:border-r">
                    <TableHead className="w-12 border-green-500">
                      <Checkbox
                      className="border-green-500"
                        checked={
                          selectedTables.length === availableTables.length
                        }
                        onCheckedChange={(checked) =>
                          setSelectedTables(checked ? [...availableTables] : [])
                        }
                      />
                    </TableHead>
                    <TableHead className="border-green-500">Table</TableHead>
                    <TableHead className="border-green-500">
                      Permissions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableTables.map((table) => (
                    <TableRow
                      key={table}
                      className="border-green-500 [&>*:not(:last-child)]:border-r hover:bg-transparent"
                    >
                      <TableCell className="border-green-500 bg-muted/50">
                        <Checkbox
                        className="border-green-500"
                          checked={selectedTables.includes(table)}
                          onCheckedChange={(checked) =>
                            setSelectedTables((prev) =>
                              checked
                                ? [...prev, table]
                                : prev.filter((t) => t !== table)
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="border-green-500 bg-muted/50">
                        {table}
                      </TableCell>
                      <TableCell className="border-green-500">
                        <MultipleSelector
                          className="border-green-500"
                          value={CrudOptions.filter((opt) =>
                            (tablePermissions[table] || []).includes(opt.value)
                          )}
                          onChange={(opts) => {
                            setTablePermissions((prev) => ({
                              ...prev,
                              [table]: opts.map((o) => o.value),
                            }));
                            setSelectedTables((prev) => (prev.includes(table) ? prev : [...prev, table]));
                          }}
                          options={CrudOptions}
                          placeholder="Select permissions"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-muted-foreground mt-4 text-center text-sm">
              Table permissions per role
            </p>
          </div>

          {/* Footer */}
          <DialogFooter>
            <DialogClose asChild>
              <Button size="custom" variant="destructive">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" size="custom" variant="Accepted">
              Add
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
