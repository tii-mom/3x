import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'outline' | 'ghost' | 'soft';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  icon,
  variant = 'outline',
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
    outline: 'border border-[#E2E7F0] bg-white text-[#11141C] hover:bg-[#F8FAFC] active:scale-[0.98]',
    ghost: 'bg-transparent text-[#64748B] hover:text-[#11141C] hover:bg-black/5 active:scale-[0.98]',
    soft: 'bg-[#F0F3FA] text-[#11141C] hover:bg-[#E2E7F0] active:scale-[0.98]',
  };

  return (
    <button
      {...props}
      disabled={disabled}
      className={`font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};
