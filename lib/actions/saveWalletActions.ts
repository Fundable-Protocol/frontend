"use server";

// import prismaClient from "@/prisma";
import { saveWalletPolicy } from "../validations/saveWalletPolicy";
import { db } from "@/db/drizzle";
import { walletModel } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function saveWalletAction(data: { walletAddress: string }) {
  try {
    const parsed = saveWalletPolicy.parse(data);

    const { walletAddress } = parsed;

    // const existingWallet = await prismaClient.wallet.findUnique({
    //   where: { address: walletAddress },
    // });

    const existingWallet = await db
      .select({ id: walletModel.id })
      .from(eq(walletModel.address, walletAddress))
      .limit(1);

    if (existingWallet) return;

    // prismaClient.wallet.create({
    //   data: { address: walletAddress },
    // });

    const [newWallet] = await db
      .insert(walletModel)
      .values({ address: walletAddress })
      .returning();

    return { message: "Wallet saved successfully", wallet: newWallet };
  } catch {}
}
