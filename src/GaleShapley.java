import java.util.*;

public class GaleShapley {
    public static void assignRoommates(List<UniversityStudent> students) {
        Map<String, UniversityStudent> nameMap = new HashMap<>();
        for (UniversityStudent s : students) {
            nameMap.put(s.name, s);
            s.setRoommate(null);
        }
        Map<UniversityStudent, Integer> nextProposal = new HashMap<>();
        for (UniversityStudent s : students) {
            nextProposal.put(s, 0);
        }
        Queue<UniversityStudent> freeStudents = new LinkedList<>();
        for (UniversityStudent s : students) {
            if (!s.roommatePreferences.isEmpty()) {
                freeStudents.add(s);
            }
        }
        while (!freeStudents.isEmpty()) {
            UniversityStudent proposer = freeStudents.poll();
            if (proposer.getRoommate() != null) {
                continue;
            }
            int idx = nextProposal.get(proposer);
            if (idx >= proposer.roommatePreferences.size()) {
                continue;
            }
            String targetName = proposer.roommatePreferences.get(idx);
            nextProposal.put(proposer, idx + 1);
            UniversityStudent target = nameMap.get(targetName);
            if (target == null) {
                freeStudents.add(proposer);
                continue;
            }
            if (target.getRoommate() == null) {
                proposer.setRoommate(target);
                target.setRoommate(proposer);
                System.out.println("Roommate match: " + proposer.name + " <-> " + target.name);
            } else {
                UniversityStudent currentRoommate = target.getRoommate();
                if (prefers(target, proposer, currentRoommate)) {
                    currentRoommate.setRoommate(null);
                    proposer.setRoommate(target);
                    target.setRoommate(proposer);
                    System.out.println("Roommate match (replaced): " + proposer.name + " <-> " + target.name
                            + " (replaced " + currentRoommate.name + ")");
                    if (!currentRoommate.roommatePreferences.isEmpty()) {
                        freeStudents.add(currentRoommate);
                    }
                } else {
                    if (nextProposal.get(proposer) < proposer.roommatePreferences.size()) {
                        freeStudents.add(proposer);
                    }
                }
            }
        }
        for (UniversityStudent s : students) {
            if (s.getRoommate() == null) {
                System.out.println(s.name + " has no roommate.");
            }
        }
    }

    private static boolean prefers(UniversityStudent student, UniversityStudent candidate, UniversityStudent current) {
        List<String> prefs = student.roommatePreferences;
        int candidateIdx = prefs.indexOf(candidate.name);
        int currentIdx   = prefs.indexOf(current.name);
        if (candidateIdx == -1) {
            return false;
        }
        if (currentIdx == -1) {
            return true;
        }
        return candidateIdx < currentIdx;
    }
}
