import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSocketStore } from "@/store/socket";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { auth, setAuth } = useAuthStore();
  const { setSocket } = useSocketStore();

  useEffect(() => {
    if (auth.token) {
      navigate("/");
      return;
    }
  }, [auth.token, auth.username]);

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
        Accept: "application/json",
      },
      credentials: "include",
    });

    const { data } = await res.json();

    setAuth({
      token: data.access_token,
      username: data.username,
      userId: data.userId,
    });
    setSocket(data.access_token);
    return navigate("/");
  };

  return (
    <div className="container md:max-w-xl flex flex-col text-center items-center justify-center gap-4">
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
        <Link className="px-1 underline hover:text-foreground" to={"/signup"}>
          go to signup page
        </Link>
      </p>
    </div>
  );
};
