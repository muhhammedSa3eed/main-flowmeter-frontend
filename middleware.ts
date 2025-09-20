import {
  DEFAULT_LOGIN_REDIRECT_ADMIN,
  authRoutes,
  protectedRoutes,
} from "@/routes";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = (await cookies()).get("token")?.value;

  // 🔸 ١) لو المستخدم مش مسجل دخول وعم يدخل على صفحة محمية → redirect للصفحة الرئيسية
  if (!token && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  // 🔸 ٢) لو المستخدم مسجل دخول وداخل على صفحة login/signup → redirect للداشبورد
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT_ADMIN, req.nextUrl.origin));
  }

  // 🔸 ٣) السماح للطلب بالمتابعة بشكل طبيعي
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
