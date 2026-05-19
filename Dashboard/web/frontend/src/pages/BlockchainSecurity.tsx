import { FileCheck2, Hash, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DataTable } from '../components/DataTable';
import { Gauge } from '../components/Gauge';
import { Page } from '../components/Page';
import { Panel } from '../components/Panel';
import { StatCard } from '../components/StatCard';
import type { PageProps } from '../services/types';
import { latestRows, topCounts } from '../utils/calculations';
import { pct, toNumber } from '../utils/formatters';

export function BlockchainSecurity({ data, summary }: PageProps) {
  const secureTransactions = data.blockchain.reduce((sum, row) => sum + toNumber(row.SecureTransactions), 0);
  const verifiedRecords = data.blockchain.reduce((sum, row) => sum + toNumber(row.VerifiedFarmRecords), 0);
  const latest = latestRows(data.blockchain, 'BlockIndex', 8).map((row) => ({
    ...row,
    HashShort: `${row.HashPreview?.slice(0, 10) ?? '--'}...`,
  }));
  const timeline = topCounts(data.blockchain, 'TimelineStep', 6);

  return (
    <Page title="Blockchain Security" eyebrow="Traceability and validation">
      <section className="dashboard-grid">
        <div className="col-span-2"><StatCard label="Network Status" value="Operational" detail="Ledger online" icon={ShieldCheck} tone="emerald" /></div>
        <div className="col-span-2"><StatCard label="Transactions" value={data.blockchain.length} detail="Audit records" icon={LockKeyhole} tone="cyan" /></div>
        <div className="col-span-2"><StatCard label="Verified Records" value={verifiedRecords} detail="Farm records" icon={FileCheck2} tone="violet" /></div>
        <div className="col-span-2"><StatCard label="Secure Actions" value={secureTransactions} detail="Secure total" icon={Hash} tone="amber" /></div>
        <div className="col-span-2"><StatCard label="Validation Rate" value={pct(summary.blockchainVerificationRate)} detail="Verified share" icon={ShieldCheck} tone="emerald" /></div>
        <div className="col-span-2"><StatCard label="Contract Status" value={data.blockchain[0]?.SmartContractStatus ?? 'Active'} detail="Automation layer" icon={LockKeyhole} tone="cyan" /></div>

        <Panel title="Validation Rate" subtitle="Verified share of ledger activity" className="col-span-4">
          <Gauge value={summary.blockchainVerificationRate} label="Ledger validation" accent="#34d399" />
          <div className="mt-5 rounded-md border border-emerald-300/15 bg-emerald-300/8 p-4 text-sm font-bold text-emerald-50">
            Smart contract status: {data.blockchain[0]?.SmartContractStatus ?? 'Active'}
          </div>
        </Panel>

        <Panel title="Validation Timeline" subtitle="Ledger workflow stages" className="col-span-8">
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#07111c', border: '1px solid rgba(255,255,255,.14)' }} />
                <Bar dataKey="value" fill="#22d3ee" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Audit Trail" subtitle="Recent chain records" className="col-span-12">
          <DataTable
            rows={latest}
            columns={[
              { key: 'BlockIndex', label: 'Block' },
              { key: 'TransactionID', label: 'Transaction' },
              { key: 'RecordType', label: 'Record Type' },
              { key: 'DataIntegrityStatus', label: 'Integrity' },
              { key: 'ValidationState', label: 'State' },
              { key: 'HashShort', label: 'Hash Preview' },
            ]}
          />
        </Panel>
      </section>
    </Page>
  );
}
