import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, Pressable } from 'react-native';

const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 rounded-2xl transition-transform duration-100 active:scale-95',
    Platform.select({
      web: "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    })
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-primary shadow-sm active:opacity-90',
          Platform.select({ web: 'hover:opacity-90' })
        ),
        destructive: cn(
          'bg-destructive active:opacity-90 dark:bg-destructive/80',
          Platform.select({
            web: 'hover:opacity-90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
          })
        ),
        outline: cn(
          'border border-border bg-transparent active:bg-secondary/50 dark:border-input dark:active:bg-input/50',
          Platform.select({
            web: 'hover:bg-accent dark:hover:bg-input/50',
          })
        ),
        secondary: cn(
          'bg-secondary active:opacity-80',
          Platform.select({ web: 'hover:opacity-80' })
        ),
        ghost: cn(
          'active:bg-accent dark:active:bg-accent/50',
          Platform.select({ web: 'hover:bg-accent dark:hover:bg-accent/50' })
        ),
        link: '',
      },
      size: {
        default: cn('h-14 px-6', Platform.select({ web: 'has-[>svg]:px-3' })),
        sm: cn(
          'h-10 gap-1.5 rounded-xl px-3 sm:h-8',
          Platform.select({ web: 'has-[>svg]:px-2.5' })
        ),
        lg: cn('h-16 rounded-[2rem] px-8 sm:h-12', Platform.select({ web: 'has-[>svg]:px-4' })),
        icon: 'h-12 w-12 rounded-xl sm:h-10 sm:w-10',
        'icon-sm': 'h-9 w-9 rounded-lg sm:h-8 sm:w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva(
  cn(
    'text-base font-semibold text-foreground',
    Platform.select({ web: 'pointer-events-none transition-colors' })
  ),
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-white',
        outline: 'text-foreground',
        secondary: 'text-secondary-foreground',
        ghost: 'text-foreground/70',
        link: cn('text-primary', Platform.select({ web: 'underline-offset-4 hover:underline' })),
      },
      size: {
        default: '',
        sm: 'text-sm',
        lg: 'text-lg',
        icon: '',
        'icon-sm': '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(props.disabled ? 'opacity-50' : 'opacity-100', buttonVariants({ variant, size }), className)}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
