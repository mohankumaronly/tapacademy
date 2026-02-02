import React from "react";

const ProfileLayout = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col space-y-10 px-4">
      {children}
    </div>
  );
};

export default ProfileLayout;
