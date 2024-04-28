import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useJwtStore } from "@/store/jwt";

export const refreshToken = async () => {
  // TODO: add try catch
  const res = await fetch("http://localhost:3008/auth/refresh", {
    method: "POST",
    credentials: "include", // REVIEW:
  });

  if (!res.ok) {
    throw new Error("auth error");
  }

  const { access_token } = await res.json();
  return access_token;
};

export const useCheckAuth = () => {
  const { token, setToken } = useJwtStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // navigate("/"); // go back equivalent to back button
      console.log(
        "token exists 🚀 ~ file: auth-utils.ts:27 ~ useEffect ~ token:",
        token
      );
      return;
    }

    refreshToken()
      .then((access_token) => {
        console.log("refreshed token");
        setToken(access_token);
      })
      .catch((error) => {
        // TODO: redirect to login page
        console.error(error as unknown as Error);
        console.log("ㅋㅋㅋㅋF");
      });
  }, []);
};
