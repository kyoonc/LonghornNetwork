import { useState, useEffect } from "react";
import { findReferralPath } from "../utils/algorithms";

export default function ReferralView({ students, edges }) {
  const [startName,     setStartName]     = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [path,          setPath]          = useState(null);

  useEffect(() => {
    setStartName(students[0]?.name || "");
    setTargetCompany("");
    setPath(null);
  }, [students]);

  const run = () => {
    if (!startName || !targetCompany.trim()) return;
    const result = findReferralPath(students, edges, startName, targetCompany.trim());
    setPath(result);
  };

  const allCompanies = [
    ...new Set(students.flatMap(s => s.internships).filter(i => i !== "None")),
  ];

  const inputStyle = {
    background: "#0d2a4a",
    color: "#e0e0e0",
    border: "1px solid #2a5a8a",
    padding: "8px 12px",
    borderRadius: 4,
    fontSize: 13,
    outline: "none",
  };

  return (
    <div>
      <h3>Referral Path Finder</h3>
      <p style={{ marginBottom: 16, fontSize: 13 }}>
        Uses Dijkstra&apos;s algorithm with inverted edge weights (10 − weight) so
        stronger connections are treated as shorter paths.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 12, color: "#90a4ae", display: "block", marginBottom: 4 }}>
            Starting Student
          </label>
          <select
            value={startName}
            onChange={e => { setStartName(e.target.value); setPath(null); }}
            style={inputStyle}
          >
            {students.map(s => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, color: "#90a4ae", display: "block", marginBottom: 4 }}>
            Target Company
          </label>
          <input
            type="text"
            value={targetCompany}
            onChange={e => { setTargetCompany(e.target.value); setPath(null); }}
            onKeyDown={e => e.key === "Enter" && run()}
            placeholder="e.g. Google, DummyCompany"
            style={{ ...inputStyle, width: 220 }}
          />
        </div>

        <button onClick={run} style={{ padding: "9px 20px" }}>
          Find Path
        </button>
      </div>

      {allCompanies.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <span style={{ fontSize: 12, color: "#546e7a", marginRight: 8 }}>Quick pick:</span>
          {allCompanies.map(c => (
            <button
              key={c}
              onClick={() => { setTargetCompany(c); setPath(null); }}
              style={{ fontSize: 11, padding: "4px 10px", marginRight: 6, marginBottom: 6 }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {path !== null && (
        <div style={{ marginTop: 4 }}>
          {path.length === 0 ? (
            <p style={{ color: "#ef9a9a" }}>
              No referral path found for &quot;{targetCompany}&quot;.{" "}
              {allCompanies.includes(targetCompany)
                ? "No graph path connects " + startName + " to a student with that internship."
                : "No student in this test case has that internship."}
            </p>
          ) : (
            <div>
              <p style={{ color: "#a5d6a7", marginBottom: 12, fontSize: 13 }}>
                Path found: {path.length} student{path.length !== 1 ? "s" : ""}
              </p>

              <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap", gap: 6 }}>
                {path.map((name, i) => {
                  const student = students.find(s => s.name === name);
                  const hasTarget = student?.internships.includes(targetCompany);
                  return (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{
                        background: hasTarget ? "#1b3a0a" : "#0d2a4a",
                        border: "1px solid " + (hasTarget ? "#a5d6a7" : "#BF5700"),
                        borderRadius: 8,
                        padding: "10px 14px",
                        minWidth: 120,
                      }}>
                        <div style={{ fontWeight: "bold", color: "#e0e0e0" }}>{name}</div>
                        {student && (
                          <>
                            <div style={{ fontSize: 11, color: "#90a4ae", marginTop: 2 }}>
                              {student.major}
                            </div>
                            <div style={{ fontSize: 11, marginTop: 4 }}>
                              {student.internships.map(intern => (
                                <span
                                  key={intern}
                                  style={{
                                    display: "inline-block",
                                    marginRight: 4,
                                    padding: "1px 6px",
                                    borderRadius: 3,
                                    fontSize: 10,
                                    background: intern === targetCompany ? "#a5d6a7" : "#1a3a5a",
                                    color: intern === targetCompany ? "#0a1520" : "#90a4ae",
                                    fontWeight: intern === targetCompany ? "bold" : "normal",
                                  }}
                                >
                                  {intern}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                        {hasTarget && (
                          <div style={{ fontSize: 10, color: "#a5d6a7", marginTop: 4, fontWeight: "bold" }}>
                            ✓ Has {targetCompany}
                          </div>
                        )}
                      </div>
                      {i < path.length - 1 && (
                        <span style={{ color: "#BF5700", fontSize: 22 }}>→</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <h4>All Internships in This Test Case</h4>
        <div style={{ background: "#070f18", border: "1px solid #1a3a5a", borderRadius: 6, padding: "10px 14px" }}>
          {students.map(s => (
            <div key={s.name} style={{ fontFamily: "monospace", fontSize: 12, color: "#cfd8dc", marginBottom: 3 }}>
              <span style={{ color: "#BF5700" }}>{s.name}</span>
              {": ["}
              {s.internships.filter(i => i !== "None").length > 0
                ? s.internships.filter(i => i !== "None").join(", ")
                : <span style={{ color: "#546e7a" }}>None</span>}
              {"]"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
