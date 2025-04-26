import { db } from "@/db/drizzle";
import { distributionModel } from "@/db/schema";
// import prismaClient from "@/prisma";
// import {
//   Distribution,
//   DistributionStatus,
//   DistributionType,
//   Network,
// } from "@prisma/client";
import { and, count, desc, eq } from "drizzle-orm";
import { Distribution } from "../types";

export interface CreateDistributionInput {
  user_address: string;
  token_address: string;
  token_symbol: string;
  token_decimals: number;
  total_amount: string;
  fee_amount: string;
  total_recipients: number;
  distribution_type: Distribution["distribution_type"];
  network: Distribution["network"];
  metadata?: Record<string, string>;
}

export interface UpdateDistributionInput {
  transaction_hash?: Distribution["transaction_hash"];
  block_number?: Distribution["block_number"];
  block_timestamp?: Distribution["block_timestamp"];
  status?: Distribution["status"];
}

export class DistributionService {
  /**
   * Create a new distribution record
   */
  static async createDistribution(
    data: CreateDistributionInput
  ): Promise<Distribution> {
    // return prismaClient.distribution.create({
    //   data: {
    //     ...data,
    //     total_amount: data.total_amount,
    //     fee_amount: data.fee_amount,
    //     metadata: data.metadata || undefined,
    //   },
    // });

    const [newDistribution] = await db
      .insert(distributionModel)
      .values({
        ...data,
        total_amount: data.total_amount,
        fee_amount: data.fee_amount,
        metadata: data.metadata || undefined,
      })
      .returning();

    return newDistribution as Distribution;
  }

  /**
   * Update a distribution record with transaction details
   */
  static async updateDistribution(
    id: string,
    data: UpdateDistributionInput
  ): Promise<Distribution> {
    // return prismaClient.distribution.update({
    //   where: { id },
    //   data,
    // });
    const [updatedData] = await db
      .update(distributionModel)
      .set({
        ...(data?.transaction_hash && {
          transaction_hash: data?.transaction_hash,
        }),
        ...(data.block_number !== undefined && {
          block_number: Number(data.block_number), // ← cast here
        }),
        ...(data?.block_timestamp && {
          block_timestamp: data?.block_timestamp,
        }),
        ...(data?.status && {
          status: data?.status,
        }),
      })
      .where(eq(distributionModel.id, id))
      .returning();

    return updatedData as Distribution;
  }

  /**
   * Get a distribution by ID
   */
  static async getDistribution(id: string): Promise<Distribution | null> {
    // return prismaClient.distribution.findUnique({
    //   where: { id },
    // });

    const [dist] = await db
      .select()
      .from(distributionModel)
      .where(eq(distributionModel.id, id))
      .limit(1); // Fetch single row

    return (dist as Distribution) || null;
  }

  /**
   * Get distributions by user address
   */
  static async getDistributionsByUser(
    user_address: string,
    page = 1,
    limit = 10
  ): Promise<{ distributions: Distribution[]; total: number }> {
    const skip = (page - 1) * limit;

    // const [distributions, total] = await Promise.all([
    //   prismaClient.distribution.findMany({
    //     where: { user_address },
    //     orderBy: { created_at: "desc" },
    //     skip,
    //     take: limit,
    //   }),
    //   prismaClient.distribution.count({
    //     where: { user_address },
    //   }),
    // ]);

    // return { distributions, total };

    const [distributions, total] = await Promise.all([
      db
        .select()
        .from(distributionModel)
        .where(eq(distributionModel.user_address, user_address))
        .orderBy(desc(distributionModel.created_at))
        .limit(limit)
        .offset(skip),
      db
        .select({ cnt: count() })
        .from(distributionModel)
        .where(eq(distributionModel.user_address, user_address)),
    ]);

    return {
      distributions: distributions as Distribution[],
      total: Number(total[0]?.cnt ?? 0),
    };
  }

