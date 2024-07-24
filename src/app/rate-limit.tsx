import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { ratelimit } from "~/server/ratelimit";

const RateLimitChecker = async ({ children }: { children: ReactNode }) => {
  const header = headers();
  const ip = (header.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0]!;
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return redirect("/error/rate-limit");
  }

  return <>{children}</>;
};

export function RateLimit({ children }: { children: ReactNode }) {
  return <RateLimitChecker>{children}</RateLimitChecker>;
}
