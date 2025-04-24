"use client";

import { useState, useEffect, Suspense } from "react";
import { useAccount, useNetwork } from "@starknet-react/core";
import { cairo } from "starknet";
import type { Call } from "starknet";
import { validateDistribution } from "@/utils/validation";
import { toast } from "react-hot-toast";
import { parseUnits } from "ethers";
import { Switch } from "@/components/ui/switch";
import TokenDistributionWallet from "@/components/ui/distribute/TokenDistributionWallet";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import DistributeSkeleton from "@/components/ui/distribute/DistributeSkeleton";
import CartridgeWalletInfo from "@/components/ui/distribute/CartridgeWalletInfo";
import { useCartridge } from "@/lib/hooks/useCartridge";
import { useSearchParams } from "next/navigation";
import { DistributionForm } from "@/components/ui/distribute/DistributionForm";
import { getContractAddress, getSupportedTokens } from "@/lib/constants/tokens";
import type { TokenOption } from "@/lib/constants/tokens";

interface Distribution {
  address: string;
  amount: string;
}

interface RecipientData extends Distribution {
  label?: string;
}

export default function DistributePage() {
  return (
    <Suspense fallback={<DistributeSkeleton />}>
      <DistributePageContent />
    </Suspense>
  );
}

function DistributePageContent() {
  const searchParams = useSearchParams();
  const { isMounted, hasPrevWallet } = useIsMounted();
  const { address, status, account } = useAccount();
  const { isCartridgeConnected } = useCartridge();
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [labels, setLabels] = useState<Record<number, string>>({});
  const [resolvedAddresses, setResolvedAddresses] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [distributionType, setDistributionType] = useState<"equal" | "weighted">("equal");
  const [equalAmount, setEqualAmount] = useState<string>("");
  const [lumpSum, setLumpSum] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<TokenOption | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [pendingDistribution, setPendingDistribution] = useState<{
    totalAmount: string;
    recipientCount: number;
  } | null>(null);
  const [protocolFeePercentage, setProtocolFeePercentage] = useState<number>(0);
  const [isMainnet, setIsMainnet] = useState<boolean>(true);
  const { chain } = useNetwork();

  // Add new state for amount input type
  const [amountInputType, setAmountInputType] = useState<"perAddress" | "lumpSum">("perAddress");

  // Derive current contract address and supported tokens based on network
  const CONTRACT_ADDRESS = getContractAddress(isMainnet);
  const SUPPORTED_TOKENS = getSupportedTokens(isMainnet);

  // Initialize selected token after we know which network we're on
  useEffect(() => {
    if (SUPPORTED_TOKENS && !selectedToken) {
      setSelectedToken(SUPPORTED_TOKENS.STRK);
    }
  }, [SUPPORTED_TOKENS, selectedToken]);

  // Add new useEffect for chain checking
  useEffect(() => {
    if (!isMounted || !chain) return;
    
    if (chain.network !== "mainnet") {
      setIsMainnet(false);
      toast.error(
        "You are currently on Starknet Testnet. Switch to Starknet Mainnet to real-value distributions.",
        {
          duration: 5000,
          icon: '🔄'
        }
      );
    } else {
      setIsMainnet(true);
      toast.dismiss();
    }
  }, [chain, isMounted]);

  useEffect(() => {
    const fetchProtocolFee = async () => {
      if (!account || !isMounted) return;

      try {
        const response = await account.callContract({
          contractAddress: CONTRACT_ADDRESS,
          entrypoint: "get_protocol_fee_percent",
          calldata: [],
        });
        
        const result = Array.isArray(response) ? response : (response as { result: string[] }).result;
        const resultValue = result[0];
        const decimalValue = Number.parseInt(resultValue, 16);
        setProtocolFeePercentage(decimalValue);
      } catch (error) {
        console.error("Error fetching protocol fee:", error);
        toast.error("Failed to fetch protocol fee");
      }
    };

    fetchProtocolFee();
  }, [account, isMounted, CONTRACT_ADDRESS]);

  const calculateTotalAmount = () => {
    return distributions
      .reduce((sum, dist) => {
        return sum + Number.parseFloat(dist.amount);
      }, 0)
      .toString();
  };

  const handleDistribute = async (): Promise<void> => {
    if (status !== "connected" || !address || !account) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!selectedToken) {
      toast.error("No token selected");
      return;
    }

    try {
      if (distributions.length === 0) {
        toast.error("No distributions added");
        return;
      }

      // Check for duplicate addresses
      const addressCounts = distributions.reduce((acc, dist) => {
        acc[dist.address] = (acc[dist.address] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const duplicateAddresses = Object.entries(addressCounts)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, count]) => count > 1)
        .map(([address]) => address);

      if (duplicateAddresses.length > 0) {
        toast.error(
          <div>
            Duplicate addresses found:
            <ul className="list-disc pl-4 mt-2">
              {duplicateAddresses.map((addr) => (
                <li key={addr} className="text-sm">
                  {addr}
                </li>
              ))}
            </ul>
          </div>
        );
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
        // Use resolved address for validation if available
        const addressToValidate = dist.address.endsWith('.stark') ? resolvedAddresses[index] || dist.address : dist.address;
        const validation = validateDistribution(addressToValidate, dist.amount);
        if (!validation.isValid && validation.error) {
          validationErrors.push(`Row ${index + 1}: ${validation.error}`);
        }
      });

      if (validationErrors.length > 0) {
        toast.error(
          <div>
            Invalid distributions:
            <ul className="list-disc pl-4 mt-2">
              {validationErrors.map((error) => (
                <li key={error} className="text-sm">
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
      if (!selectedToken) {
        throw new Error("No token selected");
      }

      toast.loading("Processing distributions...", { duration: Number.POSITIVE_INFINITY });

      // Use resolved addresses for the contract call
      const recipients = distributions.map((dist, idx) =>
        dist.address.endsWith('.stark')
          ? resolvedAddresses[idx] || dist.address
          : dist.address
      );

      let tx: string;
      if (!account) {
        throw new Error("Account not found");
      }

      if (distributionType === "equal") {
        const token = selectedToken;
        const amounts = distributions.map((dist) =>
          BigInt(parseUnits(dist.amount, token.decimals))
        );
        const totalAmount = amounts.reduce(
          (sum, amount) => sum + BigInt(amount),
          BigInt(0)
        );

        // Calculate protocol fee
        const protocolFee =
          (totalAmount * BigInt(protocolFeePercentage)) / BigInt(10000);
        const totalAmountWithFee = totalAmount + protocolFee;

        const low =
          totalAmountWithFee & BigInt("0xffffffffffffffffffffffffffffffff");
        const high = totalAmountWithFee >> BigInt(128);

        try {
          const amountPerRecipient = cairo.uint256(amounts[0]);

          const calls: Call[] = [
            {
              entrypoint: "approve",
              contractAddress: token.address,
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
                token.address,
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
        const token = selectedToken;
        const amounts = distributions.map((dist) =>
          parseUnits(dist.amount, token.decimals)
        );
        const totalAmount = amounts.reduce(
          (sum, amount) => sum + BigInt(amount),
          BigInt(0)
        );

        // Calculate protocol fee
        const protocolFee =
          (totalAmount * BigInt(protocolFeePercentage)) / BigInt(10000);
        const totalAmountWithFee = totalAmount + protocolFee;

        const low =
          totalAmountWithFee & BigInt("0xffffffffffffffffffffffffffffffff");
        const high = totalAmountWithFee >> BigInt(128);

        const calls: Call[] = [
          {
            entrypoint: "approve",
            contractAddress: token.address,
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
              token.address,
            ],
          },
        ];
        const result = await account.execute(calls);
        tx = result.transaction_hash;
      }

      // Wait for receipt
      const receiptStatus = await account.waitForTransaction(tx);

      if (receiptStatus.statusReceipt === "success") {
        // Create distribution record
        try {
          const baseAmount = calculateTotalAmount();
          const protocolFee = (Number(baseAmount) * protocolFeePercentage) / 10000;
          const token = selectedToken;
          
          const distributionsWithLabels = distributions.map((dist, index) => ({
            ...dist,
            label: labels[index]
          }));

          await fetch('/api/distributions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_address: address,
              transaction_hash: tx,
              token_address: token.address,
              token_symbol: token.symbol,
              token_decimals: token.decimals,
              total_amount: baseAmount,
              fee_amount: protocolFee.toString(),
              total_recipients: distributions.length,
              distribution_type: distributionType.toUpperCase(),
              network: isMainnet ? "MAINNET" : "TESTNET",
              status: "COMPLETED",
              metadata: {
                recipients: distributionsWithLabels.map(d => ({
                  address: d.address,
                  amount: d.amount,
                  ...(showLabels && d.label ? { label: d.label } : {})
                }))
              }
            }),
          });
        } catch (error) {
          console.error("Failed to save distribution record:", error);
          // Don't throw here - we still want to show success for the actual distribution
        }

        toast.dismiss();
        toast.success(
          `Successfully distributed tokens to ${recipients.length} addresses`,
          { duration: 10000 }
        );
        setDistributions([]); // Clear the form on success
      } else {
        toast.dismiss();
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

  // Handle URL parameters for pre-populating the form
  useEffect(() => {
    if (!isMounted) return;

    try {
      // Get distribution type
      const type = searchParams.get('type');
      if (type === 'equal' || type === 'weighted') {
        setDistributionType(type);
      }

      // Get token
      const token = searchParams.get('token');
      if (token && SUPPORTED_TOKENS[token]) {
        setSelectedToken(SUPPORTED_TOKENS[token]);
      }

      // Get labels flag
      const labels = searchParams.get('labels');
      if (labels === 'true') {
        setShowLabels(true);
      }

      // Get recipients data
      const recipientsData = searchParams.get('recipients');
      if (recipientsData) {
        const recipients = JSON.parse(recipientsData) as RecipientData[];
        setDistributions(recipients.map(r => ({
          address: r.address,
          amount: r.amount
        })));

        // Set labels if they exist
        const newLabels: Record<number, string> = {};
        recipients.forEach((r, index) => {
          if (r.label) {
            newLabels[index] = r.label;
          }
        });
        setLabels(newLabels);
      }
    } catch (error) {
      console.error('Error parsing URL parameters:', error);
      toast.error('Failed to load distribution data from URL');
    }
  }, [isMounted, searchParams, SUPPORTED_TOKENS]);

  if (!isMounted) {
    return <DistributeSkeleton />;
  }

  if (!hasPrevWallet && status === "disconnected") {
    return <TokenDistributionWallet />;
  }

  if (!selectedToken) {
    return <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#5b21b6] via-[#0d0019] to-[#0d0019]">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bric font-bold text-white mb-8">
          Loading Token Information...
        </h1>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#5b21b6] via-[#0d0019] to-[#0d0019]">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bric font-bold text-white">
            Token Distribution
          </h1>
          
          {/* Network Indicator */}
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
            isMainnet ? 'bg-green-700' : 'bg-yellow-600'
          }`}>
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              isMainnet ? 'bg-green-400' : 'bg-yellow-300'
            }`} />
            <span className="font-semibold text-white">
              {isMainnet ? 'Mainnet' : 'Testnet'}
            </span>
          </div>
        </div>

        {isCartridgeConnected && <CartridgeWalletInfo />}

        {/* Token Selection Dropdown */}
        <div className="mb-8 bg-[#0d0019] bg-opacity-50 p-6 rounded-lg border border-[#5b21b6] border-opacity-20">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Select Token
          </h2>
          <select
            value={selectedToken?.symbol || ''}
            onChange={(e) => {
              if (SUPPORTED_TOKENS[e.target.value]) {
                setSelectedToken(SUPPORTED_TOKENS[e.target.value]);
              }
            }}
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
              <label htmlFor="distribution-type-equal">Equal</label>
              {distributionType === "equal" && (
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#440495] to-[#B102CD]" />
              )}
            </div>

            <Switch
              id="distribution-type-equal"
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
              <label htmlFor="distribution-type-weighted">Weighted</label>
              {distributionType === "weighted" && (
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#440495] to-[#B102CD]" />
              )}
            </div>
          </div>
        </div>

        {/* Label Toggle */}
        <div className="mb-8 bg-[#0d0019] bg-opacity-50 p-6 rounded-lg border border-[#5b21b6] border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-white">Enable Labels</h2>
              <p className="text-sm text-gray-400">Add custom labels/names for each address</p>
            </div>
            <Switch
              id="show-labels"
              checked={showLabels}
              onCheckedChange={setShowLabels}
            />
          </div>
        </div>

        {/* Add Equal Amount Input when type is 'equal' */}
        {distributionType === "equal" && (
          <div className="mb-8 bg-[#0d0019] bg-opacity-50 p-6 rounded-lg border border-[#5b21b6] border-opacity-20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Amount Distribution</h2>
              <select
                id="amount-input-type"
                value={amountInputType}
                onChange={(e) => setAmountInputType(e.target.value as "perAddress" | "lumpSum")}
                className="bg-[#1a1a1a] text-white border border-[#5b21b6] border-opacity-40 rounded-lg px-4 py-2 focus:outline-none focus:border-[#B102CD]"
              >
                <option value="perAddress">Amount per Address</option>
                <option value="lumpSum">Lump Sum</option>
              </select>
            </div>

            <div className="space-y-4">
              {amountInputType === "lumpSum" ? (
                <div>
                  <label htmlFor="lump-sum-input" className="block text-sm font-medium text-gray-300 mb-2">
                    Lump Sum to Distribute
                  </label>
                  <div className="flex gap-4">
                    <input
                      id="lump-sum-input"
                      type="text"
                      placeholder="Enter total amount to distribute"
                      value={lumpSum}
                      onChange={(e) => setLumpSum(e.target.value)}
                      className="flex-1 bg-starknet-purple bg-opacity-50 rounded-lg px-4 py-2 text-black placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (distributions.length === 0) {
                          toast.error("Add some addresses first");
                          return;
                        }
                        if (!lumpSum || Number.isNaN(Number(lumpSum))) {
                          toast.error("Please enter a valid lump sum amount");
                          return;
                        }
                        const perAddressAmount = (Number(lumpSum) / distributions.length).toFixed(2);
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
              ) : (
                <div>
                  <label htmlFor="equal-amount-input" className="block text-sm font-medium text-gray-300 mb-2">Amount per Address</label>
                  <input
                    id="equal-amount-input"
                    type="number"
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
              )}
            </div>
          </div>
        )}

        <DistributionForm
          distributions={distributions}
          setDistributions={setDistributions}
          labels={labels}
          setLabels={setLabels}
          showLabels={showLabels}
          equalAmount={equalAmount}
          distributionType={distributionType}
          resolvedAddresses={resolvedAddresses}
          setResolvedAddresses={setResolvedAddresses}
        />

        {/* Distribution Button */}
        <div className="mb-8">
          <button
            type="button"
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
          selectedToken={selectedToken?.symbol || ""}
          protocolFeePercentage={protocolFeePercentage}
        />
      </div>
    </div>
  );
}