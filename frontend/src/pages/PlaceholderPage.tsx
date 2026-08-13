import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="container-nd py-24 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-brand-green-light flex items-center justify-center mb-5">
        <Construction size={24} className="text-brand-green" />
      </div>
      <h1 className="font-display text-2xl font-bold text-brand-ink">{title}</h1>
      <p className="text-sm text-brand-ink/60 mt-2 max-w-md">
        {description || 'This page is part of the planned build-out and will follow the same design system as the homepage.'}
      </p>
      <a href="/" className="mt-6 text-sm font-semibold text-brand-green hover:underline">
        &larr; Back to Home
      </a>
    </div>
  );
}
