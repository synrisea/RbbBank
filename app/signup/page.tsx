import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Stack } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";

import { signUpSchema, SignUpSchemaType } from "./sign-up.schema";
import Button from "@/components/ui/button";

import AsyncStorage from "@react-native-async-storage/async-storage";


export default function SignUpScreen() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", phone: "", email: "", password: "" },
  });

  const onSubmit = async (data: SignUpSchemaType) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(data));
      
      router.push("/signin/page"); 
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Pressable style={styles.backCircle} onPress={handleBack}>
            <Ionicons name="chevron-back" size={23} color="white" />
          </Pressable>

          <Text style={styles.mainTitle}>Sign Up</Text>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputRow}>
                <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.7)" />
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.textInput}
                      placeholder="Your Name"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              </View>
              <View style={styles.divider} />
              {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputRow}>
                <Ionicons name="call-outline" size={20} color="rgba(255,255,255,0.7)" />
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.textInput}
                      placeholder="+994"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      onChangeText={onChange}
                      value={value}
                      keyboardType="phone-pad"
                    />
                  )}
                />
              </View>
              <View style={styles.divider} />
              {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
            </View>

            {/* Email Address */}
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

            {/* Password */}
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

            <Button 
              onPress={handleSubmit(onSubmit, (errors) => {
                console.log("Validation errors:", errors);
              })} 
              style={styles.signUpBtn}
              textStyle={styles.signUpBtnText}
            >
              Sign Up
            </Button>

            <View style={styles.loginRow}>
              <Text style={styles.alreadyText}>Already have an account? </Text>
              <Pressable onPress={() => router.push("/signin/page")}>
                <Text style={styles.loginLink}>Sign In</Text>
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
  signUpBtn: {
    backgroundColor: "#0066FF",
    height: 56,
    borderRadius: 16,
    marginTop: 20,
  },
  signUpBtnText: {
    fontSize: 19,
    fontFamily: "Poppins-Medium",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  alreadyText: { 
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Poppins-Regular",
  },
  loginLink: { 
    color: "#0066FF", 
    fontWeight: "bold",
    fontFamily: "Poppins-Medium",
  },
  errorText: { 
    color: "#FF4D4D", 
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
});