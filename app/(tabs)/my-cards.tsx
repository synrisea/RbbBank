import MyCardsScreenContent from "@/components/screen/my-cards/my-cards-screen";
import { useAppSettings } from "@/hooks/use-app-settings";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyCards() {
  const { theme } = useAppSettings();
  const isDarkMode = theme === 'dark';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#0F121E' : '#F8FAFC' }}>
      <MyCardsScreenContent />
    </SafeAreaView>
  );
}
