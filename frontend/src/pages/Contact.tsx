import { Phone, Mail, MapPin, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

const CONTACT_NUMBERS = [
  { phone: '0725918002', formatted: '+254 725 918 002', label: 'Inquiries & Support' },
  { phone: '0717747668', formatted: '+254 717 747 668', label: 'Participant Registration' },
  { phone: '0714092875', formatted: '+254 714 092 875', label: 'Sponsorships & Partners' },
  { phone: '0797289641', formatted: '+254 797 289 641', label: 'Event Logistics' },
  { phone: '0794798029', formatted: '+254 794 798 029', label: 'Help Desk / WhatsApp' },
];

export default function Contact() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <SEO
        title="Contact Us | Nduthi Festival & Awards Kenya"
        description="Get in touch with the Nduthi Festival team. Call or WhatsApp our official helplines for participant registration, sponsorships and general inquiries."
        url="https://nduthifestival.co.ke/contact"
      />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-white border-b border-black/5 py-12">
        <img
          src="/hero_flag_bg.jpg"
          alt="Nduthi Festival Kenya"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-right opacity-30 pointer-events-none"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, #fff 55%, rgba(255,255,255,0) 80%)' }}
        />

        <div className="container-nd relative z-10 text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold uppercase tracking-wider">
            📞 Official Helplines
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-ink">
            Get in Touch With Us
          </h1>
          <p className="text-sm text-brand-ink/60 leading-relaxed">
            Have questions about voting, registering as a participant, or partnering with Nduthi Festival? Reach out directly through any of our official phone lines.
          </p>
        </div>
      </section>

      {/* Main Contact Content */}
      <section className="py-12">
        <div className="container-nd max-w-5xl space-y-10">
          {/* Phone Numbers Grid */}
          <div>
            <div className="text-center mb-6">
              <h2 className="font-display font-extrabold text-xl text-brand-ink">
                Official Contact Numbers
              </h2>
              <p className="text-xs text-brand-ink/50 mt-1">
                Available 24/7 for calls and WhatsApp messages
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CONTACT_NUMBERS.map((c, i) => (
                <div
                  key={c.phone}
                  className="bg-white rounded-2xl border border-black/5 shadow-card hover:shadow-card-lg transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-9 h-9 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-sm">
                        #{i + 1}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green bg-brand-green/10 px-2.5 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wide">
                      {c.label}
                    </p>
                    <a
                      href={`tel:${c.phone}`}
                      className="font-display font-black text-lg text-brand-ink hover:text-brand-green transition-colors block mt-1"
                    >
                      {c.formatted}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-black/5">
                    <a
                      href={`tel:${c.phone}`}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-brand-green text-white hover:bg-brand-green-dark transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Phone size={13} /> Call
                    </a>
                    <a
                      href={`https://wa.me/254${c.phone.substring(1)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare size={13} /> WhatsApp
                    </a>
                  </div>
                </div>
              ))}

              {/* Extra Card: Email & Location */}
              <div className="bg-gradient-to-br from-[#14231A] to-[#0A160F] text-white rounded-2xl shadow-card p-6 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                <div>
                  <h3 className="font-display font-extrabold text-lg">Office &amp; Email</h3>
                  <p className="text-xs text-white/70 mt-1">
                    Reach out for official inquiries and corporate correspondence.
                  </p>
                  <div className="space-y-3 mt-4 text-xs text-white/90">
                    <div className="flex items-center gap-2">
                      <Mail size={15} className="text-brand-green shrink-0" />
                      <a href="mailto:info@nduthiawards.co.ke" className="hover:underline">
                        info@nduthiawards.co.ke
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-brand-green shrink-0" />
                      <span>Eldoret, Kenya</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-white/60">
                  Nduthi Festival &amp; Awards Kenya
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
