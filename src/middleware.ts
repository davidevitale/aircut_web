import { NextResponse } from "next/server";

/**
 * Con Firebase Auth la sessione e gestita lato client. Il middleware e un
 * pass-through: non serve refresh di cookie come con Supabase.
 */
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/).*)"],
};
