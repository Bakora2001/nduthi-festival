import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string;
}

const SITE_NAME = 'Nduthi Festival & Awards Kenya';
const DEFAULT_TITLE = 'Nduthi Festival & Awards Kenya | Vote for the Best Riders';
const DEFAULT_DESCRIPTION =
  "Nduthi Festival & Awards Kenya — celebrating excellence, promoting safety and inspiring riders. Vote for your favourite riders, motorcycles and clubs at Kenya's #1 motorcycle festival.";
const DEFAULT_IMAGE = 'https://nduthifestival.co.ke/nduthi-logo.png';
const DEFAULT_KEYWORDS =
  'Nduthi Festival, Nduthi Festival Kenya, Nduthi Fest, Nduthi Fest Kenya, nduthi awards, motorcycle festival Kenya, boda boda awards, Kenya motorcycle community, nduthi awards 2025, best rider Kenya';

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = 'https://nduthifestival.co.ke/',
  type = 'website',
  keywords = DEFAULT_KEYWORDS,
}: SEOProps) {
  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`${SITE_NAME} Logo`} />
      <meta property="og:locale" content="en_KE" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@NduthiFestival" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
