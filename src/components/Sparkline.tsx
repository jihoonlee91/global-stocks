interface SparklineProps {
  values: number[];
  positive: boolean;
}

const WIDTH = 100;
const HEIGHT = 32;

export function Sparkline({ values, positive }: SparklineProps) {
  if (values.length < 2) return <svg width={WIDTH} height={HEIGHT} />;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * WIDTH;
    const y = HEIGHT - ((v - min) / range) * HEIGHT;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg width={WIDTH} height={HEIGHT} className="sparkline" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={positive ? 'var(--up)' : 'var(--down)'}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
