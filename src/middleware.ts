import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  
  const isDashboard = nextUrl.pathname.startsWith('/dashboard');
  const isLogin = nextUrl.pathname === '/login';

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  if (isLogin && isLoggedIn) {
    const role = req.auth?.user?.role?.toLowerCase() || 'student';
    return NextResponse.redirect(new URL(`/dashboard/${role}`, nextUrl));
  }

  // Enforce role-based access control (RBAC)
  if (isLoggedIn) {
    const userRole = req.auth?.user?.role; // TUTOR, STUDENT, ADMIN
    if (nextUrl.pathname.startsWith('/dashboard/tutor') && userRole !== 'TUTOR') {
      return NextResponse.redirect(new URL('/dashboard/student', nextUrl));
    }
    if (nextUrl.pathname.startsWith('/dashboard/student') && userRole !== 'STUDENT') {
      return NextResponse.redirect(new URL('/dashboard/tutor', nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
