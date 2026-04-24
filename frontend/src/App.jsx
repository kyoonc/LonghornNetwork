import { useState, useEffect } from "react";
import { TEST_CASES } from "./data/testCases";
import { galeShapley, buildGraph } from "./utils/algorithms";
import GraphView      from "./components/GraphView";
import RoommateView   from "./components/RoommateView";
import ReferralView   from "./components/ReferralView";
import FriendChatView from "./components/FriendChatView";

const BOOT_LINES = [
  "LonghornNetwork — ECE 422C Lab 6",
  "Initializing StudentGraph...",
  "Running Test Case 1: Alice, Bob, Charlie, Frank, Dana, Evan (6 students)",
  "Running Test Case 2: Greg, Helen, Ivy (3 students)",
  "Running Test Case 3: Jack, Kim, Leo (3 students)",
  "Average Score: 100",
  "All test cases loaded. Ready.",
];

const TABS = [
  { id: "graph",     label: "📊 Graph"          },
  { id: "roommates", label: "🏠 Roommates"       },
  { id: "referral",  label: "🔗 Referral Path"   },
  { id: "friends",   label: "💬 Friends & Chat"  },
];

export default function App() {
  const [bootLog,      setBootLog]      = useState([]);
  const [loaded,       setLoaded]       = useState(false);
  const [selectedCase, setSelectedCase] = useState(0);
  const [activeTab,    setActiveTab]    = useState("graph");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setBootLog(prev => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(id);
        setTimeout(() => setLoaded(true), 400);
      }
    }, 350);
    return () => clearInterval(id);
  }, []);

  const tc = TEST_CASES[selectedCase];
  const students = tc.students;

  const edges = buildGraph(students, {});
  const roommates = galeShapley(students);

  if (!loaded) {
    return (
      <div className="lobby">
        <h1>🤘 LonghornNetwork</h1>
        <p style={{ marginBottom: 20 }}>Loading data from Main.java...</p>
        <div style={{
          background: "#070f18",
          border: "1px solid #1a3a5a",
          borderRadius: 6,
          padding: "14px 18px",
          textAlign: "left",
          minHeight: 120,
        }}>
          {bootLog.map((line, i) => (
            <div key={i} className="log-line">
              <span style={{ color: "#546e7a", marginRight: 8 }}>&gt;</span>
              {line}
            </div>
          ))}
          {bootLog.length < BOOT_LINES.length && (
            <span style={{ fontFamily: "monospace", color: "#a5d6a7", animation: "none" }}>█</span>
          )}
        </div>
      </div>
    );
  }

 const tabContent = {
    graph:     <GraphView      students={students} edges={edges} roommates={roommates} />,
    roommates: <RoommateView   students={students} roommates={roommates} />,
    referral:  <ReferralView   students={students} edges={edges} />,
    friends:   <FriendChatView students={students} />,
  };

  return (
    <div className="app">
      <header>
        <h1>🤘 LonghornNetwork</h1>
        <span style={{ color: "#90a4ae", fontSize: 14 }}>ECE 422C — Lab 6</span>
      </header>

      <div className="test-case-selector">
        {TEST_CASES.map((t, i) => (
          <button
            key={i}
            className={selectedCase === i ? "active" : ""}
            onClick={() => { setSelectedCase(i); setActiveTab("graph"); }}
            title={t.desc}
          >
            {t.name}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "#546e7a", marginBottom: 16 }}>
        {tc.desc} · {students.length} students · {edges.length} connections
      </p>

      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content" key={activeTab + selectedCase}>
        {tabContent[activeTab]}
      </div>
    </div>
  );
}
