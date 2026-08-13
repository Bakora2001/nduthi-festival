import { useState } from 'react';
import { Mail, Send } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: POST to a /api/newsletter endpoint once it exists.
    setSubmitted(true);
    setEmail('');
  }

  return (
    <section className="bg-brand-green">
      <div className="container-nd py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3 text-white">
          <Mail size={20} />
          <div>
            <p className="font-display font-semibold">Stay Updated</p>
            <p className="text-sm text-white/80">Subscribe for the latest news, updates and announcements.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full sm:w-auto gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 sm:w-72 rounded-lg px-4 py-2.5 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-brand-red text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-red-dark transition-colors"
          >
            Subscribe <Send size={14} />
          </button>
        </form>
        {submitted && <p className="text-xs text-white/90 sm:hidden">Thanks — you're subscribed!</p>}
      </div>
    </section>
  );
}
