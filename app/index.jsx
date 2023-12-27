import { useRouter } from "expo-router";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { generateLoginSchema } from "../common/validations/LoginForm";
// import { FIREBASE_AUTH } from "../firebaseConfig";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import Header from "../common/components/Header";
import { COLORS, FONTS } from "../common/constants/theme";
import { Entypo } from "@expo/vector-icons";
import { authenticateUser } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  // const auth = FIREBASE_AUTH;
  const fieldLabels = {
    email: "Email",
    password: "Password",
  };
  const { handleChange, handleSubmit, handleBlur, values, errors } = useFormik({
    validationSchema: generateLoginSchema(fieldLabels),
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
       
        const res = await authenticateUser({ ...values, device_token: 123456 });

        const data = res?.success || null;

        if (data?.token) {
          await AsyncStorage.setItem("authentication_token", JSON.stringify(data));
        } else {
          await AsyncStorage.clear();
        }

        if (data?.token) {
          ToastAndroid.show('Log in successfully!', ToastAndroid.SHORT);
          router.replace(`/(tabs)`);
        } else {
            ToastAndroid.show('Invalid Credentials!', ToastAndroid.SHORT);
        }
      } catch (error) {
        // alert("Login up failed: " + error.message);
        ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
      }
    },
  });

  // useEffect(()=>{
  //   if (Object.keys(errors).length > 0) {
  //     ToastAndroid.show('Please fill all the rquired fields!', ToastAndroid.SHORT);
  //     return;
  //   }
  // },[errors])

  return (
    <View style={styles.container}>
      {/* <Header
				style={{ marginTop: 100 }}
				title="Welcome Back"
				subTitle="Please enter you e-mail and password to login"
			/> */}

      <Text style={styles.label}>{fieldLabels.email}</Text>
      <TextInput
        placeholder={fieldLabels.email}
        style={styles.input}
        onChangeText={handleChange("email")}
        onBlur={handleBlur("email")}
        value={values.email}
        autoCapitalize="none"
      />

      <Text style={styles.label}>{fieldLabels.password}</Text>
      <View style={styles.input}>
        <TextInput
          placeholder={fieldLabels.password}
          style={{
            flex: 1,
            // fontFamily: FONTS.roboto
          }}
          onChangeText={handleChange("password")}
          onBlur={handleBlur("password")}
          value={values.password}
          autoCapitalize="none"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <Entypo name="eye-with-line" size={24} color="black" />
          ) : (
            <Entypo name="eye" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
    // alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    flexDirection: "row",
    // fontFamily: FONTS.roboto,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    // fontFamily: FONTS.roboto,
  },
  button: {
    backgroundColor: COLORS.button,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    // fontFamily: FONTS.roboto,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  registerText: {
    fontSize: 16,
    // fontFamily: FONTS.roboto,
  },
  registerButton: {
    marginLeft: 5,
  },
  registerButtonText: {
    fontSize: 16,
    color: "#274690",
    fontWeight: "bold",
  },
});
export default LoginPage;
