interface HighlightProps {
  text: string;
  query: string;
  className?: string;
}

/**
 * Highlight matching text in a string
 * Matches are case-insensitive and highlighted with a yellow background
 */
export default function Highlight({ text, query, className = '' }: HighlightProps) {
  if (!query.trim()) {
    return <span className={className}>{text}</span>;
  }

  // Escape special regex characters in the query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create a case-insensitive regex to find all matches
  const regex = new RegExp(`(${escapedQuery})`, 'gi');

  // Split the text by matches
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Check if this part matches the query (case-insensitive)
        const isMatch = regex.test(part);
        regex.lastIndex = 0; // Reset regex state

        return isMatch ? (
          <mark key={index} className="bg-yellow-200 font-medium dark:bg-yellow-800">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
}
