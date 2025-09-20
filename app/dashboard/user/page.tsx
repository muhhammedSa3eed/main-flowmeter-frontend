import { Suspense } from "react";
import Loading from "@/app/loading";
import { Users } from "lucide-react";
import { User } from "@/types";
import UserTable from "./UserTable";
import { cookies } from "next/headers";
import { columns } from "./columns";
import { fetchPreferences } from "@/lib/fetchPreferences";
async function getAllUsers(): Promise<User[]> {
  const cookieStore = cookies();

  const cookieHeader = (await cookieStore)
    .getAll()
    .map((c) => `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}`)
    .join("; ");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const UsersData = await response.json();
  return UsersData;
}

const tableName = "Users";

export default async function Page() {
  const UsersData = await getAllUsers();
  const preferences = await fetchPreferences(tableName);
  console.log("Users :", UsersData);
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
          <div className="flex flex-row gap-4 text-custom-green2 mb-3">
            <div>
              <Users />
            </div>
            <div className="text-xl font-bold  gap-2">Users </div>
          </div>
          <UserTable
            data={UsersData}
            columns={columns}
            preferences={preferences}
          />
        </div>
      </div>
    </Suspense>
  );
}
