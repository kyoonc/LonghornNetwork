function StudentCard({ student }) {
  return (
    <div>
      <div style={{ fontWeight: "bold", color: "#e0e0e0", fontSize: 15 }}>{student.name}</div>
      <div style={{ fontSize: 12, color: "#90a4ae", marginTop: 2 }}>{student.major}</div>
      <div style={{ fontSize: 12, color: "#546e7a" }}>
        Year {student.year} · GPA {student.gpa.toFixed(1)}
      </div>
    </div>
  );
}

export default function RoommateView({ students, roommates }) {
  if (!students || students.length === 0) return <p>No students loaded.</p>;

  const seen = new Set();
  const pairs   = [];
  const unpaired = [];

  students.forEach(s => {
    if (roommates[s.name] && !seen.has(s.name)) {
      const partner = students.find(x => x.name === roommates[s.name]);
      if (partner) {
        pairs.push([s, partner]);
        seen.add(s.name);
        seen.add(partner.name);
      }
    } else if (!roommates[s.name] && !seen.has(s.name)) {
      unpaired.push(s);
      seen.add(s.name);
    }
  });

  return (
    <div>
      <h3>Roommate Assignments</h3>
      <p style={{ marginBottom: 16, fontSize: 13 }}>
        Algorithm: Gale-Shapley stable matching ·{" "}
        <span style={{ color: "#a5d6a7" }}>{pairs.length} pair{pairs.length !== 1 ? "s" : ""} matched</span>
        {" · "}
        <span style={{ color: unpaired.length > 0 ? "#ef9a9a" : "#546e7a" }}>
          {unpaired.length} unpaired
        </span>
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
        {pairs.map(([a, b], i) => (
          <div key={i} style={{
            background: "#0d2a4a",
            border: "1px solid #BF5700",
            borderRadius: 10,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}>
            <StudentCard student={a} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ color: "#BF5700", fontSize: 22 }}>⟷</span>
              <span style={{ fontSize: 10, color: "#546e7a" }}>roommates</span>
            </div>
            <StudentCard student={b} />
          </div>
        ))}
      </div>

      {unpaired.length > 0 && (
        <div>
          <h4>Unpaired Students</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {unpaired.map(s => (
              <div key={s.name} style={{
                background: "#1a1a2a",
                border: "1px solid #2a3a5a",
                borderRadius: 8,
                padding: "12px 16px",
              }}>
                <StudentCard student={s} />
                <div style={{ fontSize: 11, color: "#546e7a", marginTop: 6 }}>
                  {s.prefs.length === 0
                    ? "No preferences listed"
                    : "No mutual match found"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <h4>Preference Lists</h4>
        <div style={{ background: "#070f18", border: "1px solid #1a3a5a", borderRadius: 6, padding: "10px 14px" }}>
          {students.map(s => (
            <div key={s.name} style={{ fontFamily: "monospace", fontSize: 12, color: "#cfd8dc", marginBottom: 3 }}>
              <span style={{ color: "#BF5700" }}>{s.name}</span>
              {": ["}
              {s.prefs.length > 0 ? s.prefs.join(", ") : <span style={{ color: "#546e7a" }}>empty</span>}
              {"]"}
              {roommates[s.name] && (
                <span style={{ color: "#a5d6a7", marginLeft: 10 }}>
                  → matched with {roommates[s.name]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
