export default function Button({ children, variant = 'primary', type = 'button', onClick, disabled, fullWidth }) {
  let className = `btn btn--${variant}`;
  if (fullWidth) className += ' btn--full';

  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
