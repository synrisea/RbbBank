import LayoutContent from "@/layout/layout-content";
import { AppSettingsProvider } from "@/hooks/use-app-settings";

export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <LayoutContent />
    </AppSettingsProvider>
  );
}
