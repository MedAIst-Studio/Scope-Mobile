import { ContentPart, parseContent } from '@/features/chat/utils/contentParser';
import { convertLatexToMarkdown } from '@/features/chat/utils/latexUtils';
import { getMarkdownStyles } from '@/features/chat/utils/markdownConfig';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import MathJax from 'react-native-mathjax';

interface MathMarkdownRendererProps {
  content: string;
  isUser: boolean;
  isDark: boolean;
}

export const MathMarkdownRenderer: React.FC<MathMarkdownRendererProps> = ({
  content,
  isUser,
  isDark,
}) => {
  const textColor = isUser ? '#FFFFFF' : isDark ? '#E2E8F0' : '#1E293B';
  const styles = getMarkdownStyles(textColor, isUser, isDark);

  const parts = useMemo(() => parseContent(content), [content]);

  return (
    <View className="w-full items-start">
      {parts.map((part: ContentPart) => {
        if (part.type === 'math') {
          return (
            <View
              key={part.key}
              style={{
                alignSelf: 'center',
                marginVertical: 12,
                width: '100%',
              }}>
              <MathJax
                html={`
                  <div style="color: ${textColor}; text-align: center;">
                    ${part.content}
                  </div>
                `}
                mathJaxOptions={{
                  messageStyle: 'none',
                  extensions: ['tex2jax.js'],
                  jax: ['input/TeX', 'output/HTML-CSS'],
                  tex2jax: {
                    inlineMath: [
                      ['$', '$'],
                      ['\\(', '\\)'],
                    ],
                    displayMath: [
                      ['$$', '$$'],
                      ['\\[', '\\]'],
                    ],
                    processEscapes: true,
                  },
                  TeX: {
                    extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js'],
                  },
                  'HTML-CSS': {
                    availableFonts: ['TeX'],
                    styles: {
                      '.MathJax_Display': { 'text-align': 'center', margin: 0 },
                      body: {
                        'background-color': 'transparent',
                        margin: 0,
                        padding: 0,
                        color: textColor,
                      },
                    },
                  },
                }}
                style={{ backgroundColor: 'transparent', width: '100%' }}
              />
            </View>
          );
        } else {
          const hasInlineMath = /(\$[^$]+\$|\\\([\s\S]*?\\\))/.test(part.content);

          if (hasInlineMath) {
            let htmlContent = part.content
              .replace(/\n/g, '<br/>')
              .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
              .replace(/\*(.*?)\*/g, '<i>$1</i>');

            return (
              <View key={part.key} style={{ width: '100%', marginVertical: 4 }}>
                <MathJax
                  html={`
                    <div style="
                      color: ${textColor}; 
                      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif;
                      font-size: 15px;
                      line-height: 1.5;
                    ">
                      ${htmlContent}
                    </div>
                  `}
                  mathJaxOptions={{
                    messageStyle: 'none',
                    extensions: ['tex2jax.js'],
                    jax: ['input/TeX', 'output/HTML-CSS'],
                    tex2jax: {
                      inlineMath: [
                        ['$', '$'],
                        ['\\(', '\\)'],
                      ],
                      displayMath: [
                        ['$$', '$$'],
                        ['\\[', '\\]'],
                      ],
                      processEscapes: true,
                    },
                    TeX: {
                      extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js'],
                    },
                    'HTML-CSS': {
                      availableFonts: ['TeX'],
                      styles: {
                        body: {
                          'background-color': 'transparent',
                          margin: 0,
                          padding: 0,
                          color: textColor,
                        },
                      },
                    },
                  }}
                  style={{ backgroundColor: 'transparent', width: '100%' }}
                />
              </View>
            );
          } else {
            // Plain markdown (no math)
            const markdownContent = convertLatexToMarkdown(part.content);
            if (!markdownContent.trim()) return null;

            return (
              <Markdown
                key={part.key}
                style={
                  {
                    ...styles,
                    body: {
                      color: textColor,
                      fontSize: 16,
                      lineHeight: 24,
                    },
                  } as any
                }>
                {markdownContent}
              </Markdown>
            );
          }
        }
      })}
    </View>
  );
};
