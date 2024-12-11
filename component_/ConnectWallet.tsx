'use client';

import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { useInjectedConnectors, argent, braavos } from '@starknet-react/core';
import { useState } from 'react';

export function ConnectWallet() {
  const { address } = useAccount();
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "random",
  });
  const { connect, error } = useConnect({});
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);

  if (address) {
    return (
      <div className="relative">
        <button 
          className="px-4 py-2 bg-starknet-cyan text-starknet-navy rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          onClick={() => setShowModal(!showModal)}
        >
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </button>

        {showModal && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-starknet-purple shadow-lg">
            <button
              onClick={() => {
                disconnect();
                setShowModal(false);
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-starknet-navy transition-colors rounded-lg"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        className="px-4 py-2 bg-starknet-cyan text-starknet-navy rounded-lg font-semibold hover:bg-opacity-90 transition-all"
        onClick={() => setShowModal(!showModal)}
      >
        Connect Wallet
      </button>

      {showModal && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-starknet-purple shadow-lg">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => {
                connect({connector});
                setShowModal(false);
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-starknet-navy transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 