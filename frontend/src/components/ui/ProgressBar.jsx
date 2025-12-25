export function ProgressBar({
  current,
  max,
  label = "",
  showNumbers = true,
  className = "",
}) {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const displayPercentage = Math.floor(percentage);

  return (
    <div className={`${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-pixel text-xs text-white">{label}</span>
          {showNumbers && (
            <span className="font-pixel text-xs text-primary">
              {current} / {max}
            </span>
          )}
        </div>
      )}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
      {!label && showNumbers && (
        <div className="text-right mt-1">
          <span className="font-pixel text-xs text-primary">
            {current} / {max}
          </span>
        </div>
      )}
    </div>
  );
}
