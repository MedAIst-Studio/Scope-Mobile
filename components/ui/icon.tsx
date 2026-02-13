import { cn } from '@/lib/utils';
import { cssInterop } from 'nativewind';
import { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  as: React.ComponentType<SvgProps>;
  size?: number;
};

function IconImpl({ as: IconComponent, size = 24, ...props }: IconProps) {
  return <IconComponent width={size} height={size} {...props} />;
}

cssInterop(IconImpl, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: 'size',
      width: 'size',
      color: 'color',
    },
  },
});

function Icon({ as: IconComponent, className, size = 24, ...props }: IconProps) {
  return (
    <IconImpl
      as={IconComponent}
      className={cn('text-foreground', className)}
      size={size}
      {...props}
    />
  );
}

export { Icon };
