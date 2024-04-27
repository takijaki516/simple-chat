"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJwtStore } from "@/lib/jwt-store";
import { useCheckAuth } from "@/lib/auth-utils";

const SignupPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useJwtStore();

  //
  useCheckAuth();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      email,
      username,
      password,
    };

    const res = await fetch("http://localhost:3008/auth/signup", {
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
      <h1 className="text-2xl font-semibold tracking-tight">SIGN UP</h1>

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
          <Label htmlFor="username">username</Label>
          <Input
            type="username"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        {"already have an account?"}
        <Link className="px-1 underline hover:text-foreground" href="/login">
          login
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
