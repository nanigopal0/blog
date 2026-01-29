interface TipTapNode {
  type?: string;
  text?: string;
  content?: TipTapNode[];
  [key: string]: any;
}

type TipTapContent = TipTapNode | string;

/**
 * Extracts plain text from TipTap JSON content
 * @param jsonContent - The TipTap JSON content (as string or object)
 * @param maxLength - Maximum length of extracted text (default: 80)
 * @returns Extracted text, truncated if necessary
 */
export const extractTextFromTipTapJSON = (
  jsonContent: TipTapContent | null | undefined,
  maxLength: number = 80
): string => {
  if (!jsonContent) return "";

  let content: TipTapNode;
  try {
    content = typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;
  } catch (error) {
    console.error("Error parsing JSON content:", error);
    return "";
  }

  const extractText = (node: TipTapNode): string => {
    if (!node) return "";

    if (node.type === "text") {
      return node.text || "";
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map((child) => extractText(child)).join(" ");
    }

    return "";
  };

  const fullText = extractText(content).trim();

  if (fullText.length <= maxLength) {
    return fullText;
  }

  // Find the last space before maxLength to avoid cutting words
  const truncated = fullText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > 0 && lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + "...";
  }

  return truncated + "...";
};
