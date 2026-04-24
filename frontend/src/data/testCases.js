export const TEST_CASES = [
  {
    name: "Test Case 1",
    desc: "Two groups — 4 students with mutual preferences + 1 mutual pair",
    students: [
      {
        name: "Alice", age: 20, gender: "Female", year: 2,
        major: "Computer Science", gpa: 3.5,
        prefs: ["Bob", "Charlie", "Frank"],
        internships: ["Google"],
      },
      {
        name: "Bob", age: 21, gender: "Male", year: 3,
        major: "Computer Science", gpa: 3.7,
        prefs: ["Alice", "Charlie", "Frank"],
        internships: ["Google", "Microsoft"],
      },
      {
        name: "Charlie", age: 20, gender: "Male", year: 2,
        major: "Mathematics", gpa: 3.2,
        prefs: ["Alice", "Bob", "Frank"],
        internships: ["None"],
      },
      {
        name: "Frank", age: 23, gender: "Male", year: 3,
        major: "Chemistry", gpa: 3.1,
        prefs: ["Alice", "Bob", "Charlie"],
        internships: [],
      },
      {
        name: "Dana", age: 22, gender: "Female", year: 4,
        major: "Biology", gpa: 3.8,
        prefs: ["Evan"],
        internships: ["Pfizer"],
      },
      {
        name: "Evan", age: 22, gender: "Male", year: 4,
        major: "Biology", gpa: 3.6,
        prefs: ["Dana"],
        internships: ["Moderna", "Pfizer"],
      },
    ],
  },
  {
    name: "Test Case 2",
    desc: "3 Economics students — one has DummyCompany internship",
    students: [
      {
        name: "Greg", age: 24, gender: "Male", year: 4,
        major: "Economics", gpa: 3.4,
        prefs: ["Helen", "Ivy"],
        internships: ["InternshipA"],
      },
      {
        name: "Helen", age: 24, gender: "Female", year: 4,
        major: "Economics", gpa: 3.5,
        prefs: ["Greg", "Ivy"],
        internships: ["InternshipB"],
      },
      {
        name: "Ivy", age: 25, gender: "Female", year: 4,
        major: "Economics", gpa: 3.8,
        prefs: ["Helen", "Greg"],
        internships: ["DummyCompany"],
      },
    ],
  },
  {
    name: "Test Case 3",
    desc: "Jack & Kim pair up; Leo has no preferences and stays unpaired",
    students: [
      {
        name: "Jack", age: 19, gender: "Male", year: 1,
        major: "History", gpa: 3.0,
        prefs: ["Kim"],
        internships: ["MuseumIntern"],
      },
      {
        name: "Kim", age: 19, gender: "Female", year: 1,
        major: "History", gpa: 3.2,
        prefs: ["Jack"],
        internships: ["MuseumIntern"],
      },
      {
        name: "Leo", age: 20, gender: "Male", year: 1,
        major: "History", gpa: 3.5,
        prefs: [],
        internships: ["None"],
      },
    ],
  },
];
