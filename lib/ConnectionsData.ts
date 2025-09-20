//connectionsApi.ts

import {  SelectPolling, SelectType } from '@/types';
export async function getSelectType(): Promise<SelectType[]> {
  const dataType: SelectType[] = [
    {
      id: 0,
      title: 'WebAPI',
      value: 'WebAPI',
    },
    {
      id: 1,
      title: "ODBC",
      value: "ODBC",
    },
    {
      id: 2,
      title: 'Database',
      value: 'database',
    },
  ];

  return dataType; // Return the array of Type
}

export async function getSelectPolling(): Promise<SelectPolling[]> {
  const dataPolling: SelectPolling[] = [
    {
      id: 0,
      title: '2000 ms',
      value: 2000,
    },
    {
      id: 1,
      title: '3000 ms',
      value: 3000,
    },
    {
      id: 2,
      title: '5000 ms',
      value: 5000,
    },
    {
      id: 3,
      title: '7000 ms',
      value: 7000,
    },
  ];
  return dataPolling;
}


export const dataType = await getSelectType();
export const dataPolling = await getSelectPolling();