  /**
   * Get all distributions with pagination
   */
  static async getAllDistributions(
    page = 1,
    limit = 10,
    status?: Distribution["status"]
  ): Promise<{ distributions: Distribution[]; total: number }> {
    const skip = (page - 1) * limit;

    // const where = status ? { status } : {};

    // const [distributions, total] = await Promise.all([
    //   prismaClient.distribution.findMany({
    //     where,
    //     orderBy: { created_at: "desc" },
    //     skip,
    //     take: limit,
    //   }),
    //   prismaClient.distribution.count({ where }),
    // ]);

    // return { distributions, total };

    const baseQuery = db.select().from(distributionModel);

    const listQuery = status
      ? baseQuery.where(eq(distributionModel.status, status))
      : baseQuery;

    const countQuery = status
      ? db
          .select({ cnt: count() })
          .from(distributionModel)
          .where(eq(distributionModel.status, status))
      : db.select({ cnt: count() }).from(distributionModel);

    const [distributions, total] = await Promise.all([
      listQuery
        .orderBy(desc(distributionModel.created_at))
        .limit(limit)
        .offset(skip),
      countQuery,
    ]);

    return {
      distributions: distributions as Distribution[],
      total: Number(total[0]?.cnt ?? 0),
    };
  }

  /**
   * Get distributions statistics
   */
  static async getDistributionStats(user_address?: string) {
    // const where = user_address ? { user_address } : {};

    // const [total, completed, failed, pending] = await Promise.all([
    //   prismaClient.distribution.count({ where }),
    //   prismaClient.distribution.count({
    //     where: { ...where, status: "COMPLETED" },
    //   }),
    //   prismaClient.distribution.count({
    //     where: { ...where, status: "FAILED" },
    //   }),
    //   prismaClient.distribution.count({
    //     where: { ...where, status: "PENDING" },
    //   }),
    // ]);

    // return {
    //   total,
    //   completed,
    //   failed,
    //   pending,
    // };

    const baseWhere = user_address
      ? eq(distributionModel.user_address, user_address)
      : undefined;

    const [total, completed, failed, pending] = await Promise.all([
      baseWhere
        ? db.select({ cnt: count() }).from(distributionModel).where(baseWhere)
        : db.select({ cnt: count() }).from(distributionModel),
      db
        .select({ cnt: count() })
        .from(distributionModel)
        .where(
          baseWhere
            ? and(baseWhere, eq(distributionModel.status, "COMPLETED"))
            : eq(distributionModel.status, "COMPLETED")
        ),
      db
        .select({ cnt: count() })
        .from(distributionModel)
        .where(
          baseWhere
            ? and(baseWhere, eq(distributionModel.status, "FAILED"))
            : eq(distributionModel.status, "FAILED")
        ),
      db
        .select({ cnt: count() })
        .from(distributionModel)
        .where(
          baseWhere
            ? and(baseWhere, eq(distributionModel.status, "PENDING"))
            : eq(distributionModel.status, "PENDING")
        ),
    ]);

    return {
      total: Number(total[0]?.cnt ?? 0),
      completed: Number(completed[0]?.cnt ?? 0),
      failed: Number(failed[0]?.cnt ?? 0),
      pending: Number(pending[0]?.cnt ?? 0),
    };
  }

  // static async getDistributionRecipients(distributionId: string) {
  //   try {
  //     const distribution = await prismaClient.distribution.findUnique({
  //       where: { id: distributionId },
  //       select: {
  //         recipients: {
  //           select: {
  //             address: true,
  //             amount: true
  //           }
  //         }
  //       }
  //     });

  //     if (!distribution) {
  //       throw new Error('Distribution not found');
  //     }

  //     return distribution.recipients.map((recipient: RecipientData) => ({
  //       address: recipient.address,
  //       amount: recipient.amount.toString()
  //     }));
  //   } catch (error) {
  //     console.error('Error fetching distribution recipients:', error);
  //     throw error;
  //   }
  // }
}
