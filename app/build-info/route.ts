import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    name: "chatfleet-web",
    build: {
      version:
        process.env.CHATFLEET_BUILD_VERSION ??
        process.env.NEXT_PUBLIC_CHATFLEET_BUILD_VERSION ??
        "dev",
      commit:
        process.env.CHATFLEET_BUILD_COMMIT ??
        process.env.NEXT_PUBLIC_CHATFLEET_BUILD_COMMIT ??
        "local",
    },
  });
}
