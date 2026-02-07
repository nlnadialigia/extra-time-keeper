import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant: "extra" | "compensation" | "balance";
  isNegative?: boolean;
}

const variantStyles = {
  extra: "bg-card-extra text-card-extra-foreground",
  compensation: "bg-card-compensation text-card-compensation-foreground",
  balance: "bg-card-balance text-card-balance-foreground",
};

const iconBgStyles = {
  extra: "bg-white/20",
  compensation: "bg-white/20",
  balance: "bg-white/20",
};

export function StatsCard({ title, value, subtitle, icon: Icon, variant, isNegative }: StatsCardProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
        variantStyles[variant]
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-white/10" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className={cn(
              "text-xs",
              isNegative ? "text-red-600 font-bold" : "opacity-75"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        
        <div className={cn("rounded-lg p-3", iconBgStyles[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}