export default function Photos({ n = 5 }) {
  const l = [
    "Food photo",
    "Package photo",
    "Setup photo",
    "Food photo",
    "Logo / more",
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 12,
        marginBottom: 22,
      }}
    >
      <div className="ph" style={{ gridRow: "1/3", minHeight: 220 }}>
        {l[0]}
      </div>
      {l.slice(1).map((x, i) => (
        <div key={i} className="ph">
          {x}
        </div>
      ))}
    </div>
  );
}
