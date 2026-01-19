declare module 'react-native-math-view' {
  import React from 'react';
  import { StyleProp, ViewProps, ViewStyle } from 'react-native';

  export interface MathViewProps extends ViewProps {
    math: string;
    style?: StyleProp<ViewStyle>;
    color?: string;
    resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  }

  const MathView: React.FC<MathViewProps>;
  export default MathView;
}
