export const convertLatexToMarkdown = (latexContent: string): string => {
  let markdownContent = latexContent;

  // Convert LaTeX sections to Markdown headers
  markdownContent = markdownContent.replace(/\\section\*\{([^}]+)\}/g, '## $1');
  markdownContent = markdownContent.replace(/\\section\{([^}]+)\}/g, '## $1');

  // Convert LaTeX text formatting
  markdownContent = markdownContent.replace(/\\textbf\{([^}]+)\}/g, '**$1**');
  markdownContent = markdownContent.replace(/\\emph\{([^}]+)\}/g, '*$1*');
  markdownContent = markdownContent.replace(/\\textit\{([^}]+)\}/g, '*$1*');

  // Convert LaTeX itemize to Markdown list
  markdownContent = markdownContent.replace(/\\begin\{itemize\}/g, '');
  markdownContent = markdownContent.replace(/\\end\{itemize\}/g, '');
  markdownContent = markdownContent.replace(/\\item\s+/g, '- ');

  // Convert LaTeX enumerate to Markdown ordered list
  markdownContent = markdownContent.replace(/\\begin\{enumerate\}/g, '');
  markdownContent = markdownContent.replace(/\\end\{enumerate\}/g, '');
  markdownContent = markdownContent.replace(/\\item\s+/g, '1. ');

  // Convert LaTeX spacing commands
  markdownContent = markdownContent.replace(/\\vspace\{[^}]+\}/g, '\n\n');
  markdownContent = markdownContent.replace(/\\\\(?:\[[^\]]*\])?/g, '\n');

  // Convert LaTeX text commands
  markdownContent = markdownContent.replace(/\\text\{([^}]+)\}/g, '$1');
  markdownContent = markdownContent.replace(/\\quad/g, '    ');

  // Clean up extra whitespace
  markdownContent = markdownContent.replace(/\n\s*\n\s*\n/g, '\n\n');

  return markdownContent;
};
