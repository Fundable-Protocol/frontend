"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { cairo, Call } from "starknet";
import { validateDistribution } from "@/utils/validation";
import { toast } from "react-hot-toast";
import { parseUnits } from "ethers";
import { Switch } from "@/components/ui/switch";
import TokenDistributionWallet from "@/components/ui/distribute/TokenDistributionWallet";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import DistributeSkeleton from "@/components/ui/distribute/DistributeSkeleton";

interface Distribution {
  address: string;
  amount: string;
}

interface TokenOption {
  symbol: string;
  address: string;
  decimals: number;
}

const CONTRACT_ADDRESS =
  "0x67a27274b63fa3b070cabf7adf59e7b1c1e5b768b18f84b50f6cb85f59c42e5";

const SUPPORTED_TOKENS: { [key: string]: TokenOption } = {
  USDC: {
    symbol: "USDC",
    address:
      "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    decimals: 6,
  },
  ETH: {
    symbol: "ETH",
    address:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    decimals: 18,
  },
  STRK: {
    symbol: "STRK",
    address:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    decimals: 18,
  },
};

// Add proper type for CSV parsing result
type CSVRow = [string, string];

export default function DistributePage() {
  const { isMounted, hasPrevWallet } = useIsMounted();
  const { address, status, account } = useAccount();
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [distributionType, setDistributionType] = useState<
    "equal" | "weighted"
  >("equal");
  const [equalAmount, setEqualAmount] = useState<string>("");
  const [lumpSum, setLumpSum] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<TokenOption>(
    SUPPORTED_TOKENS.STRK
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingDistribution, setPendingDistribution] = useState<{
    totalAmount: string;
    recipientCount: number;
  } | null>(null);

  const [protocolFeePercentage, setProtocolFeePercentage] = useState<number>(0);

  // Add new state for user's balance
  // const [userBalance, setUserBalance] = useState<bigint>(BigInt(0));

  useEffect(() => {
    const fetchProtocolFee = async () => {
      if (!account) return;

      try {
        const result = await account.callContract({
          contractAddress: CONTRACT_ADDRESS,
          entrypoint: "get_protocol_fee_percent",
          calldata: [],
        });

        if (result) {
          // Convert hex string to decimal
          const hexValue = result[0].toString();
          const decimalValue = parseInt(hexValue, 16);
          setProtocolFeePercentage(decimalValue);
          console.log("protocol fee percentage", decimalValue);
        }
      } catch (error) {
        console.error("Error fetching protocol fee:", error);
        toast.error("Failed to fetch protocol fee");
      }
    };

    fetchProtocolFee();
  }, [account]);

  // // Add function to fetch user's balance
  // const fetchUserBalance = useCallback(async () => {
  //   if (!account || !address) return;

  //   try {
  //     const result = await account.callContract({
  //       contractAddress: selectedToken.address,
  //       entrypoint: "balanceOf",
  //       calldata: [address],
  //     });

  //     if (result && result.length >= 2) {
  //       const low = BigInt(result[0].toString());
  //       const high = BigInt(result[1].toString());
  //       const balance = (high << BigInt(128)) + low;
  //       setUserBalance(balance);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching balance:", error);
  //     toast.error("Failed to fetch balance");
  //   }
  // }, [account, address, selectedToken.address]);

  // // Add useEffect to fetch balance when token changes or component mounts
  // useEffect(() => {
  //   fetchUserBalance();
  //   console.log("user balance", userBalance);
  // }, [fetchUserBalance, selectedToken]);

  const calculateTotalAmount = () => {
    return distributions
      .reduce((sum, dist) => {
        return sum + parseFloat(dist.amount);
      }, 0)
      .toString();
  };

  // Add function to check if user has sufficient balance
  // const hasSufficientBalance = useCallback(() => {
  //   try {
  //     const baseAmount = calculateTotalAmount();
  //     const baseAmountBigInt = BigInt(parseUnits(baseAmount, selectedToken.decimals));
  //     const protocolFeeBigInt = (baseAmountBigInt * BigInt(protocolFeePercentage)) / BigInt(10000);
  //     const totalAmountWithFee = baseAmountBigInt + protocolFeeBigInt;
      
  //     return userBalance >= totalAmountWithFee;
  //   } catch (error) {
  //     return false;
  //   }
  // }, [userBalance, calculateTotalAmount, selectedToken.decimals, protocolFeePercentage]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      Papa.parse<CSVRow>(file, {
        complete: (results) => {
          const parsedDistributions = results.data
            .filter((row) => row[0])
            .map((row) => ({
              address: row[0],
              amount: row[1] || equalAmount,
            }));
          setDistributions(parsedDistributions);
        },
        header: false,
      });
    },
    [equalAmount]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  const addNewRow = () => {
    setDistributions([...distributions, { address: "", amount: "" }]);
  };

  const updateDistribution = (
    index: number,
    field: keyof Distribution,
    value: string
  ) => {
    const newDistributions = [...distributions];
    newDistributions[index] = {
      ...newDistributions[index],
      [field]: value,
    };
    setDistributions(newDistributions);
  };

  const removeRow = (index: number) => {
    setDistributions(distributions.filter((_, i) => i !== index));
  };

  const handleDistribute = async (): Promise<void> => {
    if (status !== "connected" || !address || !account) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      if (distributions.length === 0) {
        toast.error("No distributions added");
        return;
      }

      // Validation based on distribution type
      if (distributionType === "equal") {
        const firstAmount = distributions[0].amount;
        const hasInvalidAmount = distributions.some(
          (dist) => dist.amount !== firstAmount
        );
        if (hasInvalidAmount) {
          toast.error(
            "All distributions must have the same amount for equal distribution"
          );
          return;
        }
      }

      // Check if there are any distributions
      const validationErrors: string[] = [];
      distributions.forEach((dist, index) => {
        const validation = validateDistribution(dist.address, dist.amount);
        if (!validation.isValid && validation.error) {
          validationErrors.push(`Row ${index + 1}: ${validation.error}`);
        }
      });

      if (validationErrors.length > 0) {
        toast.error(
          <div>
            Invalid distributions:
            <ul className="list-disc pl-4 mt-2">
              {validationErrors.map((error, i) => (
                <li key={i} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        );
        return;
      }

      // Calculate total amount including protocol fee
      const baseAmount = calculateTotalAmount();
      const baseAmountBigInt = BigInt(
        parseUnits(baseAmount, selectedToken.decimals)
      );
      const protocolFeeBigInt =
        (baseAmountBigInt * BigInt(protocolFeePercentage)) / BigInt(10000);
      const totalAmountWithFee = baseAmountBigInt + protocolFeeBigInt;
      const totalAmountString = (
        Number(totalAmountWithFee) /
        10 ** selectedToken.decimals
      ).toString();

      // Show confirmation modal with total amount including fee
      setPendingDistribution({
        totalAmount: totalAmountString,
        recipientCount: distributions.length,
      });
      setShowConfirmModal(true);
    } catch (error) {
      console.error("Error getting contract ABI:", error);
      toast.error("Failed to initialize contract");
      return;
    }
  };

  const handleConfirmDistribution = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    try {
      toast.loading("Processing distributions...", { duration: Infinity });

      const recipients = distributions.map((dist) => dist.address);

      let tx;
      if (!account) {
        throw new Error("Account not found");
      }

      if (distributionType === "equal") {
        const amounts = distributions.map((dist) =>
          BigInt(parseUnits(dist.amount, selectedToken.decimals))
        );
        const totalAmount = amounts.reduce(
          (sum, amount) => sum + BigInt(amount),
          BigInt(0)
        );

        // Calculate protocol fee
        const protocolFee =
          (totalAmount * BigInt(protocolFeePercentage)) / BigInt(10000);
        const totalAmountWithFee = totalAmount + protocolFee;

        console.log("Base Amount:", totalAmount.toString());
        console.log("Protocol Fee:", protocolFee.toString());
        console.log("Total Amount with Fee:", totalAmountWithFee.toString());

        const low =
          totalAmountWithFee & BigInt("0xffffffffffffffffffffffffffffffff");
        const high = totalAmountWithFee >> BigInt(128);

        try {
          const amountPerRecipient = cairo.uint256(amounts[0]);

          const calls: Call[] = [
            {
              entrypoint: "approve",
              contractAddress: selectedToken.address,
              calldata: [CONTRACT_ADDRESS, low.toString(), high.toString()],
            },
            {
              entrypoint: "distribute",
              contractAddress: CONTRACT_ADDRESS,
              calldata: [
                amountPerRecipient.low,
                amountPerRecipient.high,
                recipients.length.toString(),
                ...recipients,
                selectedToken.address,
              ],
            },
          ];
          const result = await account.execute(calls);
          tx = result.transaction_hash;
        } catch (error) {
          console.error("Error during contract calls:", error);
          throw new Error(
            error instanceof Error
              ? `Contract interaction failed: ${error.message}`
              : "Contract interaction failed with unknown error"
          );
        }
      } else {
        console.log("Weighted distribution");
        const amounts = distributions.map((dist) =>
          parseUnits(dist.amount, selectedToken.decimals)
        );
        const totalAmount = amounts.reduce(
          (sum, amount) => sum + BigInt(amount),
          BigInt(0)
        );

        // Calculate protocol fee
        const protocolFee =
          (totalAmount * BigInt(protocolFeePercentage)) / BigInt(10000);
        const totalAmountWithFee = totalAmount + protocolFee;

        console.log("Base Amount:", totalAmount.toString());
        console.log("Protocol Fee:", protocolFee.toString());
        console.log("Total Amount with Fee:", totalAmountWithFee.toString());

        const low =
          totalAmountWithFee & BigInt("0xffffffffffffffffffffffffffffffff");
        const high = totalAmountWithFee >> BigInt(128);

        const calls: Call[] = [
          {
            entrypoint: "approve",
            contractAddress: selectedToken.address,
            calldata: [CONTRACT_ADDRESS, low.toString(), high.toString()],
          },
          {
            entrypoint: "distribute_weighted",
            contractAddress: CONTRACT_ADDRESS,
            calldata: [
              amounts.length.toString(),
              ...amounts.flatMap((amount) => {
                const uint256Value = cairo.uint256(amount);
                return [uint256Value.low, uint256Value.high];
              }),
              recipients.length.toString(),
              ...recipients,
              selectedToken.address,
            ],
          },
        ];
        const result = await account.execute(calls);
        tx = result.transaction_hash;
      }

      // Wait for receipt
      const receiptStatus = await account.waitForTransaction(tx);

      if (receiptStatus.statusReceipt === "success") {
        toast.dismiss();
        toast.success(
          `Successfully distributed tokens to ${recipients.length} addresses`,
          { duration: 10000 }
        );
        setDistributions([]); // Clear the form on success
      } else {
        toast.error("Distribution failed");
      }
    } catch (error) {
      console.error("Distribution process failed:", error);
      toast.dismiss();
      toast.error(
        `Distribution failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return <DistributeSkeleton />;
  }

  if (!hasPrevWallet && status === "disconnected") {
    return <TokenDistributionWallet />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#5b21b6] via-[#0d0019] to-[#0d0019]">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bric font-bold text-white mb-8">
          Token Distribution
        </h1>

        {/* Token Selection Dropdown */}
        <div className="mb-8 bg-[#0d0019] bg-opacity-50 p-6 rounded-lg border border-[#5b21b6] border-opacity-20">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Select Token
          </h2>
          <select
            value={selectedToken.symbol}
            onChange={(e) => setSelectedToken(SUPPORTED_TOKENS[e.target.value])}
            className="w-full bg-[#1a1a1a] text-white border border-[#5b21b6] border-opacity-40 rounded-lg px-4 py-2 focus:outline-none focus:border-[#B102CD]"
          >
            {Object.values(SUPPORTED_TOKENS).map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>

        {/* Distribution Type Toggle */}
        <div className="mb-8 bg-[#0d0019] bg-opacity-50 p-6 rounded-lg border border-[#5b21b6] border-opacity-20">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Distribution Type
          </h2>
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 ${
                distributionType === "equal"
                  ? "text-white font-semibold"
                  : "text-[#DADADA]"
              }`}
            >
              <label htmlFor="distribution-type">Equal</label>
              {distributionType === "equal" && (
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#440495] to-[#B102CD]" />
              )}
            </div>

            <Switch
              id="distribution-type"
              checked={distributionType === "equal"}
              onCheckedChange={(checked) => {
                setDistributionType(checked ? "equal" : "weighted");
              }}
            />

            <div
              className={`flex items-center gap-2 ${
                distributionType === "weighted"
                  ? "text-white font-semibold"
                  : "text-[#DADADA]"
              }`}
            >
              <label>Weighted</label>
              {distributionType === "weighted" && (
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#440495] to-[#B102CD]" />
              )}
            </div>
          </div>
        </div>

        {/* Add Equal Amount Input when type is 'equal' */}
        {distributionType === "equal" && (
          <div className="mb-8 bg-[#0d0019] bg-opacity-50 p-6 rounded-lg border border-[#5b21b6] border-opacity-20">
            <h2 className="text-xl font-semibold mb-4 text-white">Amount Distribution</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Lump Sum to Distribute</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter total amount to distribute"
                    value={lumpSum}
                    onChange={(e) => setLumpSum(e.target.value)}
                    className="flex-1 bg-starknet-purple bg-opacity-50 rounded-lg px-4 py-2 text-black placeholder-gray-400"
                  />
                  <button
                    onClick={() => {
                      if (distributions.length === 0) {
                        toast.error("Add some addresses first");
                        return;
                      }
                      if (!lumpSum || isNaN(Number(lumpSum))) {
                        toast.error("Please enter a valid lump sum amount");
                        return;
                      }
                      const perAddressAmount = (Number(lumpSum) / distributions.length).toFixed(3);
                      setEqualAmount(perAddressAmount);
                      setDistributions(prev =>
                        prev.map(dist => ({
                          ...dist,
                          amount: perAddressAmount
                        }))
                      );
                      toast.success(`Calculated ${perAddressAmount} per address for ${distributions.length} addresses`);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-[#440495] to-[#B102CD] hover:from-[#B102CD] hover:to-[#440495] text-white font-bold rounded-lg transition-all"
                  >
                    Calculate
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount per Address</label>
                <input
                  type="text"
                  placeholder="Amount to distribute per address"
                  value={equalAmount}
                  onChange={(e) => {
                    setEqualAmount(e.target.value);
                    setDistributions((prev) =>
                      prev.map((dist) => ({
                        ...dist,
                        amount: e.target.value,
                      }))
                    );
                  }}
                  className="w-full bg-starknet-purple bg-opacity-50 rounded-lg px-4 py-2 text-black placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* CSV Upload Section */}
        <div
          {...getRootProps()}
          className={`border-2 border-starknet-cyan rounded-lg p-8 mb-8 text-center cursor-pointer
            ${isDragActive ? "bg-starknet-purple bg-opacity-20" : ""}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the CSV file here...</p>
          ) : (
            <div>
              <p className="text-white">
                Drag and drop a CSV file here, or click to select a file
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {distributionType === "equal"
                  ? "CSV format: address (one per line)"
                  : "CSV format: address,amount (one per line)"}
              </p>
            </div>
          )}
        </div>

        {/* Manual Input Section */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Manual Input</h2>
            <button
              onClick={addNewRow}
              className="px-6 py-3 bg-gradient-to-r from-[#440495] to-[#B102CD] hover:from-[#B102CD] hover:to-[#440495] text-white font-bold rounded-full transition-all"
            >
              Add Row
            </button>
          </div>

          {/* Distribution List */}
          <div className="space-y-4">
            {distributions.map((dist, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  placeholder="Address"
                  value={dist.address}
                  onChange={(e) =>
                    updateDistribution(index, "address", e.target.value)
                  }
                  className="flex-1 bg-starknet-purple bg-opacity-50 rounded-lg px-4 py-2 text-black placeholder-gray-400"
                />
                <input
                  type="text"
                  placeholder="Amount"
                  value={dist.amount}
                  onChange={(e) =>
                    updateDistribution(index, "amount", e.target.value)
                  }
                  className="w-32 bg-starknet-purple bg-opacity-50 rounded-lg px-4 py-2 text-black placeholder-gray-400"
                />
                <button
                  onClick={() => removeRow(index)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Button */}
        <button
          onClick={handleDistribute}
          disabled={isLoading || distributions.length === 0}
          className={`w-full px-6 py-3 bg-gradient-to-r from-[#440495] to-[#B102CD] text-white font-bold rounded-full
            ${
              isLoading || distributions.length === 0
                ? "opacity-50 cursor-not-allowed from-gray-500 to-gray-600"
                : "hover:from-[#B102CD] hover:to-[#440495]"
            }
            transition-all`}
        >
          {isLoading ? "Processing..." : "Distribute Tokens"}
        </button>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDistribution}
        totalAmount={pendingDistribution?.totalAmount || "0"}
        recipientCount={pendingDistribution?.recipientCount || 0}
        selectedToken={selectedToken.symbol}
        protocolFeePercentage={protocolFeePercentage}
      />
    </div>
  );
}
