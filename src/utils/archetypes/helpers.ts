/**
 * Normalize code type by removing the 'Code' suffix if present
 * and standardizing the format.
 */
export const normalizeCodeType = (codeType: string): string => {
  // Remove any "Code" suffix
  const normalized = codeType.replace(/Code$/, '');
  
  // Convert to lowercase for more flexible matching
  return normalized.toLowerCase();
};

/**
 * Parse a text field into an array of items
 */
export const parseTextToArray = (text: string | null | undefined): string[] => {
  if (!text) return [];
  
  // Split by newlines, commas or semicolons
  return text
    .split(/[,;\n]/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
};

/**
 * Get all possible values for a specific code type
 */
export const getValuesForCodeType = (
  descriptions: any[],
  codeType: string
): number[] => {
  const normalizedCodeType = normalizeCodeType(codeType);
  
  // Extract unique values for the specified code type
  const values = descriptions
    .filter(desc => {
      const descCodeType = normalizeCodeType(desc.code);
      return descCodeType === normalizedCodeType;
    })
    .map(desc => desc.value);
  
  // Remove duplicates and sort
  return Array.from(new Set(values)).sort((a, b) => a - b);
};
