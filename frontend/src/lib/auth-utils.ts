import { useEffect } from "react";

import { useAuthStore } from "@/store/auth";
import { useSocketStore } from "@/store/socket";
import { useNavigate } from "react-router-dom";

export const refreshToken = async () => {
  // TODO: add try catch
  const res = await fetch("http://localhost:3008/auth/refresh", {
    method: "POST",
    credentials: "include", // REVIEW:
  });

  if (!res.ok) {
    throw new Error("auth error");
  }

  const { data } = await res.json();
  return {
    username: data.username,
    token: data.access_token,
    userId: data.userId,
  };
};

export const useCheckAuth = () => {
  const { auth, setAuth } = useAuthStore();
  const { setSocket } = useSocketStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.token) {
      setSocket(auth.token);
      return;
    }

    refreshToken()
      .then(({ username, token, userId }) => {
        console.log("refreshed token");
        setSocket(token);
        setAuth({ token, username, userId });
      })
      .catch((error) => {
        // TODO: redirect to login page
        console.error(error as unknown as Error);
        return navigate("/login");
      });
  }, []);
};
