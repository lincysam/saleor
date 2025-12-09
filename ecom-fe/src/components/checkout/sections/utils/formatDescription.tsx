export function extractTextFromDescription(description: string) {
  if (!description) return "";
  try {
    const data = JSON.parse(description);
    if (!data.blocks) return "";
    return data.blocks
      .filter(block => block.data?.text)
      .map(block => block.data.text)
      .join("\n");  // or space if you prefer
  } catch (err) {
    return "";
  }
}