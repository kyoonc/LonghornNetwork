import { useState, useEffect } from "react";

export default function FriendChatView({ students }) {
  const [friendLists, setFriendLists] = useState({});
  const [chatHistories, setChatHistories] = useState({});
  const [threadLog, setThreadLog] = useState([]);
  const [hasRun, setHasRun] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
      setFriendLists({});
      setChatHistories({});
      setThreadLog([]);
      setHasRun(false);
      setRunning(false);
  }, [students]);

  const runSimulation = () => {
      if (running || students.length < 2) return;
      setRunning(true);
      setHasRun(false);
      setThreadLog([]);

      const s1 = students[0];
      const s2 = students[1];

      const logLines = [
          `[pool-thread-1] FriendRequestThread started: ${s1.name} → ${s2.name}`,
          `[pool-thread-2] ChatThread started: ${s1.name} → ${s2.name}: "Hello there!"`,
          `[pool-thread-3] FriendRequestThread started: ${s2.name} → ${s1.name}`,
          `[pool-thread-4] ChatThread started: ${s2.name} → ${s1.name}: "Hi back!"`,
          `[pool-thread-1] ${s1.name} added ${s2.name} to friend list`,
          `[pool-thread-3] ${s2.name} added ${s1.name} to friend list`,
          `[pool-thread-2] Chat recorded for ${s1.name} & ${s2.name}`,
          `[pool-thread-4] Chat recorded for ${s2.name} & ${s1.name}`,
          `[ExecutorService] All threads completed.`,
      ];
      let i = 0;
      const interval = setInterval(() => {
      if (i < logLines.length) {
          setThreadLog(prev => [...prev, logLines[i]]);
          i++;
      } else {
          clearInterval(interval);
          const newFriends = Object.fromEntries(students.map(s => [s.name, []]));
          const newChats   = Object.fromEntries(students.map(s => [s.name, []]));
          newFriends[s1.name].push(s2.name);
          newFriends[s2.name].push(s1.name);
          const msg1 = { from: s1.name, to: s2.name, text: "Hello there!" };
          const msg2 = { from: s2.name, to: s1.name, text: "Hi back!" };
          newChats[s1.name].push(msg1, msg2);
          newChats[s2.name].push(msg1, msg2);
          setFriendLists(newFriends);
          setChatHistories(newChats);
          setHasRun(true);
          setRunning(false);
      }
    }, 250);
  };

  return (
    <div>
      <h3>Friends & Chat</h3>
      <p style={{ marginBottom: 16, fontSize: 13 }}>
        Simulates concurrent{" "}
        <span style={{ color: "#FFCD00", fontFamily: "monospace" }}>FriendRequestThread</span>
        {" "}and{" "}
        <span style={{ color: "#FFCD00", fontFamily: "monospace" }}>ChatThread</span>
        {" "}execution via an{" "}
        <span style={{ color: "#FFCD00", fontFamily: "monospace" }}>ExecutorService</span>.
      </p>

      <button onClick={runSimulation} disabled={running || students.length < 2}>
        {running ? "Running…" : "▶ Run Thread Simulation"}
      </button>

      {students.length < 2 && (
        <p style={{ color: "#ef9a9a", marginTop: 8, fontSize: 13 }}>
          Need at least 2 students to run.
        </p>
      )}

      {threadLog.length > 0 && (
        <div style={{
          marginTop: 18,
          background: "#070f18",
          border: "1px solid #1a3a5a",
          borderRadius: 6,
          padding: "12px 16px",
        }}>
          <h4 style={{ marginBottom: 8 }}>Thread Execution Log</h4>
          {threadLog.map((line, i) => (
            <div key={i} style={{ fontFamily: "monospace", fontSize: 12, color: "#a5d6a7", marginBottom: 2 }}>
              {line}
            </div>
          ))}
        </div>
      )}

      {hasRun && (
        <div style={{ marginTop: 20 }}>
          <h4 style={{ marginBottom: 12 }}>Student Profiles After Simulation</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {students.map(s => {
              const friends = friendLists[s.name] || [];
              const chats   = chatHistories[s.name]  || [];
              return (
                <div key={s.name} style={{
                  background: "#0d2a4a",
                  border: "1px solid #2a5a8a",
                  borderRadius: 8,
                  padding: "14px 18px",
                  minWidth: 220,
                  flex: "1 1 220px",
                  maxWidth: 320,
                }}>
                  <div style={{ fontWeight: "bold", fontSize: 15, color: "#e0e0e0", marginBottom: 2 }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#546e7a", marginBottom: 10 }}>
                    {s.major} · Year {s.year}
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: "#90a4ae" }}>👥 Friends: </span>
                    <span style={{ fontSize: 12, color: friends.length > 0 ? "#e0e0e0" : "#546e7a" }}>
                      {friends.length > 0 ? friends.join(", ") : "None"}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#90a4ae", marginBottom: 4 }}>💬 Chat History:</div>
                    {chats.length === 0 ? (
                      <span style={{ fontSize: 12, color: "#546e7a" }}>None</span>
                    ) : (
                      <div style={{
                        background: "#070f18",
                        borderRadius: 4,
                        padding: "8px 10px",
                        maxHeight: 120,
                        overflowY: "auto",
                      }}>
                        {chats.map((m, i) => (
                          <div key={i} style={{ fontSize: 12, marginBottom: 4 }}>
                            <span style={{ color: "#90caf9", fontWeight: "bold" }}>{m.from}</span>
                            <span style={{ color: "#546e7a", marginLeft: 4 }}>→ {m.to}:</span>
                            <span style={{ color: "#cfd8dc", marginLeft: 4 }}>{m.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
