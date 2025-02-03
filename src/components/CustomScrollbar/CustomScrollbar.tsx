import React, { ReactNode } from "react";
import "./CustomScrollbar.css";

interface CustomScrollbarProps {
  children: ReactNode;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({ children }) => {
  return (
    <div className="scrollable-container" style={{ minHeight: "100%" }}>
      {children}
    </div>
  );
};

export default CustomScrollbar;
