import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="flex flex-cl">
      <div>AuthLayout</div>
      <Outlet />
    </div>
  );
};
