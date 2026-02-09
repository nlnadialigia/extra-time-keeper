import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button-variants"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Aplicar cores inline para garantir que funcionem
    let variantStyles: React.CSSProperties = {};
    
    if (variant === 'default' || !variant) {
      variantStyles = {
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
      };
    } else if (variant === 'destructive') {
      variantStyles = {
        backgroundColor: 'hsl(var(--destructive))',
        color: 'hsl(var(--destructive-foreground))',
      };
    } else if (variant === 'outline') {
      variantStyles = {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'hsl(var(--input))',
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
      };
    } else if (variant === 'secondary') {
      variantStyles = {
        backgroundColor: 'hsl(var(--secondary))',
        color: 'hsl(var(--secondary-foreground))',
      };
    } else if (variant === 'ghost') {
      variantStyles = {
        color: 'hsl(var(--foreground))',
      };
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{ ...variantStyles, ...style }}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
