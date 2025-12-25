export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = '',
  type = 'button'
}) {
  const variantClasses = {
    primary: 'btn-pixel',
    secondary: 'btn-pixel btn-pixel-secondary',
    accent: 'btn-pixel btn-pixel-accent'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

