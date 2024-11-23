import axios from "axios";
import { useState, createContext, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      axios
        .get("/profile")
        .then(({ data }) => {
          setUser(data);
          setReady(true);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [user]);

  const logout = async () => {
    try {
      await axios.post("/logout");
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, ready, logout }}>
      {children}
    </UserContext.Provider>
  );
}
