"use client";

import { useState, useCallback } from "react";
import {
  useAccount,
  useContract,
  useTransactionReceipt,
} from "@starknet-react/core";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { ConnectWallet } from "@/component_/ConnectWallet";
import { Call, Contract, uint256 } from "starknet";
import { validateDistribution } from "@/utils/validation";
import { toast } from "react-hot-toast";
import { parseEther, parseUnits } from "ethers";
import { Provider, RpcProvider } from "starknet";
import { Switch } from "@/component_/Switch";

interface Distribution {
  address: string;
  amount: string;
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
const TOKEN_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

export default function DistributePage() {
  const { address, status, account } = useAccount();
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTxHash, setCurrentTxHash] = useState<string | undefined>();
  const [distributionType, setDistributionType] = useState<
    "equal" | "weighted"
  >("equal");
  const [equalAmount, setEqualAmount] = useState<string>("");

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

  const handleDistribute = async () => {
    if (status !== "connected" || !address || !account) {
      toast.error("Please connect your wallet first");
      return;
    }

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

    setIsLoading(true);

    try {
      toast.loading("Processing distributions...", { duration: Infinity });

      const recipients = distributions.map((dist) => dist.address);

      let tx;
      console.log(distributionType);
      console.log(account);
      if (distributionType === "equal") {
        // Add 1 token (10^18) to each amount
        const oneToken = BigInt("1000000000000000000"); // 1 token in wei
        const amounts = distributions.map((dist) =>
          BigInt(parseUnits(dist.amount, 18))
        );
        const totalAmount =
          amounts.reduce((sum, amount) => sum + BigInt(amount), BigInt(0)) +
          oneToken;
        console.log("Amount", totalAmount);
        const totalAmountString = totalAmount.toString(); // Converts BigInt to string, removing the 'n'
        console.log("Amount String", totalAmountString);
        const low =
          BigInt(totalAmountString) &
          BigInt("0xffffffffffffffffffffffffffffffff");
        const high = BigInt(totalAmountString) >> BigInt(128);
        console.log("Low", low);
        console.log("High", high);
        const calls: Call[] = [
          {
            entrypoint: "approve",
            contractAddress: TOKEN_ADDRESS,
            calldata: [CONTRACT_ADDRESS, low.toString(), high.toString()],
          },
          {
            entrypoint: "distribute",
            contractAddress: CONTRACT_ADDRESS,
            calldata: [
              low.toString(),
              high.toString(),
              recipients.length.toString(),
              ...recipients,
              TOKEN_ADDRESS,
            ],
          },
        ];
        console.log(calls);
        const result = await account.execute(calls);
        tx = result.transaction_hash;
      } else {
        const amounts = distributions.map((dist) =>
          parseUnits(dist.amount, 18)
        );
        const totalAmount = amounts.reduce(
          (sum, amount) => sum + BigInt(amount),
          BigInt(0)
        );
        const low = totalAmount & BigInt("0xffffffffffffffffffffffffffffffff");
        const high = totalAmount >> BigInt(128);

        const calls: Call[] = [
          {
            entrypoint: "approve",
            contractAddress: TOKEN_ADDRESS,
            calldata: [CONTRACT_ADDRESS, low.toString(), high.toString()],
          },
          {
            entrypoint: "distribute_weighted",
            contractAddress: CONTRACT_ADDRESS,
            calldata: [
              low.toString(),
              high.toString(),
              amounts.length.toString(),
              ...amounts,
              recipients.length.toString(),
              ...recipients,
              TOKEN_ADDRESS,
            ],
          },
        ];
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
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">Token Distribution</h1>
          <div className="p-8 rounded-lg bg-starknet-purple bg-opacity-20">
            <p className="text-starknet-cyan mb-4">
              Please connect your wallet to use the distribution feature
            </p>
            <ConnectWallet />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Token Distribution</h1>

      {/* Distribution Type Toggle */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Distribution Type</h2>
        <div className="flex items-center gap-3">
          <label htmlFor="distribution-type-toggle">Equal</label>
          <Switch
            id="distribution-type-toggle"
            valueBasis={distributionType === "equal"}
            handleToggle={() => {
              setDistributionType(
                distributionType === "equal" ? "weighted" : "equal"
              );
            }}
          />
          <label>Weighted</label>
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
            <p>Drag and drop a CSV file here, or click to select a file</p>
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
            className="px-4 py-2 bg-starknet-cyan text-starknet-navy rounded-lg font-semibold hover:bg-opacity-90 transition-all"
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
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-opacity-80 transition-all"
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
        className={`w-full px-6 py-3 bg-starknet-cyan text-starknet-navy rounded-lg font-semibold 
          ${
            isLoading || distributions.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-opacity-90"
          } 
          transition-all`}
      >
        {isLoading ? "Processing..." : "Distribute Tokens"}
      </button>
    </div>
  );
}
