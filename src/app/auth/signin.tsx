import { Button, Input } from "@ui-kitten/components";
import { Link, useRouter } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { Alert, Text, View } from "react-native";
import tw from "twrnc";

export default function Signin() {
  const router = useRouter();

  const Login = (email: string, password: string) => {
    if (email === "" || password === "") {
      Alert.alert("Sign In Error ", "Please fill in all fields");
      return;
    }
  };

  return (
    <View style={tw`flex flex-1 items-center justify-center bg-black`}>
      <Text style={tw`text-white text-2xl mb-4`}>Sign In to Murmur</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
          Login(values.email, values.password);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={tw`flex w-full gap-4 p-8`}>
            <Input
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            <Input
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              secureTextEntry
            />
            <Button onPress={(event) => handleSubmit()}>Sign In</Button>
          </View>
        )}
      </Formik>
      <View style={tw`flex flex-row items-center gap-4 mt-4`}>
        <Text style={tw`text-white mt-4`}>Don&apos;t have an account?</Text>
        <Link style={tw`text-white font-medium mt-4`} href="/auth/signup">
          Sign Up
        </Link>
      </View>
    </View>
  );
}
