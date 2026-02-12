import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { useLayoutFonts } from "@/hooks/use-fonts";
import { poppins_font } from "@/constants/poppins"; 
import { useAppSettings } from "@/hooks/use-app-settings";

export default function LayoutContent() {
  const { loaded, error } = useLayoutFonts(poppins_font);
  const { theme } = useAppSettings();
  const isDarkMode = theme === 'dark';

  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: isDarkMode ? '#0F121E' : '#F8FAFC' }} />;
  }
  
  if (error) {
    return <Text>Error loading fonts</Text>;
  }

  return (
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDarkMode ? '#0F121E' : '#F8FAFC' }, 
        }}
      >
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome",
        }}
      />
      
      <Stack.Screen
        name="onboarding/page"
        options={{
          animation: "slide_from_right",
        }}
      />

      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="transaction-details/page"
        options={{
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}