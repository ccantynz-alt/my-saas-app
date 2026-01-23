type Props = {
  data: Record<string, any>;
};

/**
 * SeoJsonLd
 * Safely injects JSON-LD structured data for marketing pages.
 */
export default function SeoJsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD requires raw JSON string, not JSX object
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}