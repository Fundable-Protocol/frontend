import prismaClient from "@/prisma";
import { Distribution, DistributionStatus, DistributionType, Network } from "@prisma/client";

export interface CreateDistributionInput {
  user_address: string;
  token_address: string;
  token_symbol: string;
  token_decimals: number;
  total_amount: string;
  fee_amount: string;
  total_recipients: number;
  distribution_type: DistributionType;
  network: Network;
  metadata?: Record<string, string>;
}

export interface UpdateDistributionInput {
  transaction_hash?: string;
  block_number?: bigint;
  block_timestamp?: Date;
  status?: DistributionStatus;
}

export class DistributionService {
  /**
   * Create a new distribution record
   */
  static async createDistribution(data: CreateDistributionInput): Promise<Distribution> {
    return prismaClient.distribution.create({
      data: {
        ...data,
        total_amount: data.total_amount,
        fee_amount: data.fee_amount,
        metadata: data.metadata || undefined,
      },
    });
  }

  /**
   * Update a distribution record with transaction details
   */
  static async updateDistribution(
    id: string,
    data: UpdateDistributionInput
  ): Promise<Distribution> {
    return prismaClient.distribution.update({
      where: { id },
      data,
    });
  }

  /**
   * Get a distribution by ID
   */
  static async getDistribution(id: string): Promise<Distribution | null> {
    return prismaClient.distribution.findUnique({
      where: { id },
    });
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

    const [distributions, total] = await Promise.all([
      prismaClient.distribution.findMany({
        where: { user_address },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prismaClient.distribution.count({
        where: { user_address },
      }),
    ]);

    return { distributions, total };
  }

  /**
   * Get all distributions with pagination
   */
  static async getAllDistributions(
    page = 1,
    limit = 10,
    status?: DistributionStatus
  ): Promise<{ distributions: Distribution[]; total: number }> {
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [distributions, total] = await Promise.all([
      prismaClient.distribution.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prismaClient.distribution.count({ where }),
    ]);

    return { distributions, total };
  }

  /**
   * Get distributions statistics
   */
  static async getDistributionStats(user_address?: string) {
    const where = user_address ? { user_address } : {};

    const [total, completed, failed, pending] = await Promise.all([
      prismaClient.distribution.count({ where }),
      prismaClient.distribution.count({ where: { ...where, status: "COMPLETED" } }),
      prismaClient.distribution.count({ where: { ...where, status: "FAILED" } }),
      prismaClient.distribution.count({ where: { ...where, status: "PENDING" } }),
    ]);

    return {
      total,
      completed,
      failed,
      pending,
    };
  }

  static async getDistributionRecipients(distributionId: string) {
    try {
      const distribution = await prismaClient.distribution.findUnique({
        where: { id: distributionId },
        include: {
          recipients: {
            select: {
              address: true,
              amount: true
            }
          }
        }
      });

      if (!distribution) {
        throw new Error('Distribution not found');
      }

      return distribution.recipients.map(recipient => ({
        address: recipient.address,
        amount: recipient.amount.toString()
      }));
    } catch (error) {
      console.error('Error fetching distribution recipients:', error);
      throw error;
    }
  }
} 