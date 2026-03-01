import { z } from "zod";

export const cardSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be 16 digits").max(16, "Card number must be 16 digits"),
  cardHolderName: z.string().min(1, "Card holder name is required").max(20, "Card holder name must be 20 characters or less"),
  expiry: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format")
    .refine((val) => {
      const [month, year] = val.split('/').map(Number);

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear() % 100;

      if (year > currentYear) return true;
      if (year === currentYear && month >= currentMonth) return true;

      return false;
    }, {
      message: "Card expiry date has passed"
    }),
  cvv: z.string().min(3, "CVV must be 3 digits").max(3, "CVV must be 3 digits"),
});

export type CardSchemaType = z.infer<typeof cardSchema>;