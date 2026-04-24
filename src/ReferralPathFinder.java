import java.util.*;

public class ReferralPathFinder {
    private StudentGraph graph;

    public ReferralPathFinder(StudentGraph graph) {
        this.graph = graph;
    }

    public List<UniversityStudent> findReferralPath(UniversityStudent start, String targetCompany) {
        Map<UniversityStudent, Integer> dist = new HashMap<>();
        Map<UniversityStudent, UniversityStudent> prev = new HashMap<>();
        List<UniversityStudent> allNodes = graph.getAllNodes();
        Map<Integer, UniversityStudent> indexMap = new HashMap<>();
        Map<UniversityStudent, Integer> studentIndex = new HashMap<>();
        for (int i = 0; i < allNodes.size(); i++) {
            indexMap.put(i, allNodes.get(i));
            studentIndex.put(allNodes.get(i), i);
            dist.put(allNodes.get(i), Integer.MAX_VALUE);
        }
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        dist.put(start, 0);
        pq.offer(new int[]{0, studentIndex.get(start)});
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int cost = top[0];
            UniversityStudent u = indexMap.get(top[1]);
            if (cost > dist.get(u)) {
                continue;
            }
            if (!u.equals(start) && u.previousInternships.contains(targetCompany)) {
                return reconstructPath(prev, start, u);
            }
            for (StudentGraph.Edge edge : graph.getNeighbors(u)) {
                UniversityStudent v = edge.neighbor;
                int invertedWeight = Math.max(1, 10 - edge.weight);
                int newDist = dist.get(u) + invertedWeight;
                if (newDist < dist.get(v)) {
                    dist.put(v, newDist);
                    prev.put(v, u);
                    pq.offer(new int[]{newDist, studentIndex.get(v)});
                }
            }
        }
        return new ArrayList<>();
    }

    private List<UniversityStudent> reconstructPath(Map<UniversityStudent, UniversityStudent> prev, UniversityStudent start, UniversityStudent target) {
        LinkedList<UniversityStudent> path = new LinkedList<>();
        UniversityStudent current = target;
        while (current != null) {
            path.addFirst(current);
            if (current.equals(start)) {
                break;
            }
            current = prev.get(current);
        }
        return path;
    }
}
