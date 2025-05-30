import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[100dvh] w-full flex justify-center bg-white">
      <div className="w-full max-w-[425px] min-h-[100dvh] bg-[#3b08ac] shadow-lg relative">
        {children}
      </div>
    </div>
  );
};

export default Layout;
