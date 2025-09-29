/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { RoleSchema } from "@/schemas";
import {  Role } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import MultipleSelector from "@/components/ui/multiselect";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CrudOptions = [
  { label: "Create", value: "canCreate" },
  { label: "Read", value: "canRead" },
  { label: "Update", value: "canUpdate" },
  { label: "Delete", value: "canDelete" },
];

const availableTables = ["Devices", "Users", "Rfp","Permissions"];

interface EditRolesProps {
  roles: Role;
}

export default function EditGroup({ roles }: EditRolesProps) {
  const id = useId();
  const token = Cookies.get("token");
  const router = useRouter();

  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [tablePermissions, setTablePermissions] = useState<
    Record<string, string[]>
  >({});

  const form = useForm<z.infer<typeof RoleSchema>>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: roles.name,
      permissions: roles.tablePermissions || [],
    },
  });

  useEffect(() => {
    const initSelected: string[] = [];
    const initPerms: Record<string, string[]> = {};

    roles.tablePermissions?.forEach((perm) => {
      const { tableName, canCreate, canRead, canUpdate, canDelete } = perm;
      const perms: string[] = [];
      if (canCreate) perms.push("canCreate");
      if (canRead) perms.push("canRead");
      if (canUpdate) perms.push("canUpdate");
      if (canDelete) perms.push("canDelete");
      if (perms.length) {
        initSelected.push(tableName);
        initPerms[tableName] = perms;
      }
    });

    setSelectedTables(initSelected);
    setTablePermissions(initPerms);
  }, [roles.tablePermissions]);

  async function onSubmit(values: z.infer<typeof RoleSchema>) {
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

    const payload = {
      name: values.name,
      permissions: permissionsPayload,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/roles/${roles.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "An error occurred.");
      } else {
        toast.success("Group has been successfully updated.");
        form.reset();
        router.refresh();
      }
    } catch (err) {
      toast.error("Failed to update Group.");
    }
  }

  return (
    <>
      <SheetTitle className="mb-2">Edit Group</SheetTitle>
      <SheetDescription className="mb-2">
        Modify the group name and table permissions.
      </SheetDescription>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="mx-auto max-w-auto">
            <div className="bg-background overflow-hidden rounded-md border border-green-500">
              <Table>
                <TableHeader>
                  <TableRow className="border-green-500 [&>*:not(:last-child)]:border-r">
                    <TableHead className="w-12 border-green-500">
                      <Checkbox
                        className="border-green-500"
                        checked={selectedTables.length === availableTables.length}
                        onCheckedChange={(checked) =>
                          setSelectedTables(
                            checked ? [...availableTables] : []
                          )
                        }
                      />
                    </TableHead>
                    <TableHead className="border-green-500">Table</TableHead>
                    <TableHead className="border-green-500">Permissions</TableHead>
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
                          onChange={(opts) =>
                            setTablePermissions((prev) => ({
                              ...prev,
                              [table]: opts.map((o) => o.value),
                            }))
                          }
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

          <SheetFooter>
            <SheetClose asChild>
              <Button size="custom" variant="destructive" className="mr-auto">
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" size="custom" variant="Accepted">
              Save
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </>
  );
}
