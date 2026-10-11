import logo from '../../WER1_Logo.png';

export function Logo({ className = '' }: { className?: string }) {
  return <img className={`brand-logo ${className}`} src={logo} width={2084} height={2084}
    alt="WER1 Group" decoding="async" />;
}
