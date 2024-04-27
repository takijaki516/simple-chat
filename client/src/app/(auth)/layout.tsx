const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container h-full flex-col items-center justify-center">
      <div className="mx-auto flex flex-col justify-center space-y-6 ">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
