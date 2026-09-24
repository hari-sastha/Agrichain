import React, { useState } from 'react';
import { BlockchainTransaction } from '../../types/blockchain';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { Link as ChainIcon, ShieldCheck, Box, Clock, User, Layers } from 'lucide-react';

export const TransactionTable: React.FC<{ transactions: BlockchainTransaction[] }> = ({
  transactions,
}) => {
  const [selectedTx, setSelectedTx] = useState<BlockchainTransaction | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
              <th className="py-3.5 px-4">Transaction ID</th>
              <th className="py-3.5 px-4">Event Type</th>
              <th className="py-3.5 px-4">Shipment</th>
              <th className="py-3.5 px-4">Block #</th>
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Payload Hash</th>
              <th className="py-3.5 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {transactions.map((tx) => (
              <tr
                key={tx.transactionId}
                onClick={() => setSelectedTx(tx)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-800 flex items-center gap-2">
                  <ChainIcon className="w-3.5 h-3.5 text-emerald-600" />
                  {tx.transactionId}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-800 text-[11px]">
                    {tx.type}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{tx.shipmentId}</td>
                <td className="py-3.5 px-4 font-mono text-slate-600">#{tx.blockNumber}</td>
                <td className="py-3.5 px-4 text-slate-500">
                  {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                  {tx.payloadHash.substring(0, 16)}...
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    ✓ {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Detail Modal */}
      <Modal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title={`Transaction Details: ${selectedTx?.transactionId}`}
        subtitle="Hyperledger Fabric Endorsed Immutable Ledger Block"
      >
        {selectedTx && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Block Index</span>
                <span className="font-mono font-bold text-slate-900 text-sm">#{selectedTx.blockNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Channel / Chaincode</span>
                <span className="font-mono font-semibold text-slate-900">{selectedTx.channel} / {selectedTx.chaincode}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Timestamp</span>
                <span className="font-semibold text-slate-900">{new Date(selectedTx.timestamp).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Target Shipment</span>
                <span className="font-bold text-emerald-800">{selectedTx.shipmentId}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 block">Endorsing Fabric Peers</span>
              <div className="flex flex-wrap gap-2">
                {selectedTx.endorsingPeers.map((peer) => (
                  <span key={peer} className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-700">
                    🛡️ {peer}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">Payload SHA-256 Digest</span>
              <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] break-all border border-slate-800">
                {selectedTx.payloadHash}
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">Previous Block Hash (Merkle Tree Chain)</span>
              <div className="p-3 bg-slate-100 text-slate-700 rounded-xl font-mono text-[11px] break-all border border-slate-200">
                {selectedTx.previousHash}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
