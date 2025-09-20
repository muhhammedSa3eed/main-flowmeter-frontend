import React from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import { CircleAlert } from "lucide-react";
import Cookies from "js-cookie";

export default function DeleteUser({
  users,
}: {
  users: User;
}) {

  const handleDeleteUser = async () => {
    console.log("device.id", users.id);
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${users.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete the user.");
        return; // Exit early if the response is not OK
      }

      // fetchDevices();
      toast.success("The user has been deleted successfully.");
      window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to delete users: ${err.message}`);
      } else {
        toast.error("Failed to delete users due to an unknown error.");
      }
    }
  };
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
          Are you sure?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. Do you want to permanently delete the
          user <strong>{users.name}</strong>?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className={cn(buttonVariants({ variant: "destructive" }))}
          onClick={handleDeleteUser}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
