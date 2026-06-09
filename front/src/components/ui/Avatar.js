const COLORS = ['#a8ce85', '#7bc9c9', '#c9a87c', '#c97bab', '#7b9fc9', '#c9c97b'];

function getColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function Avatar({ name, size = 'md' }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={`avatar avatar--${size}`}
      style={{ '--avatar-bg': getColor(name) }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
