import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[100dvh] w-full flex justify-center bg-white overflow-hidden">
      <div className="w-full max-w-[425px] h-screen overflow-y-auto bg-[#7c65c1] shadow-lg relative">
        {children}
      </div>
    </div>
  );
};

export default Layout;
