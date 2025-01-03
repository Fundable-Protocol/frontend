"use client";

import { useState, useCallback } from "react";
import {
  Abi,
  useAccount,
  useContract,
  useTransactionReceipt,
} from "@starknet-react/core";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { ConnectWallet } from "@/component_/ConnectWallet";
import { cairo, Call, CallData, Contract, uint256 } from "starknet";
import { validateDistribution } from "@/utils/validation";
import { toast } from "react-hot-toast";
import { parseEther, parseUnits } from "ethers";
import { Provider, RpcProvider } from "starknet";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import TokenDistributionWallet from "@/components/ui/distribute/TokenDistributionWallet";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

interface Distribution {
  address: string;
  amount: string;
}

interface TokenOption {
  symbol: string;
  address: string;
  decimals: number;
}

// Provider configuration
const provider = new RpcProvider({
  nodeUrl:
    process.env.NEXT_PUBLIC_RPC_URL ||
    "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
});

// Replace with your token contract address
const CONTRACT_ADDRESS =
  "0x288a25635f7c57607b4e017a3439f9018441945246fb5ca3424d8148dd580cc";
// const TOKEN_ADDRESS =
//   "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

const SUPPORTED_TOKENS: { [key: string]: TokenOption } = {
  USDC: {
    symbol: "USDC",
    address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    decimals: 6
  },
  ETH: {
    symbol: "ETH",
    address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    decimals: 18
  },
  STRK: {
    symbol: "STRK",
    address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    decimals: 18
  }
};

export default function DistributePage() {
  const { address, status, account } = useAccount();
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTxHash, setCurrentTxHash] = useState<string | undefined>();
  const [distributionType, setDistributionType] = useState<
    "equal" | "weighted"
  >("equal");
  const [equalAmount, setEqualAmount] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<TokenOption>(
    SUPPORTED_TOKENS.STRK
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingDistribution, setPendingDistribution] = useState<{
    totalAmount: string;
    recipientCount: number;
  } | null>(null);

  // const distributeContract = useContract({
  //   address: CONTRACT_ADDRESS,
  //   abi: abi,
  // });

  // Add transaction receipt hook
  const {
    data: receipt,
    isLoading: isWaitingForTx,
    status: receiptStatus,
    error: receiptError,
  } = useTransactionReceipt({
    hash: currentTxHash,
    watch: true,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      Papa.parse(file, {
        complete: (results) => {
          const parsedDistributions = results.data
            .filter((row: any) => row.length >= 1 && row[0])
            .map((row: any) => ({
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

  const waitForReceipt = async (
    txHash: string
  ): Promise<"success" | "error"> => {
    return new Promise((resolve) => {
      const checkReceipt = setInterval(async () => {
        const receipt = await account?.getTransactionReceipt(txHash);
        if (receipt) {
          clearInterval(checkReceipt);
          // Status 'ACCEPTED_ON_L2' means success
          resolve(receipt.statusReceipt === "success" ? "success" : "error");
        }
      }, 3000); // Check every 3 seconds
    });
  };

  const calculateTotalAmount = () => {
    return distributions.reduce((sum, dist) => {
      return sum + parseFloat(dist.amount);
    }, 0).toString();
  };

  const handleDistribute = async () => {
    if (status !== "connected" || !address || !account) {
      toast.error("Please connect your wallet first");
      return;
    }

    const { abi: ContractAbi } = await account?.getClassAt(CONTRACT_ADDRESS);

    const contract = new Contract(ContractAbi, CONTRACT_ADDRESS, account);

    // if (!contract) {
    //   toast.error('Contract not initialized');
    //   return;
    // }

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

    // Show confirmation modal instead of proceeding directly
    setPendingDistribution({
      totalAmount: calculateTotalAmount(),
      recipientCount: distributions.length
    });
    setShowConfirmModal(true);
  };

  const handleConfirmDistribution = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);

    try {
      toast.loading("Processing distributions...", { duration: Infinity });

      const recipients = distributions.map((dist) => dist.address);

      let tx;
      console.log(distributionType);
      if (!account) {
        throw new Error("Account not found");
      }
      console.log(account);
      if (distributionType === "equal") {
        // Add 1 token (10^18) to each amount // 1 token in wei
        const amounts = distributions.map((dist) =>
          BigInt(parseUnits(dist.amount, selectedToken.decimals))
        );
        const totalAmount = amounts.reduce(
          (sum, amount) => sum + BigInt(amount),
          BigInt(0)
        );
        console.log("Amount", totalAmount);
        const totalAmountString = totalAmount.toString(); // Converts BigInt to string, removing the 'n'
        console.log("Amount String", totalAmountString);
        const low =
          BigInt(totalAmountString) &
          BigInt("0xffffffffffffffffffffffffffffffff");
        const high = BigInt(totalAmountString) >> BigInt(128);
        console.log("Low", low.toString());
        console.log("High", high.toString());

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
          parseUnits(dist.amount, 18)
        );
        const totalAmount = amounts.reduce(
          (sum, amount) => sum + BigInt(amount),
          BigInt(0)
        );
        const low = totalAmount & BigInt("0xffffffffffffffffffffffffffffffff");
        const high = totalAmount >> BigInt(128);
        console.log("executing calls");
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
        console.log("calls", calls);
        const result = await account.execute(calls);
        tx = result.transaction_hash;
      }

      // Set current transaction hash for monitoring
      setCurrentTxHash(tx);

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
      setCurrentTxHash(undefined);
    }
  };

  // Show connect wallet message if not connected
  if (status !== "connected" || !address) {
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
          <h2 className="text-2xl font-semibold mb-4 text-white">Select Token</h2>
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
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Amount per Address</h2>
            <input
              type="text"
              placeholder="Amount to distribute per address"
              value={equalAmount}
              onChange={(e) => {
                setEqualAmount(e.target.value);
                // Update all existing distributions with new amount
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
      />
    </div>
  );
}
