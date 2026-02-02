export type ContentPart = {
  type: 'math' | 'text';
  content: string;
  key: string;
};

export const parseContent = (content: string): ContentPart[] => {
  // Regex to match ONLY Block math: $$ ... $$ OR \[ ... \]
  // We keep inline math ($...$ and \(...\)) inside the text parts so they can flow inline within a single renderer.
  const mathRegex = /(\$\$.*?\$\$|\\\[[\s\S]*?\\\])/g;

  const parts = content.split(mathRegex);

  return parts.map((part, index) => {
    // Check if the part matches our block math regex
    if (part.match(mathRegex)) {
      return { type: 'math', content: part, key: `math-${index}` };
    } else {
      return { type: 'text', content: part, key: `text-${index}` };
    }
  });
};

export const separateMathAndText = parseContent;
