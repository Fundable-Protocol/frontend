import { useState, useEffect } from 'react';
import { useStarkAddress } from '@starknet-react/core';

interface UseStarkNameResolutionProps {
  distributions: Array<{ address: string; amount: string }>;
  setDistributions: (distributions: Array<{ address: string; amount: string }>) => void;
}

export const useStarkNameResolution = ({ distributions, setDistributions }: UseStarkNameResolutionProps) => {
  const [resolvingStarkNames, setResolvingStarkNames] = useState<Record<number, boolean>>({});
  const [starkNamesToResolve, setStarkNamesToResolve] = useState<Record<number, string>>({});

  const { data: resolvedAddress } = useStarkAddress({ 
    name: Object.values(starkNamesToResolve)[0] || undefined 
  });

  useEffect(() => {
    if (resolvedAddress && Object.keys(starkNamesToResolve).length > 0) {
      const index = Number.parseInt(Object.keys(starkNamesToResolve)[0]);
      const updatedDistributions = [...distributions];
      updatedDistributions[index] = {
        ...updatedDistributions[index],
        address: resolvedAddress,
      };
      setDistributions(updatedDistributions);
      setResolvingStarkNames(prev => ({ ...prev, [index]: false }));
      setStarkNamesToResolve(prev => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
    }
  }, [resolvedAddress, distributions, starkNamesToResolve, setDistributions]);

  const queueStarkNameResolution = (index: number, starkName: string) => {
    setResolvingStarkNames(prev => ({ ...prev, [index]: true }));
    setStarkNamesToResolve(prev => ({ ...prev, [index]: starkName }));
  };

  const processCSVStarkNames = (parsedDistributions: Array<{ address: string; amount: string }>) => {
    const namesToResolve: Record<number, string> = {};
    parsedDistributions.forEach((dist, index) => {
      if (dist.address.endsWith('.stark')) {
        setResolvingStarkNames(prev => ({ ...prev, [index]: true }));
        namesToResolve[index] = dist.address;
      }
    });
    setStarkNamesToResolve(namesToResolve);
  };

  return {
    resolvingStarkNames,
    queueStarkNameResolution,
    processCSVStarkNames,
  };
}; 