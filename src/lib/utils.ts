export function smartPlaceholder(value: string | undefined | null, fallback: string = '🚧 Stay tuned… something awesome is coming'): string {
  if (!value || value.trim() === '') {
    return fallback;
  }
  return value;
}

export const getPlaceholderFallback = (index: number) => {
  const placeholders = [
    "🚧 Stay tuned… something awesome is coming",
    "🔐 Crafting something secure and powerful",
    "⚡ Under development – check back soon",
    "🛡️ Building in stealth mode",
    "🕵️ Information temporarily redacted",
  ];
  return placeholders[index % placeholders.length];
};
