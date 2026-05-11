'use client';
import { createContext, useContext } from "react";

const Context = createContext();
function UserProvider({ children, user }) {
  return <Context.Provider value={{ user }}>{children}</Context.Provider>;
}

export default UserProvider;

export function useUser() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}