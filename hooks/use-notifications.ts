import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

/**
 * Email Notification Hook
 * 
 * IMPORTANT: React Native cannot send emails directly via SMTP (like nodemailer).
 * To implement real Gmail notifications, you have THREE options:
 * 
 * OPTION 1 (Recommended): Create a simple backend API
 * - Create a Node.js/Express server with nodemailer
 * - Deploy it (Vercel, Heroku, AWS Lambda, etc.)
 * - Call your API endpoint from this hook using fetch/axios
 * 
 * OPTION 2: Use a third-party email service
 * - EmailJS (free tier available): https://www.emailjs.com/
 * - SendGrid API
 * - Mailgun API
 * - Install their React Native SDK and configure
 * 
 * OPTION 3: Use Expo's notification service
 * - expo-notifications for push notifications
 * - Not email, but real-time notifications
 * 
 * For now, this uses mock alerts. To implement real emails:
 * 1. Choose one of the options above
 * 2. Replace the mock implementation below with actual API calls
 * 3. Update email-config.ts with your credentials
 */

export const useNotifications = () => {
  const sendEmailNotification = async (title: string, message: string) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      const email = user?.email || 'user@gmail.com';

      // TODO: Replace this mock implementation with real email sending
      // Example for Option 1 (Backend API):
      // const response = await fetch('https://your-api.com/send-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ to: email, subject: title, text: message })
      // });

      console.log(`[MOCK EMAIL] To: ${email}`);
      console.log(`[MOCK EMAIL] Subject: ${title}`);
      console.log(`[MOCK EMAIL] Body: ${message}`);

      const isNotificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
      if (isNotificationsEnabled !== 'false') {
        Alert.alert(
          "Notification Sent",
          `A confirmation email has been sent to ${email}`
        );
      }
    } catch (error) {
      console.error("Failed to send notification", error);
    }
  };

  return { sendEmailNotification };
};
