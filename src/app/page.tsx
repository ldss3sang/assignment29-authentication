"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-10 items-center justify-center">
      Assignment 29 - Authentication
      <Link className="primary-btn text-lg py-2.5" href="/log-in">Log in</Link>
      <div className="flex gap-2">
        <span>Don't have an account?</span>
        <span><Link className="text-blue-600 font-bold hover:underline" href="create-account">Create Account</Link></span>
      </div>
    </main>
  );
}
