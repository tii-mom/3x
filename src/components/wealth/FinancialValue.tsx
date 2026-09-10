import React from 'react';
import { formatUsd } from '../../utils/formatters';

interface FinancialValueProps {
  value: number;
  prefix?: string;
  suffix?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  trend?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export const FinancialValue: React.FC<FinancialValueProps> = ({
  value,
  prefix = '$',
  suffix = '',
  size = 'md',
  trend = 'neutral',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[14px]',
    md: 'text-[18px] font-semibold',
    lg: 'text-[24px] font-bold',
    hero: 'text-[36px] sm:text-[44px] font-extrabold tracking-tight',
  };

  const trendClasses = {
    positive: 'text-[#00B074]',
    negative: 'text-[#EF4444]',
    neutral: 'text-[#11141C]',
  };

  const formatted = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <span className={`inline-flex items-baseline font-headline tabular-nums ${sizeClasses[size]} ${trendClasses[trend]} ${className}`}>
      {value < 0 ? '-' : trend === 'positive' && prefix === '$' ? '' : ''}
      {prefix && <span className="opacity-80 mr-0.5">{prefix}</span>}
      {formatted}
      {suffix && <span className="text-[0.6em] ml-1 opacity-70 font-normal">{suffix}</span>}
    </span>
  );
};
