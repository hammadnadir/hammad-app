// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { authenticateUser } from "./utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const getUser = async () => {
 try {
    const value = await AsyncStorage.getItem("authentication_token");
    const data =
      value != null
        ? typeof value === "string"
          ? JSON.parse(value)
          : value
        : null;
    return data;
 } catch (e) {
    console.error("Error reading user data:", e);
    return null;
 }
};

export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);
 const fetchUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
 };

 useEffect(() => {
    fetchUser();
 }, []);

 const signOut = async () => {
    //Remove data from context, so the App can be notified
    //and send the user to the AuthStack
    setUser(undefined);

    //Remove the data from Async Storage
    //to NOT be recoverede in next session.
    await AsyncStorage.removeItem("authentication_token");
 };

 return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
 );
};

export const useAuth = () => {
 const context = useContext(AuthContext);

 if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
 }

 return context;
};