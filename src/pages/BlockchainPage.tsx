import React from 'react';
import { useBlockchain } from '../contexts/BlockchainContext';
import { TransactionTable } from '../components/blockchain/TransactionTable';
import { KpiCard } from '../components/common/KpiCard';
import { Link as ChainIcon, ShieldCheck, Box, AlertOctagon, CheckCircle2, Server } from 'lucide-react';

export const BlockchainPage: React.FC = () => {
  const { transactions, isHyperledgerFabricActive, tamperedShipments } = useBlockchain();

  const totalTx = transactions.length;
  const latestBlock = transactions.length > 0 ? Math.max(...transactions.map((t) => t.blockNumber)) : 1042;
  const verifiedCount = transactions.filter((t) => t.status === 'CONFIRMED').length;
  const tamperFailuresCount = tamperedShipments.size;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-extrabold border border-emerald-200 uppercase">
              {isHyperledgerFabricActive ? 'Hyperledger Fabric Connected' : 'Mock Blockchain Ledger Active'}
            </span>
            <span className="text-xs text-slate-400">• Channel: agrichain-channel</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Blockchain Ledger Explorer</h1>
          <p className="text-xs text-slate-500 font-medium">
            Immutable SHA-256 Merkle chain recording shipment creation, sensor batches, and custody transfers.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono">
          <Server className="w-4 h-4 text-emerald-700" />
          <span>Peer: peer0.org1.agrichain.com</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Transactions"
          value={totalTx}
          subtitle="Signed & endorsed on-chain"
          icon={ChainIcon}
          variant="default"
        />
        <KpiCard
          title="Latest Block Height"
          value={`#${latestBlock}`}
          subtitle="Consensus via Raft orderer"
          icon={Box}
          variant="info"
        />
        <KpiCard
          title="Verified Records"
          value={verifiedCount}
          subtitle="100% cryptographic integrity"
          icon={ShieldCheck}
          variant="success"
        />
        <KpiCard
          title="Integrity Failures"
          value={tamperFailuresCount}
          subtitle={tamperFailuresCount > 0 ? 'Tampering detected in UI demo' : '0 Mismatches detected'}
          icon={AlertOctagon}
          variant={tamperFailuresCount > 0 ? 'danger' : 'default'}
        />
      </div>

      {/* Ledger Table */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ChainIcon className="w-5 h-5 text-emerald-700" />
          <span>Full Immutable Transaction Log</span>
        </h3>

        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
};
