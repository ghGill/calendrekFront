import { createContext, useContext, useState } from "react";

type User = {
  id: number;
  name: string;
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }:any) {
    const [user, setUser] = useState<User | null>(null);

    return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>;
}

// export const useUserContext = () => useContext(UserContext);
export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used in UserProvider");
  return ctx;
};