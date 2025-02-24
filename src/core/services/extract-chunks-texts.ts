export const extractChunkTexts = (
  content: string,
  chunkSize: number
): string[] => {
  const chunks: string[] = [];

  const recursiveChunk = (text: string) => {
    // Base case - text is small enough to be a chunk
    if (text.length <= chunkSize) {
      chunks.push(text);
      return;
    }

    // Find the best split point near the middle
    const splitIndex = Math.floor(text.length / 2);
    let leftEnd = text.lastIndexOf("\n", splitIndex);
    let rightStart = text.indexOf("\n", splitIndex);

    // If no newlines found, fall back to splitting on spaces
    if (leftEnd === -1 && rightStart === -1) {
      leftEnd = text.lastIndexOf(" ", splitIndex);
      rightStart = text.indexOf(" ", splitIndex);
    }

    // If still no good split points, just split in the middle
    if (leftEnd === -1) leftEnd = splitIndex;
    if (rightStart === -1) rightStart = splitIndex;

    // Choose the split point closest to the middle
    const splitPoint =
      Math.abs(splitIndex - leftEnd) < Math.abs(splitIndex - rightStart)
        ? leftEnd
        : rightStart;

    // Recursively process each half
    recursiveChunk(text.slice(0, splitPoint).trim());
    recursiveChunk(text.slice(splitPoint).trim());
  };

  recursiveChunk(content);

  return chunks;
};
