interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'Product' | 'BreadcrumbList' | 'Review' | 'FAQPage';
  data: any;
}

export function generateStructuredData({ type, data }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://travellr.com';

  const schemas: Record<string, any> = {
    Organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Travellr',
      url: baseUrl,
      logo: `${baseUrl}/images/logo.png`,
      description: 'Discover and book amazing travel experiences around the world',
      sameAs: [
        'https://www.facebook.com/travellr',
        'https://twitter.com/travellr',
        'https://www.instagram.com/travellr',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-123-4567',
        contactType: 'Customer Service',
        email: 'support@travellr.com',
      },
    },
    WebSite: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Travellr',
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/trips?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    Product: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.title,
      description: data.description,
      image: data.images || [],
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: 'USD',
        availability: data.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: `${baseUrl}/trips/${data.slug}`,
        seller: {
          '@type': 'Organization',
          name: data.vendorName,
        },
      },
      aggregateRating: data.rating
        ? {
            '@type': 'AggregateRating',
            ratingValue: data.rating,
            reviewCount: data.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    },
    BreadcrumbList: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.items.map((item: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${baseUrl}${item.url}`,
      })),
    },
    Review: {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Product',
        name: data.productName,
      },
      author: {
        '@type': 'Person',
        name: data.authorName,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: data.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: data.comment,
      datePublished: data.date,
    },
    FAQPage: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.questions.map((q: any) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer,
        },
      })),
    },
  };

  return schemas[type];
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = generateStructuredData({ type, data });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
