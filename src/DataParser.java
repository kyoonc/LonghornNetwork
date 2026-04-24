import java.io.*;
import java.util.*;

public class DataParser {
    public static List<UniversityStudent> parseStudents(String filename) throws IOException {
        List<UniversityStudent> students = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(filename))) {
            String line;
            String name = null;
            int age = -1;
            String gender = null;
            int year = -1;
            String major = null;
            double gpa = -1;
            List<String> roommatePrefs = new ArrayList<>();
            List<String> internships = new ArrayList<>();
            boolean inStudentBlock = false;
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) {
                    if (inStudentBlock && name != null) {
                        students.add(new UniversityStudent(name, age, gender, year, major, gpa, roommatePrefs, internships));
                        name = null; age = -1; gender = null; year = -1;
                        major = null; gpa = -1;
                        roommatePrefs = new ArrayList<>();
                        internships = new ArrayList<>();
                        inStudentBlock = false;
                    }
                    continue;
                }
                if (line.equalsIgnoreCase("Student:")) {
                    inStudentBlock = true;
                    continue;
                }
                if (!line.contains(":")) {
                    continue;
                }
                int colonIdx = line.indexOf(':');
                String key   = line.substring(0, colonIdx).trim();
                String value = line.substring(colonIdx + 1).trim();
                switch (key) {
                    case "Name":
                        name = value;
                        break;
                    case "Age":
                        try {
                            age = Integer.parseInt(value);
                        } catch (NumberFormatException e) {
                            age = -1;
                        }
                        break;
                    case "Gender":
                        gender = value;
                        break;
                    case "Year":
                        try {
                            year = Integer.parseInt(value);
                        } catch (NumberFormatException e) {
                            year = -1;
                        }
                        break;
                    case "Major":
                        major = value;
                        break;
                    case "GPA":
                        try {
                            gpa = Double.parseDouble(value);
                        } catch (NumberFormatException e) {
                            gpa = -1;
                        }
                        break;
                    case "RoommatePreferences":
                        roommatePrefs = parseList(value);
                        break;
                    case "PreviousInternships":
                        internships = parseList(value);
                        break;
                }
            }
            if (inStudentBlock && name != null) {
                students.add(new UniversityStudent(name, age, gender, year, major, gpa, roommatePrefs, internships));
            }
        }
        return students;
    }

    private static List<String> parseList(String value) {
        List<String> result = new ArrayList<>();
        if (value == null || value.trim().isEmpty()) {
            return result;
        }
        for (String item : value.split(",")) {
            String trimmed = item.trim();
            if (!trimmed.isEmpty()) {
                result.add(trimmed);
            }
        }
        return result;
    }
}
