export function Card({ children, className = '' }) {
  return (
    <div className={`card-pixel ${className}`}>
      {children}
    </div>
  );
}

