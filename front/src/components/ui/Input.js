export default function Input({ label, type = 'text', value, onChange, placeholder, error, success, iconLeft, iconRight, disabled, name, children }) {
  let wrapperClass = 'input-wrapper';
  if (error) wrapperClass += ' input-wrapper--error';
  else if (success) wrapperClass += ' input-wrapper--success';

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div className={wrapperClass}>
        {iconLeft && <span className="input-icon input-icon--left">{iconLeft}</span>}
        <input
          className="input-field"
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          name={name}
        />
        {iconRight && <span className="input-icon input-icon--right">{iconRight}</span>}
      </div>
      {error && <span className="input-hint input-hint--error">{error}</span>}
      {!error && success && <span className="input-hint input-hint--success">{success}</span>}
      {children}
    </div>
  );
}
