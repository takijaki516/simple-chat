"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCheckAuth } from "@/lib/auth-utils";
import { useJwtStore } from "@/lib/jwt-store";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setToken } = useJwtStore();

  //
  useCheckAuth();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      email,
      password,
    };

    const res = await fetch("http://localhost:3008/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { access_token } = await res.json();

    setToken(access_token);
    router.replace("/");
  };

  return (
    <div
      className="container md:max-w-xl flex flex-col text-center items-center justify-center
     gap-4 pt-10"
    >
      <h1 className="text-2xl font-semibold tracking-tight">LOG IN</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-2 w-full">
        <div className="flex flex-col items-start gap-1">
          <Label htmlFor="email">EMAIL</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-start gap-1">
          <Label htmlFor="password">PASSWORD</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full mt-6">
          LOGIN
        </Button>
      </form>

      <p className="text-muted-foreground">
        {"signup if you don't have an account"}
        <Link className="px-1 underline hover:text-foreground" href="/signup">
          signup
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
