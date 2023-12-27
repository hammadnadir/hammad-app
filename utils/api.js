// utils/api.js
import axios from "axios";

export const authenticateUser = async (credentials) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      "device_token": credentials?.device_token || 123456,
    };

    const response = await axios.post(
      `https://erp.print247.us/api/app/login`,
      {email: credentials?.email, password: credentials?.password},
      { headers }
    );

    // const { token } = response.data?.success || null;

    // if (token) {
    //   await AsyncStorage.setItem("authentication_token", token);
    // } else {
    //   await AsyncStorage.clear();
    // }

    return response.data;
  } catch (error) {
    throw new Error("Authentication failed: " + error.message);
  }
};

export const packagingLists = async (credentials) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      "device_token": "123456",
      "Authorization": `Bearer ${credentials?.token}`,
    };

    const response = await axios.get(
      "https://erp.print247.us/api/packing-list",
      { headers }  // Use an object to pass headers
    );

    return response.data;
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

export const packagingListDetails = async (credentials) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      "device_token": "123456",
      "Authorization": `Bearer ${credentials?.token}`,
    };

    const response = await axios.get(
      `https://erp.print247.us/api/packing-list/${credentials?.id}`,
      { headers }  // Use an object to pass headers
    );

    return response.data;
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

