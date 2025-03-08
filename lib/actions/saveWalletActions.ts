"use server";

import prismaClient from "@/prisma";
import { saveWalletPolicy } from "../validations/saveWalletPolicy";

export async function saveWalletAction(data: { walletAddress: string }) {
  try {
    const parsed = saveWalletPolicy.parse(data);

    const { walletAddress } = parsed;

    const existingWallet = await prismaClient.wallet.findUnique({
      where: { address: walletAddress },
    });

    if (existingWallet) return;

    const newWallet = await prismaClient.wallet.create({
      data: { address: walletAddress },
    });

    return { message: "Wallet saved successfully", wallet: newWallet };
  } catch {}
}
