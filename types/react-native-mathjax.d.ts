declare module 'react-native-mathjax' {
  import React from 'react';
  import { ViewProps } from 'react-native';

  interface MathJaxProps extends ViewProps {
    html: string;
    mathJaxOptions?: any;
  }

  const MathJax: React.FC<MathJaxProps>;
  export default MathJax;
}
