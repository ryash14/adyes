export default function Container({ children, className = '', size = 'default' }) {
  const sizeClass = size === 'sm' ? 'container container-sm'
    : size === 'md' ? 'container container-md'
    : 'container';

  return (
    <div className={`${sizeClass} ${className}`.trim()}>
      {children}
    </div>
  );
}
