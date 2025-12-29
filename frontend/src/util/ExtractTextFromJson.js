
export const extractTextFromTipTapJSON = (jsonContent, maxLength = 80) => {
  if (!jsonContent) return "";

  let content;
  try {
    content = typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;
  } catch (error) {
    console.error("Error parsing JSON content:", error);
    return "";
  }

  const extractText = (node) => {
    if (!node) return "";

    if (node.type === "text") {
      return node.text || "";
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map(child => extractText(child)).join(" ");
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