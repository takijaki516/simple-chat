import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="container h-full flex-col items-center justify-center">
      <div className="mx-auto flex flex-col justify-center space-y-6 pt-10">
        <Outlet />
      </div>
    </div>
  );
};
