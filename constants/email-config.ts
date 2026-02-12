// Email Configuration for Gmail Notifications
// IMPORTANT: Replace these values with your actual Gmail credentials
// To get an app password:
// 1. Go to your Google Account settings
// 2. Navigate to Security → 2-Step Verification
// 3. Scroll down to "App passwords"
// 4. Generate a new app password for "Mail"
// 5. Use that 16-character password below (NOT your regular Gmail password)

export const emailConfig = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'your-email@gmail.com', // Replace with your Gmail address
        pass: 'your-app-password-here' // Replace with your Gmail app password (16 characters)
    }
};

// Example usage:
// user: 'mybank@gmail.com',
// pass: 'abcd efgh ijkl mnop' (app password from Google)
