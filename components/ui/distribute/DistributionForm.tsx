import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { useStarkNameResolution } from "@/lib/hooks/useStarkNameResolution";
import { useCallback } from "react";

interface DistributionFormProps {
  distributions: Array<{ address: string; amount: string }>;
  setDistributions: (distributions: Array<{ address: string; amount: string }>) => void;
  labels: Record<number, string>;
  setLabels: (labels: Record<number, string> | ((prev: Record<number, string>) => Record<number, string>)) => void;
  showLabels: boolean;
  equalAmount: string;
  distributionType: "equal" | "weighted";
  resolvedAddresses: Record<number, string>;
  setResolvedAddresses: (addresses: Record<number, string>) => void;
}

export const DistributionForm = ({
  distributions,
  setDistributions,
  labels,
  setLabels,
  showLabels,
  equalAmount,
  distributionType,
  resolvedAddresses,
  setResolvedAddresses,
}: DistributionFormProps) => {
  const { resolvingStarkNames, queueStarkNameResolution, processCSVStarkNames } = useStarkNameResolution({
    distributions,
    setDistributions: (newDistributions) => {
      // Update the resolved addresses mapping
      const newResolvedAddresses = { ...resolvedAddresses };
      newDistributions.forEach((dist, index) => {
        if (dist.address.startsWith('0x')) {
          newResolvedAddresses[index] = dist.address;
          // Keep the original Stark name in the UI
          newDistributions[index] = {
            ...newDistributions[index],
            address: distributions[index].address
          };
        }
      });
      setResolvedAddresses(newResolvedAddresses);
      setDistributions(newDistributions);
    }
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      Papa.parse(file, {
        complete: (results: { data: unknown[] }) => {
          const parsedData = (results.data as string[][])
            .filter(row => row[0]);
          
          const parsedDistributions = parsedData.map(row => ({
            address: row[0],
            amount: row[1] || equalAmount,
          }));
          
          setDistributions(parsedDistributions);
          processCSVStarkNames(parsedDistributions);

          // Reset labels first
          setLabels({});
          
          if (showLabels) {
            const newLabels: Record<number, string> = {};
            parsedData.forEach((row, index) => {
              if (row[2]) {
                newLabels[index] = row[2].trim();
              }
            });
            setLabels(newLabels);
          }
        },
        header: false,
        skipEmptyLines: true,
      });
    },
    [equalAmount, showLabels, setDistributions, setLabels, processCSVStarkNames]
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
    field: keyof { address: string; amount: string },
    value: string
  ) => {
    const newDistributions = [...distributions];
    newDistributions[index] = {
      ...newDistributions[index],
      [field]: value,
    };
    setDistributions(newDistributions);

    if (field === "address" && value.endsWith(".stark")) {
      queueStarkNameResolution(index, value);
    }
  };

  const updateLabel = (index: number, value: string) => {
    setLabels((prev: Record<number, string>) => ({
      ...prev,
      [index]: value
    }));
  };

  const removeRow = (index: number) => {
    setDistributions(distributions.filter((_, i) => i !== index));
    // Also remove the resolved address
    const newResolvedAddresses = { ...resolvedAddresses };
    delete newResolvedAddresses[index];
    setResolvedAddresses(newResolvedAddresses);
  };

  return (
    <>
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
                ? showLabels
                  ? "CSV format: address,label (one per line)"
                  : "CSV format: address (one per line)"
                : showLabels
                ? "CSV format: address,amount,label (one per line)"
                : "CSV format: address,amount (one per line)"}
            </p>
          </div>
        )}
      </div>

      {/* Manual Input Section */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Manual Input</h2>
          <button
            type="button"
            onClick={addNewRow}
            className="px-6 py-3 bg-gradient-to-r from-[#440495] to-[#B102CD] hover:from-[#B102CD] hover:to-[#440495] text-white font-bold rounded-full transition-all"
          >
            Add Row
          </button>
        </div>

        {/* Distribution List */}
        <div className="space-y-4">
          {distributions.map((dist, index) => (
            <div key={`dist-${dist.address}-${index}`} className="flex gap-4">
              {showLabels && (
                <input
                  id={`label-${index}`}
                  type="text"
                  placeholder="Label/Name"
                  value={labels[index] || ""}
                  onChange={(e) => updateLabel(index, e.target.value)}
                  className="w-48 bg-starknet-purple bg-opacity-50 rounded-lg px-4 py-2 text-black placeholder-gray-400"
                />
              )}
              <div className="flex-1 relative">
                <input
                  id={`address-${index}`}
                  type="text"
                  placeholder="Address or Stark name (e.g., vitalik.stark)"
                  value={dist.address}
                  onChange={(e) =>
                    updateDistribution(index, "address", e.target.value)
                  }
                  className="w-full bg-starknet-purple bg-opacity-50 rounded-lg px-4 py-2 text-black placeholder-gray-400"
                />
                {resolvingStarkNames[index] && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  </div>
                )}
              </div>
              <input
                id={`amount-${index}`}
                type="text"
                placeholder="Amount"
                value={dist.amount}
                onChange={(e) =>
                  updateDistribution(index, "amount", e.target.value)
                }
                className="w-32 bg-starknet-purple bg-opacity-50 rounded-lg px-4 py-2 text-black placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}; 
