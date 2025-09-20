/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';
import { cookies } from 'next/headers';

export async function login(values: { email: string; password: string }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(values),
        credentials:'include'
      }
    );

    const data = await res.json();

    // تحقق من وجود رسالة خطأ
    if (!res.ok || data.message) {
      return {
        success: false,
        message: data.message || 'Invalid username or password.',
      };
    }
    console.log({ data });
    
    // حفظ التوكن في الكوكيز
    // (await cookies()).set('token', data.token, {
    //   expires: data.expiresOn,
    //   httpOnly: true,
    // });
    const expiresDate = data.expiresOn ? new Date(data.expiresOn) : undefined;

    (await cookies()).set('token', data.token, {
      expires: expiresDate, // ✅ الآن القيم صحيحة
      httpOnly: true,
    });
  if (res.ok && data.permissions) {
      localStorage.setItem('permissions', JSON.stringify(data.permissions));
    }
    // تحديد وجهة التوجيه بناءً على الدور
    const redirectUrl = data.roles.includes('User')
      ? process.env.DEFAULT_LOGIN_REDIRECT_USER
      : process.env.DEFAULT_LOGIN_REDIRECT_ADMIN;

    return {
      success: true,
      message: 'You have successfully logged in.',
      redirectUrl,
    };
  } catch (error) {
    return { success: false, message: 'Network error. Please try again.' };
  }
}




