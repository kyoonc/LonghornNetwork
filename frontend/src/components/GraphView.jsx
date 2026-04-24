export default function GraphView({ students, edges, roommates }) {
  if (!students || students.length === 0) return <p>No students loaded.</p>;

  const W = 560, H = 460;
  const cx = W / 2, cy = H / 2;
  const r  = Math.min(W, H) / 2 - 70;
  const NODE_R = 24;

  const pos = {};
  students.forEach((s, i) => {
    const angle = (2 * Math.PI * i) / students.length - Math.PI / 2;
    pos[s.name] = {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  function edgeColor(weight) {
    if (weight >= 7) return "#BF5700";
    if (weight >= 4) return "#FFCD00";
    return "#2a5a8a";
  }

  function edgeWidth(weight) {
    if (weight >= 7) return 3;
    if (weight >= 4) return 2;
    return 1.5;
  }

  function shorten(x1, y1, x2, y2, by) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return { x1, y1, x2, y2 };
    const ux = dx / len, uy = dy / len;
    return {
      x1: x1 + ux * by, y1: y1 + uy * by,
      x2: x2 - ux * by, y2: y2 - uy * by,
    };
  }

  return (
    <div>
      <h3>Student Connection Graph</h3>
      <p style={{ marginBottom: 14, fontSize: 13 }}>
        Each edge weight = connection strength. Roommate pairs have an orange border.
      </p>

      <svg
        width={W} height={H}
        style={{ display: "block", margin: "0 auto", background: "#070f18", borderRadius: 8, border: "1px solid #1a3a5a" }}
      >
        {edges.map((e, i) => {
          const from = pos[e.from], to = pos[e.to];
          if (!from || !to) return null;
          const { x1, y1, x2, y2 } = shorten(from.x, from.y, to.x, to.y, NODE_R + 2);
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;
          const isRoommatePair = roommates[e.from] === e.to;
          return (
            <g key={i}>
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isRoommatePair ? "#BF5700" : edgeColor(e.weight)}
                strokeWidth={isRoommatePair ? 3 : edgeWidth(e.weight)}
                opacity={0.8}
              />
              <circle cx={mx} cy={my} r={9} fill="#0d2a4a" />
              <text
                x={mx} y={my}
                fill="#e0e0e0" fontSize={10} fontWeight="bold"
                textAnchor="middle" dominantBaseline="central"
              >
                {e.weight}
              </text>
            </g>
          );
        })}

        {students.map(s => {
          const p = pos[s.name];
          if (!p) return null;
          const isPaired = !!roommates[s.name];
          return (
            <g key={s.name}>
              <circle
                cx={p.x} cy={p.y} r={NODE_R}
                fill={isPaired ? "#1b2e0a" : "#0d1e35"}
                stroke={isPaired ? "#BF5700" : "#2a5a8a"}
                strokeWidth={isPaired ? 2.5 : 1.5}
              />
              <text
                x={p.x} y={p.y - 4}
                fill="#e0e0e0" fontSize={11} fontWeight="bold"
                textAnchor="middle" dominantBaseline="central"
              >
                {s.name}
              </text>
              <text
                x={p.x} y={p.y + 9}
                fill="#90a4ae" fontSize={9}
                textAnchor="middle"
              >
                Y{s.year}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 12, color: "#90a4ae", flexWrap: "wrap" }}>
        <span><span style={{ color: "#BF5700", fontWeight: "bold" }}>━</span> Roommate pair</span>
        <span><span style={{ color: "#BF5700" }}>━</span> Strong (7+)</span>
        <span><span style={{ color: "#FFCD00" }}>━</span> Medium (4–6)</span>
        <span><span style={{ color: "#2a5a8a" }}>━</span> Weak (1–3)</span>
        <span><span style={{ color: "#BF5700" }}>●</span> Paired node</span>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>Adjacency List</h4>
        <div style={{ background: "#070f18", border: "1px solid #1a3a5a", borderRadius: 6, padding: "10px 14px" }}>
          {students.map(s => {
            const myEdges = edges.filter(e => e.from === s.name || e.to === s.name);
            return (
              <div key={s.name} style={{ fontFamily: "monospace", fontSize: 12, color: "#cfd8dc", marginBottom: 3 }}>
                <span style={{ color: "#BF5700" }}>{s.name}</span>
                {" → ["}
                {myEdges.map((e, i) => {
                  const neighbor = e.from === s.name ? e.to : e.from;
                  return (
                    <span key={i}>
                      {i > 0 && ", "}
                      <span style={{ color: "#90caf9" }}>{neighbor}</span>
                      <span style={{ color: "#546e7a" }}>({e.weight})</span>
                    </span>
                  );
                })}
                {"]"}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
