export function CharacterAvatar({ level, className = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-20 h-20 border-4 border-primary bg-dark flex items-center justify-center mb-2">
        <span className="text-4xl">⚔️</span>
      </div>
      <div className="font-pixel text-xs text-white">
        Level {level || 1}
      </div>
    </div>
  );
}

