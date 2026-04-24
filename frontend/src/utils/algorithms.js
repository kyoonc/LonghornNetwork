export function calcConnectionStrength(a, b, roommateMap = {}) {
  let strength = 0;
  if (roommateMap[a.name] === b.name) strength += 4;
  const aInterns = (a.internships || []).filter(i => i !== "None");
  const bInterns = (b.internships || []).filter(i => i !== "None");
  for (const internship of aInterns) {
    if (bInterns.includes(internship)) strength += 3;
  }
  if (a.major && a.major === b.major) strength += 2;
  if (a.age === b.age) strength += 1;
  return strength;
}

export function buildGraph(students, roommateMap = {}) {
  const edges = [];
  for (let i = 0; i < students.length; i++) {
    for (let j = i + 1; j < students.length; j++) {
      const w = calcConnectionStrength(students[i], students[j], roommateMap);
      if (w > 0) {
        edges.push({ from: students[i].name, to: students[j].name, weight: w });
      }
    }
  }
  return edges;
}

export function galeShapley(students) {
  const byName = Object.fromEntries(students.map(s => [s.name, s]));
  const roommates = {};
  const proposalIdx = {};
  students.forEach(s => { proposalIdx[s.name] = 0; });
  const queue = students
    .filter(s => s.prefs && s.prefs.length > 0)
    .map(s => s.name);
  while (queue.length > 0) {
    const proposerName = queue.shift();
    if (roommates[proposerName]) continue;
    const proposer = byName[proposerName];
    const idx = proposalIdx[proposerName];
    if (!proposer || idx >= proposer.prefs.length) continue;
    const targetName = proposer.prefs[idx];
    proposalIdx[proposerName]++;
    const target = byName[targetName];
    if (!target) {
      queue.push(proposerName);
      continue;
    }
    if (!roommates[targetName]) {
      roommates[proposerName] = targetName;
      roommates[targetName] = proposerName;
    } else {
      const current = roommates[targetName];
      const candIdx = target.prefs.indexOf(proposerName);
      const currIdx = target.prefs.indexOf(current);

      const targetPrefersProposer =
        candIdx !== -1 && (currIdx === -1 || candIdx < currIdx);
      if (targetPrefersProposer) {
        delete roommates[current];
        roommates[proposerName] = targetName;
        roommates[targetName]   = proposerName;
        if (byName[current]?.prefs?.length > 0) {
          queue.push(current);
        }
      } else {
        if (proposalIdx[proposerName] < proposer.prefs.length) {
          queue.push(proposerName);
        }
      }
    }
  }
  return roommates;
}

export function findReferralPath(students, edges, startName, targetCompany) {
  const adj = Object.fromEntries(students.map(s => [s.name, []]));
  for (const e of edges) {
    adj[e.from]?.push({ name: e.to,   weight: e.weight });
    adj[e.to]?.push({   name: e.from, weight: e.weight });
  }
  const dist = Object.fromEntries(students.map(s => [s.name, Infinity]));
  const prev = {};
  dist[startName] = 0;
  const pq = [{ name: startName, cost: 0 }];
  const visited = new Set();
  while (pq.length > 0) {
    pq.sort((a, b) => a.cost - b.cost);
    const { name: u } = pq.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    if (u !== startName) {
      const student = students.find(s => s.name === u);
      if (student?.internships?.includes(targetCompany)) {
        return reconstructPath(prev, startName, u);
      }
    }
    for (const neighbor of (adj[u] || [])) {
      const invertedCost = Math.max(1, 10 - neighbor.weight);
      const newDist = dist[u] + invertedCost;
      if (newDist < dist[neighbor.name]) {
        dist[neighbor.name] = newDist;
        prev[neighbor.name] = u;
        pq.push({ name: neighbor.name, cost: newDist });
      }
    }
  }
  return [];
}

function reconstructPath(prev, start, target) {
  const path = [];
  let cur = target;
  while (cur !== undefined) {
    path.unshift(cur);
    if (cur === start) break;
    cur = prev[cur];
  }
  return path;
}
