import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import Logo from './Logo';

const QUICK_LINKS = ['Home', 'Categories', 'Nominees', 'Live Results', 'News', 'Gallery', 'Contact'];
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
          <h4 className="text-brand-ink font-display font-extrabold text-xs tracking-wider uppercase">Contact Helplines</h4>
          <ul className="space-y-1.5 text-xs text-brand-ink/70">
            <li>
              <a href="tel:0725918002" className="hover:text-brand-green font-semibold transition-colors">
                📞 0725 918 002
              </a>
            </li>
            <li>
              <a href="tel:0717747668" className="hover:text-brand-green font-semibold transition-colors">
                📞 0717 747 668
              </a>
            </li>
            <li>
              <a href="tel:0714092875" className="hover:text-brand-green font-semibold transition-colors">
                📞 0714 092 875
              </a>
            </li>
            <li>
              <a href="tel:0797289641" className="hover:text-brand-green font-semibold transition-colors">
                📞 0797 289 641
              </a>
            </li>
            <li>
              <a href="tel:0794798029" className="hover:text-brand-green font-semibold transition-colors">
                📞 0794 798 029
              </a>
            </li>
            <li className="pt-1 text-[11px] text-brand-ink/50">
              ✉️ info@nduthifestivalawards.co.ke
            </li>
            <li className="text-[11px] text-brand-ink/50">
               Eldoret, Kenya
            </li>
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
