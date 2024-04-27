"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJwtStore } from "./jwt-store";

export const refreshToken = async () => {
  try {
    // TODO: add try catch
    const res = await fetch("http://localhost:3008/auth/refresh", {
      method: "POST",
      credentials: "include", // REVIEW:
    });
    console.log("🚀 ~ file: auth-utils.ts:27 ~ refreshToken ~ res:", res);

    const { access_token } = await res.json();
    return access_token;
  } catch (error) {
    console.log("no refresh token need to login again");
  }
};

export const useCheckAuth = async () => {
  const { token, setToken } = useJwtStore();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace("/");
      return;
    }

    refreshToken()
      .then((access_token) => {
        console.log("refreshed token");
        setToken(access_token);
      })
      .catch((error) => {
        console.log("ㅋㅋㅋㅋF");
      });
  }, []);
};
