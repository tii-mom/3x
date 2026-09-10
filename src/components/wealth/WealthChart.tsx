import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { chartData24H, chartData7D, chartData30D, chartDataALL } from '../../mocks';
import { formatUsd, formatPercent } from '../../utils/formatters';
import { ShieldCheck, TrendingUp } from 'lucide-react';

interface WealthChartProps {
  currentNav?: number;
  className?: string;
  safeFloor?: number;
}

export const WealthChart: React.FC<WealthChartProps> = ({
  currentNav = 184.28,
  className = '',
  safeFloor = 32.0,
}) => {
  const [timeframe, setTimeframe] = useState<'24H' | '7D' | '30D' | 'ALL'>('7D');
  const [showSafeFloor, setShowSafeFloor] = useState(true);

  const chartData =
    timeframe === '24H'
      ? chartData24H
      : timeframe === '7D'
      ? chartData7D
      : timeframe === '30D'
      ? chartData30D
      : chartDataALL;

  const startVal = chartData[0]?.nav || 100;
  const endVal = chartData[chartData.length - 1]?.nav || currentNav;
  const periodDiff = endVal - startVal;
  const periodPercent = (periodDiff / startVal) * 100;

  return (
    <div className={`bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E7F0] shadow-sm ${className}`}>
      {/* Timeframe selector header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
              Portfolio Trajectory
            </span>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00B074] bg-[#00B074]/10 px-2 py-0.5 rounded-full font-mono">
              <TrendingUp className="w-3 h-3" />
              <span>+{formatUsd(periodDiff)} ({formatPercent(periodPercent, true)})</span>
            </div>
          </div>
          <div className="text-[13px] text-[#11141C] font-semibold mt-0.5">
            Calm Autonomous Compounding ({timeframe})
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#F0F3FA] p-1 rounded-xl self-start sm:self-auto">
          {(['24H', '7D', '30D', 'ALL'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                timeframe === t
                  ? 'bg-white text-[#11141C] shadow-xs'
                  : 'text-[#64748B] hover:text-[#11141C]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chart visualization */}
      <div className="h-[210px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2F6BFF" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#2F6BFF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 5', 'dataMax + 8']}
              tickFormatter={(v) => `$${Math.round(v)}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  const pointTime = payload[0].payload.time;
                  const deltaFromStart = val - startVal;
                  return (
                    <div className="bg-[#090B10] text-white px-3.5 py-2.5 rounded-2xl text-[12px] shadow-2xl border border-white/10 font-mono">
                      <div className="flex items-center justify-between gap-3 text-[10px] text-[#94A3B8]">
                        <span className="uppercase">Net Asset Value</span>
                        <span className="font-semibold text-white/70">{pointTime}</span>
                      </div>
                      <div className="font-extrabold text-[#3AC8FF] text-[16px] mt-0.5">
                        {formatUsd(val)}
                      </div>
                      <div className="text-[11px] text-[#00B074] mt-0.5 flex items-center gap-1">
                        <span>+{formatUsd(deltaFromStart)} vs {timeframe} start</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {showSafeFloor && (
              <ReferenceLine
                y={safeFloor}
                stroke="#00B074"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Safe Floor: $${safeFloor}`,
                  fill: '#00B074',
                  fontSize: 10,
                  position: 'insideBottomRight',
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="nav"
              stroke="#2F6BFF"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#wealthGradient)"
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer calm note with interactive safe floor toggle */}
      <div className="flex flex-wrap items-center justify-between pt-3 mt-3 border-t border-[#F1F5F9] text-[12px] text-[#64748B] gap-2">
        <button
          onClick={() => setShowSafeFloor(!showSafeFloor)}
          className="flex items-center gap-1.5 hover:text-[#11141C] transition-colors cursor-pointer group"
        >
          <span className={`w-2 h-2 rounded-full ${showSafeFloor ? 'bg-[#00B074]' : 'bg-[#CBD5E1]'}`} />
          <span className="font-medium">
            Protected by {formatUsd(safeFloor)} Safe Floor
          </span>
          <span className="text-[10px] text-[#2F6BFF] underline ml-1">
            {showSafeFloor ? 'Hide line' : 'Show line'}
          </span>
        </button>

        <span className="font-medium text-[#11141C] font-mono">
          Starting $100.00 → Current {formatUsd(currentNav)}
        </span>
      </div>
    </div>
  );
};
