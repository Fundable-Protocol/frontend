import { z } from "zod";

export const saveWalletPolicy = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{64}$/, {
    message: "Invalid wallet address format.",
  }),
});
