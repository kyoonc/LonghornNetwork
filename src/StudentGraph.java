import java.util.*;

public class StudentGraph {
    public static class Edge {
        public UniversityStudent neighbor;
        public int weight;

        public Edge(UniversityStudent neighbor, int weight) {
            this.neighbor = neighbor;
            this.weight = weight;
        }
    }

    private Map<UniversityStudent, List<Edge>> adjacencyList;

    public StudentGraph(List<UniversityStudent> students) {
        adjacencyList = new LinkedHashMap<>();
        for (UniversityStudent student : students) {
            adjacencyList.put(student, new ArrayList<>());
        }
        for (int i = 0; i < students.size(); i++) {
            for (int j = i + 1; j < students.size(); j++) {
                UniversityStudent a = students.get(i);
                UniversityStudent b = students.get(j);
                int weight = a.calculateConnectionStrength(b);
                if (weight > 0) {
                    adjacencyList.get(a).add(new Edge(b, weight));
                    adjacencyList.get(b).add(new Edge(a, weight));
                }
            }
        }
    }

    public void addEdge(UniversityStudent a, UniversityStudent b, int weight) {
        adjacencyList.computeIfAbsent(a, k -> new ArrayList<>()).add(new Edge(b, weight));
        adjacencyList.computeIfAbsent(b, k -> new ArrayList<>()).add(new Edge(a, weight));
    }

    public List<Edge> getNeighbors(UniversityStudent student) {
        return adjacencyList.getOrDefault(student, new ArrayList<>());
    }

    public List<UniversityStudent> getAllNodes() {
        return new ArrayList<>(adjacencyList.keySet());
    }

    public void displayGraph() {
        System.out.println("\n--- Student Graph (Adjacency List) ---");
        for (Map.Entry<UniversityStudent, List<Edge>> entry : adjacencyList.entrySet()) {
            StringBuilder sb = new StringBuilder();
            sb.append(entry.getKey().name).append(" -> [");
            List<Edge> edges = entry.getValue();
            for (int i = 0; i < edges.size(); i++) {
                sb.append("(").append(edges.get(i).neighbor.name)
                        .append(", ").append(edges.get(i).weight).append(")");
                if (i < edges.size() - 1) {
                    sb.append(", ");
                }
            }
            sb.append("]");
            System.out.println(sb.toString());
        }
    }
}
