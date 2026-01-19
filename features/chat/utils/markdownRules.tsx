import React from 'react';
import { Platform, Text, View } from 'react-native';
// import MathView from 'react-native-math-view';

export const getMarkdownRules = (textColor: string) => {
  return {
    fence: (node: any, children: any, parent: any, styles: any) => {
      if (node.sourceInfo === 'math' || node.sourceInfo === 'latex') {
        return (
          <View key={node.key} style={{ marginVertical: 10, alignItems: 'center', width: '100%' }}>
            {/* <MathView math={node.content} color={textColor} /> */}
            <Text style={{ color: textColor }}>{node.content}</Text>
          </View>
        );
      }
      return (
        <View key={node.key} style={styles.fence}>
          <Text
            style={{
              color: textColor,
              fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
            }}>
            {node.content}
          </Text>
        </View>
      );
    },
    text: (node: any, children: any, parent: any, styles: any) => {
      const content = node.content;
      // Robust Regex breakdown:
      // 1. $$...$$ (Block)
      // 2. \[...\] (Block)
      // 3. \(...\) (Inline)
      // 4. $...$ (Inline) - strictly no space after first $ and no space before last $ to avoid currency matches
      const regex =
        /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|(?<!\\)\$(?!\s)[^$]+?(?<!\s)(?<!\\)\$)/g;

      const parts = content.split(regex);

      return (
        <Text key={node.key} style={styles.text}>
          {parts.map((part: string, index: number) => {
            if (/^\$\$[\s\S]+?\$\$/.test(part)) {
              const math = part.slice(2, -2);
              // return <MathView key={index} math={math} color={textColor} />;
              return (
                <Text key={index} style={{ color: textColor }}>
                  {math}
                </Text>
              );
            } else if (/^\\\[[\s\S]+?\\\]/.test(part)) {
              const math = part.slice(2, -2);
              // return <MathView key={index} math={math} color={textColor} />;
              return (
                <Text key={index} style={{ color: textColor }}>
                  {math}
                </Text>
              );
            } else if (/^\\\([\s\S]+?\\\)/.test(part)) {
              const math = part.slice(2, -2);
              return (
                // <MathView
                //   key={index}
                //   math={math}
                //   color={textColor}
                //   style={{ height: 16, width: undefined }}
                //   resizeMode="contain"
                // />
                <Text key={index} style={{ color: textColor }}>
                  {math}
                </Text>
              );
            } else if (/^(?<!\\)\$(?!\s)[^$]+?(?<!\s)(?<!\\)\$/.test(part)) {
              const math = part.slice(1, -1);
              return (
                // <MathView
                //   key={index}
                //   math={math}
                //   color={textColor}
                //   style={{ height: 16, width: undefined }}
                //   resizeMode="contain"
                // />
                <Text key={index} style={{ color: textColor }}>
                  {math}
                </Text>
              );
            } else {
              return <Text key={index}>{part}</Text>;
            }
          })}
        </Text>
      );
    },
  };
};
