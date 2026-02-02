export type ContentPart = {
  type: 'math' | 'text';
  content: string;
  key: string;
};

export const parseContent = (content: string): ContentPart[] => {
  const mathRegex = /(\$\$.*?\$\$|\\\[[\s\S]*?\\\])/g;

  const parts = content.split(mathRegex);

  return parts.map((part, index) => {
    if (part.match(mathRegex)) {
      return { type: 'math', content: part, key: `math-${index}` };
    } else {
      return { type: 'text', content: part, key: `text-${index}` };
    }
  });
};

export const separateMathAndText = parseContent;
