import java.util.*;

public class UniversityStudent extends Student {
    // TODO: Constructor and additional methods to be implemented
    public String name;
    public int age;
    public String gender;
    public int year;
    public String major;
    public double gpa;
    public List<String> roommatePreferences;
    public List<String> previousInternships;
    private UniversityStudent roommate;
    public List<UniversityStudent> friendList;
    public Map<String, List<String>> chatHistory;

    public UniversityStudent(String name, int age, String gender, int year, String major, double gpa, List<String> roommatePreferences, List<String> previousInternships) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.year = year;
        this.major = major;
        this.gpa = gpa;
        this.roommatePreferences = new ArrayList<>(roommatePreferences);
        this.previousInternships = new ArrayList<>(previousInternships);
        this.roommate = null;
        this.friendList = new ArrayList<>();
        this.chatHistory = new HashMap<>();
    }

    public UniversityStudent getRoommate() {
        return roommate;
    }

    public void setRoommate(UniversityStudent roommate) {
        this.roommate = roommate;
    }

    @Override
    public int calculateConnectionStrength(Student other) {
        if (!(other instanceof UniversityStudent)) {
            return 0;
        }
        UniversityStudent o = (UniversityStudent) other;
        int strength = 0;
        if (this.roommate != null && this.roommate.equals(o)) {
            strength += 4;
        }
        for (String internship : this.previousInternships) {
            if (!internship.equalsIgnoreCase("None") && o.previousInternships.contains(internship)) {
                strength += 3;
            }
        }
        if (this.major != null && this.major.equals(o.major)) {
            strength += 2;
        }
        if (this.age == o.age) {
            strength += 1;
        }
        return strength;
    }

    public synchronized void addFriend(UniversityStudent student) {
        if (!friendList.contains(student)) {
            friendList.add(student);
        }
    }

    public synchronized void addMessage(String otherName, String message) {
        chatHistory.computeIfAbsent(otherName, k -> new ArrayList<>()).add(message);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof UniversityStudent)) {
            return false;
        }
        return this.name.equals(((UniversityStudent) obj).name);
    }

    @Override
    public int hashCode() {
        return name.hashCode();
    }

    @Override
    public String toString() {
        return String.format("UniversityStudent{name='%s', age=%d, gender='%s', year=%d, major='%s', " + "gpa=%.1f, roommatePrefs=%s, internships=%s}", name, age, gender, year, major, gpa, roommatePreferences, previousInternships);
    }
}
