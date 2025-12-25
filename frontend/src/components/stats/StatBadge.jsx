const STAT_ICONS = {
  Strength: '⚔️',
  Intelligence: '📚',
  Vitality: '❤️',
  Agility: '⚡',
  Perception: '👁️'
};

export function StatBadge({ statName, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-xl'
  };

  return (
    <span className={`${sizeClasses[size]} inline-block`} title={statName}>
      {STAT_ICONS[statName] || '❓'}
    </span>
  );
}

