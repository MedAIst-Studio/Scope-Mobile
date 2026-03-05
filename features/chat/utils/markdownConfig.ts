import { Platform, StyleSheet } from 'react-native';

export const getMarkdownStyles = (textColor: string, isUser: boolean, isDark: boolean) => {
  return StyleSheet.create({
    body: { color: textColor, fontSize: 17, lineHeight: 26 },
    paragraph: { marginVertical: 2 },
    strong: { fontWeight: 'bold', color: textColor },
    em: { fontStyle: 'italic', color: textColor },
    heading1: { fontSize: 24, fontWeight: 'bold', marginVertical: 10, color: textColor },
    heading2: { fontSize: 20, fontWeight: 'bold', marginVertical: 8, color: textColor },
    heading3: { fontSize: 18, fontWeight: 'bold', marginVertical: 6, color: textColor },

    list_item: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 2 },
    bullet_list: { marginVertical: 4 },
    ordered_list: { marginVertical: 4 },
    bullet_list_icon: { color: textColor, marginRight: 8 },
    ordered_list_icon: { color: textColor, marginRight: 8 },
    link: {
      color: isUser ? '#E2E8F0' : '#F97316',
      textDecorationLine: 'underline',
    },
    code_inline: {
      backgroundColor: isUser
        ? 'rgba(255,255,255,0.1)'
        : isDark
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.05)',
      borderRadius: 4,
      paddingHorizontal: 4,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      color: textColor,
    },
    code_block: {
      backgroundColor: isUser
        ? 'rgba(255,255,255,0.1)'
        : isDark
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.05)',
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      color: textColor,
    },
    fence: {
      backgroundColor: isUser
        ? 'rgba(255,255,255,0.1)'
        : isDark
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.05)',
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      color: textColor,
    },
  });
};
