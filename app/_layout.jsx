import { BarCodeScanner } from "expo-barcode-scanner";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../AuthContext";
import { Loading } from "../components/loading";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import * as Updates from 'expo-updates';

async function askForPermission() {
  const { status } = await BarCodeScanner.requestPermissionsAsync();
  return status === "granted";
}

const AuthNavigator = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  // console.log(JSON.stringify(user))
  
  useEffect(() => {
    if (user?.token) {
      router.replace("/(tabs)");
    } else {
      router.replace("/");
    }
  }, [user, router]);

  // if (loading) {
  //   return <Loading />;
  // }
  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    // const timeoutId = setTimeout(() => {
    //   onFetchUpdateAsync();
    // }, 5000);
  
    // // Cleanup function to clear the timeout in case the component unmounts or the effect runs again
    // return () => clearTimeout(timeoutId);
  }, []);
  

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user?.token ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="index"
        />
      )}
    </Stack>
  );
};

const RootLayout = () => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    askForPermission().then(setHasPermission);
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <AuthNavigator />
      </AuthProvider>
    </Provider>
  );
};

export default RootLayout;
