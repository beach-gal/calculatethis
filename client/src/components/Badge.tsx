interface BadgeProps {
  children: React.ReactNode;
  variant?: 'new' | 'default';
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide";
  
  const variantClasses = {
    new: "bg-red-500 text-white animate-pulse",
    default: "bg-blue-500 text-white"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`} data-testid={`badge-${variant}`}>
      {children}
    </span>
  );
}
