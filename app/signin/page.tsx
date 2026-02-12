import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/button";
import { signInSchema, SignInSchemaType } from "./sign-in.schema";

export default function SignInScreen() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInSchemaType) => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user.email === data.email && user.password === data.password) {
          await AsyncStorage.setItem("isAuthenticated", "true");
          router.replace("/(tabs)/home");
        } else {
          Alert.alert("Error", "Invalid email or password");
        }
      } else {
        // For testing purposes, if no user exists, create one
        await AsyncStorage.setItem("user", JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.email.split('@')[0]
        }));
        await AsyncStorage.setItem("isAuthenticated", "true");
        router.replace("/(tabs)/home");
      }
    } catch (e) {
      Alert.alert("Error", "Authentication failed");
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
    else return;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Pressable style={styles.backCircle} onPress={handleBack}>
            <Ionicons name="chevron-back" size={23} color="white" />
          </Pressable>

          <Text style={styles.mainTitle}>Sign In</Text>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.7)" />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.textInput}
                      placeholder="Email"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  )}
                />
              </View>
              <View style={styles.divider} />
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.7)" />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.textInput}
                      placeholder="********"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      secureTextEntry={!isPasswordVisible}
                      autoCorrect={false}
                      textContentType="oneTimeCode"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Ionicons
                    name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="rgba(255,255,255,0.5)"
                  />
                </Pressable>
              </View>
              <View style={styles.divider} />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            </View>

            <Button onPress={handleSubmit(onSubmit)} style={styles.signInBtn} textStyle={styles.signInBtnText}>
              Sign In
            </Button>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>I&apos;m a new user. </Text>
              <Pressable onPress={() => router.push("/signup/page")}>
                <Text style={styles.linkText}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0F121E" },
  scrollContainer: { paddingHorizontal: 25, paddingTop: 20 },
  backCircle: {
    marginTop: 15,
    width: 43,
    height: 43,
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  mainTitle: {
    color: "white",
    fontSize: 38,
    fontFamily: "Poppins-Medium",
    marginBottom: 30,
  },
  form: { gap: 30 },
  inputWrapper: { gap: 4 },
  label: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 17,
    fontFamily: "Poppins-Regular",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 5,
  },
  textInput: {
    flex: 1,
    color: "white",
    fontSize: 18,
    fontFamily: "Poppins-Regular",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  signInBtn: {
    backgroundColor: "#0066FF",
    height: 56,
    borderRadius: 16,
    marginTop: 20,
  },
  signInBtnText: {
    fontSize: 19,
    fontFamily: "Poppins-Medium",
  },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 10,
  },
  biometricText: {
    color: '#0066FF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: "Poppins-Medium",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: { color: "rgba(255,255,255,0.5)", fontFamily: "Poppins-Regular" },
  linkText: { color: "#0066FF", fontWeight: "bold", fontFamily: "Poppins-Medium" },
  errorText: { color: "#FF4D4D", fontSize: 12, fontFamily: "Poppins-Regular" },
});