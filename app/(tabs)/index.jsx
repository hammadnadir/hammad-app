// import { Link, router } from "expo-router";
// import { Pressable, Text, View } from "react-native";
// import Menues from "../../components/menues";
// import ScannerApp from "../../components/scanner";

// const HomePage = () => {
//   return (
//       // <ScannerApp />
//       <Menues />
//   );
// };

// export default HomePage;

import React from 'react';
import { Text, View, StyleSheet, StatusBar, Button } from 'react-native';
import Menues from '../../components/menues';
// import { colors } from '@theme';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: colors.lightGrayPurple,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonTitle: {
    fontSize: 16,
    // color: colors.white,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    // backgroundColor: colors.lightPurple,
  },
});

export default function Profile() {
  return (
    <Menues />
  );
}
