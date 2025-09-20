interface fetchDeviceProps {
  id: string | number;
}
interface tokenProps {
  token: string;
}
export const fetchDevice = async ({ id }: fetchDeviceProps) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/devices/${id}`,
      {
        headers: { 'Content-Type': 'application/json' },
        credentials:"include"

      },

      
    );
    
    if (!response.ok) throw new Error('Failed to fetch devices');
    return await response.json();
  } catch (error) {
    console.error('Error fetching devices:', error);
  }
};

export const getUserByToken = async ({ token }: tokenProps) => {
  // const parsedValues = JSON.parse(token);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/verify-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(token),
      }
    );
    console.log({ response });
    if (!response.ok) {
      console.error('Logout failed');
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}. Please try again.`);
    } else {
      console.error('An unknown error occurred. Please try again.');
    }
  }
};


