import { createContext, useState } from "react";

export const PageContext = createContext();

export const PageProvider = ({ children }) => {

  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <PageContext.Provider value={{ activePage, setActivePage }}>
      {children}
    </PageContext.Provider>
  );
};