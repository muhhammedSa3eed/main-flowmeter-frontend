// lib/fetchPreferences.ts
// import { cookies } from 'next/headers';
import { VisibilityState } from '@tanstack/react-table';
import { cookies } from 'next/headers';

export async function fetchPreferences(
  tableName: string
): Promise<VisibilityState> {
  // const token = (await cookies()).get('token')?.value ?? '';
  // const token = (await cookies()).get('token')?.value ?? '';
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/get/preferences/${tableName}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      // headers: {
      //   'Content-Type': 'application/json',
      //   Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5YmExMDEzLTIyNTUtNDdkYi1iOTllLWViNmI3M2Q3ZDI0ZiIsImVtYWlsIjoid2FsYWFlbWFtMDc3QGdtYWlsLmNvbSIsImdyb3VwIjoiU3VwZXJBZG1pbiIsImlhdCI6MTc1ODQ1ODU3OCwiZXhwIjoxNzU4NDU5NDc4fQ.7oM7q_brutuxGdUo0OowsnvBMeMyMp8HxkevLHxno5s`,
      // },
      // cache: 'no-store',
    }
  );

  // if (!response.ok) {
  //   let errorMessage = '';
  //   try {
  //     errorMessage = await response.text(); // اطبع أي رسالة جاية من السيرفر
  //   } catch {
  //     errorMessage = 'No error message';
  //   }

  //   console.error('Fetch preferences failed:', response.status, errorMessage);
  //   throw new Error(
  //     `Failed to fetch preferences: ${response.status} - ${errorMessage}`
  //   );
  // }

  const json = await response.json();
  return json.preferences || {};
}

// export async function fetchPreferences(
//   tableName: string
// ): Promise<VisibilityState> {

//   const token = (await cookies()).get('token')?.value ?? '';

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/get/preferences/${tableName}`,
//     {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         // cookie: token,
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   if (!response.ok) throw new Error('Failed to fetch preferences');

//   const json = await response.json();

//   return json.preferences || {};
// }

// const cookieStore = cookies();

// const cookieHeader = (await cookieStore)
//   .getAll()
//   .map((c) => `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}`)
//   .join("; ");
