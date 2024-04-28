import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useJwtStore } from "@/store/jwt";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, token } = useJwtStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate(-1);
      return;
    }
  }, [token]);

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
        Accept: "application/json",
      },
      credentials: "include",
    });
    const { access_token } = await res.json();

    setToken(access_token);
    return navigate("/");
  };

  return (
    <div className="container md:max-w-xl flex flex-col text-center items-center justify-center gap-4">
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
        <Link className="px-1 underline hover:text-foreground" to={"/login"}>
          login
        </Link>
      </p>
    </div>
  );
};
