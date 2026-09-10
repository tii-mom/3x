import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'blue' | 'dark' | 'danger';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon,
  variant = 'blue',
  fullWidth = true,
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'h-10 px-4 text-[13px]',
    md: 'h-12 px-5 text-[14px]',
    lg: 'h-14 px-6 text-[15px]',
  };

  const variantStyles = {
    blue: 'bg-[#2F6BFF] hover:bg-[#1E56E0] text-white shadow-[0_4px_16px_rgba(47,107,255,0.28)] active:scale-[0.98]',
    dark: 'bg-[#11141C] hover:bg-[#1E2330] text-white shadow-[0_4px_16px_rgba(17,20,28,0.2)] active:scale-[0.98]',
    danger: 'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-[0_4px_16px_rgba(239,68,68,0.25)] active:scale-[0.98]',
  };

  return (
    <button
      {...props}
      disabled={disabled}
      className={`font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};
