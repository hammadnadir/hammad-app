import React from "react";
import ScannerApp from "./components/scanner";
import Menues from "./components/menues";
import Footer from "./components/footer";
import { View } from "react-native";
import Header from "./components/header";

export default function App() {

  // const { fontsLoaded } = useFonts({
  //   Montserrat: require('@expo-google-fonts/montserrat/index.js'),
  // });

  return (
    <View style={{flex: 1, backgroundColor: "#F4FFFB"}}>
      <Header />
      <Menues />
      <Footer />
      {/* <ScannerApp /> */}
    </View>
  );
}
