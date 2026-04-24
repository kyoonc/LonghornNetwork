import java.util.*;

public class PodFormation {
    private StudentGraph graph;

    public PodFormation(StudentGraph graph) {
        this.graph = graph;
    }

    public void formPods(int podSize) {
        List<UniversityStudent> allStudents = graph.getAllNodes();
        Set<UniversityStudent> visited = new HashSet<>();
        List<List<UniversityStudent>> pods = new ArrayList<>();
        for (UniversityStudent student : allStudents) {
            if (visited.contains(student)) {
                continue;
            }
            List<UniversityStudent> pod = new ArrayList<>();
            pod.add(student);
            visited.add(student);
            PriorityQueue<StudentGraph.Edge> pq = new PriorityQueue<>((a, b) -> b.weight - a.weight);
            pq.addAll(graph.getNeighbors(student));
            while (pod.size() < podSize && !pq.isEmpty()) {
                StudentGraph.Edge edge = pq.poll();
                if (!visited.contains(edge.neighbor)) {
                    pod.add(edge.neighbor);
                    visited.add(edge.neighbor);
                    pq.addAll(graph.getNeighbors(edge.neighbor));
                }
            }
            pods.add(pod);
        }
        System.out.println("\n--- Pod Formations (size=" + podSize + ") ---");
        for (int i = 0; i < pods.size(); i++) {
            StringBuilder sb = new StringBuilder("Pod " + (i + 1) + ": [");
            List<UniversityStudent> pod = pods.get(i);
            for (int j = 0; j < pod.size(); j++) {
                sb.append(pod.get(j).name);
                if (j < pod.size() - 1) {
                    sb.append(", ");
                }
            }
            sb.append("]");
            System.out.println(sb.toString());
        }
    }
}
