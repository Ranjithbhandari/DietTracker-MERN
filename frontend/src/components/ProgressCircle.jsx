

export default function ProgressCircle({ current, target, size = 200 }) {
  const percentage = Math.min(100, (current / target) * 100);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on percentage
  let color = '#3b82f6'; // blue
  if (percentage > 110) {
    color = '#ef4444'; // red - over
  } else if (percentage >= 90 && percentage <= 110) {
    color = '#10b981'; // green - on track
  } else if (percentage < 90) {
    color = '#f59e0b'; // amber - under
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>

      {/* Text in center */}
      <div className="absolute text-center">
        <p className="text-4xl font-bold text-gray-800">
          {Math.round(percentage)}%
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {current} / {target} cal
        </p>
      </div>
    </div>
  );
}
