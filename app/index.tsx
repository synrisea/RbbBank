import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from 'expo-status-bar';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const isAuthenticated = await AsyncStorage.getItem("isAuthenticated");
        const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
        
        if (isAuthenticated === "true") {
          router.replace("/(tabs)/home");
        } else if (hasSeenOnboarding === "true") {
          router.replace("/signin/page"); 
        } else {
          router.replace("/onboarding/page");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace("/signin/page"); 
      }
    };

    const timer = setTimeout(checkAuthentication, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/logo.png')} 
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      <ActivityIndicator size="small" color="#0066FF" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E17', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 120,
  },
  loader: {
    position: 'absolute',
    bottom: 50,
  }
});