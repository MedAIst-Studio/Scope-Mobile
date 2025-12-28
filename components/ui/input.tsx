import { cn } from '@/lib/utils';
import { Platform, TextInput, type TextInputProps } from 'react-native';

function Input({
  className,
  placeholderClassName,
  ...props
}: TextInputProps & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        'flex h-14 w-full min-w-0 flex-row items-center rounded-2xl border border-border/50 bg-card px-4 py-2 text-base leading-5 text-foreground shadow-sm shadow-black/5 dark:border-input dark:bg-background',
        props.editable === false &&
          cn(
            'opacity-50',
            Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
          ),
        Platform.select({
          web: cn(
            'outline-none transition-[color,box-shadow,border-color] selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground/50 md:text-sm',
            'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
          ),
          native: 'placeholder:text-muted-foreground/50',
        }),
        className
      )}
      placeholderTextColor={'rgba(0,0,0,0.3)'}
      {...props}
    />
  );
}

export { Input };
