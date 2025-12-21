import { Button, Input } from "@ui-kitten/components";
import { Link, useRouter } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { Alert, Text, View } from "react-native";
import tw from "twrnc";

export default function SignUp() {
  const router = useRouter();

  const Register = (email: string, password: string, username: string) => {
    if (email === "" || password === "" || username === "") {
      Alert.alert("Sign Up Error ", "Please fill in all fields");
      return;
    }
  };

  return (
    <View style={tw`flex flex-1 items-center justify-center bg-black`}>
      <Text style={tw`text-white text-2xl mb-4`}>Sign Up to Murmur</Text>
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={(values) => {
          Register(values.email, values.password, values.username);
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
              placeholder="Username"
              value={values.username}
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
            />
            <Input
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              secureTextEntry
            />
            <Button onPress={(event) => handleSubmit()}>Sign Up</Button>
          </View>
        )}
      </Formik>
      <View style={tw`flex flex-row items-center gap-4 mt-4`}>
        <Text style={tw`text-white mt-4`}>Already have an account?</Text>
        <Link style={tw`text-white font-medium mt-4`} href="/auth/signin">
          Sign In
        </Link>
      </View>
    </View>
  );
}
