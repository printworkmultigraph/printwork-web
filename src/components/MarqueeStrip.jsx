export default function MarqueeStrip({ items, dark = false }) {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className={`overflow-hidden py-5 ${dark ? 'bg-navy-900' : 'bg-secondary'}`}>
      <div className="animate-marquee flex items-center whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className={`mx-8 text-sm font-medium tracking-wide ${
              dark ? 'text-white/60' : 'text-navy-600'
            }`}
          >
            {item}
            <span className={`ml-8 ${dark ? 'text-white/20' : 'text-navy-200'}`}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}