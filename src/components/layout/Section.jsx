export default function Section({ children, className = '', size = 'default' }) {
  const sizeClass = size === 'sm' ? 'section-sm' : size === 'lg' ? 'section-lg' : 'section';

  return (
    <section className={`${sizeClass} ${className}`.trim()}>
      {children}
    </section>
  );
}
