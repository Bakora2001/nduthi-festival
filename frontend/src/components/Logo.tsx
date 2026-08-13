interface LogoProps {
  variant?: 'light' | 'dark';
}

export default function Logo({ variant = 'light' }: LogoProps) {
  return (
    <a href="/" className="flex items-center shrink-0">
      <img
        src="/nduthi-logo.png"
        alt="Nduthi Festival & Awards Kenya"
        className="h-14 w-auto object-contain"
        style={{
          maxHeight: '56px',
        }}
      />
    </a>
  );
}
