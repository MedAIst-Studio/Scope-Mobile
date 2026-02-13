import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as Slot from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, View, ViewProps } from 'react-native';

const badgeVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-1 overflow-hidden rounded-full px-3 py-1',
    Platform.select({
      web: 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-fit whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3',
    })
  ),
  {
    variants: {
      variant: {
        default: cn('bg-primary/10', Platform.select({ web: '[a&]:hover:bg-primary/20' })),
        secondary: cn('bg-secondary', Platform.select({ web: '[a&]:hover:bg-secondary/90' })),
        destructive: cn(
          'bg-destructive/10',
          Platform.select({ web: '[a&]:hover:bg-destructive/20' })
        ),
        outline: cn(
          'border border-border bg-transparent',
          Platform.select({ web: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground' })
        ),
        solid: 'bg-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const badgeTextVariants = cva('text-xs font-bold uppercase tracking-wider', {
  variants: {
    variant: {
      default: 'text-primary',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive',
      outline: 'text-muted-foreground',
      solid: 'text-primary-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type BadgeProps = ViewProps &
  React.RefAttributes<View> & {
    asChild?: boolean;
  } & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
  const Component = asChild ? Slot.View : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component className={cn(badgeVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };
