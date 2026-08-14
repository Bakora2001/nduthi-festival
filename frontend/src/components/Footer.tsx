import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import Logo from './Logo';

const QUICK_LINKS = ['Home', 'Categories', 'Nominees', 'Live Results', 'Sponsors', 'Gallery'];
const INFO_LINKS = ['About Us', 'How to Vote', 'FAQs', "Terms & Conditions", 'Privacy Policy', 'Refund Policy'];
const CATEGORY_LINKS = ['001 Kenya', 'Rider of the Year', 'Nduthi Blogger of the Year', 'Best Rider group', 'Best customized nduthi', 'People\'s Choice of the Year'];

export default function Footer() {
  return (
    <footer className="bg-white text-brand-ink/80 border-t border-black/5">
      <div className="container-nd py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-1 md:col-span-2 space-y-4">
          <Logo />
          <p className="text-xs text-brand-ink/60 leading-relaxed max-w-xs">
            Celebrating excellence, promoting safety, inspiring riders across Kenya's motorcycle community.
          </p>
          <div className="flex gap-3 pt-2">
            {[Facebook, Instagram, Youtube, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="w-8 h-8 rounded-full bg-brand-ink/[0.04] text-brand-ink flex items-center justify-center hover:bg-brand-green hover:text-white transition-all duration-200"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Quick Links" items={QUICK_LINKS} />
        <FooterColumn title="Information" items={INFO_LINKS} />
        <FooterColumn title="Categories" items={CATEGORY_LINKS} />

        <div className="space-y-3">
          <h4 className="text-brand-ink font-display font-extrabold text-xs tracking-wider uppercase">Contact Us</h4>
          <ul className="space-y-2 text-sm text-brand-ink/60">
            <li>+254 700 123 456</li>
            <li>info@nduthiawards.co.ke</li>
            <li>Eldoret, Kenya</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="container-nd py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-ink/50">
          <p>&copy; {new Date().getFullYear()} Nduthi Festival & Awards Kenya. All Rights Reserved.</p>
          <p className="font-semibold">
            Built with <span className="text-brand-red">&hearts;</span> for Kenya's Riders
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-brand-ink font-display font-extrabold text-xs tracking-wider uppercase">{title}</h4>
      <ul className="space-y-2 text-sm text-brand-ink/65">
        {items.map((item) => (
          <li key={item}>
            <a href="#" className="hover:text-brand-green transition-colors duration-200">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
