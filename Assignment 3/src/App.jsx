import { useState } from "react";
import Header from "./components/Header";
import StudentTable from "./components/StudentTable";
import AddStudentForm from "./components/AddStudentForm";
import StudentRow from './components/StudentRow';
import "./App.css";

// Initial dummy students to show on first load
const initialStudents = [
  { id: 1, name: "Aarav Sharma", score: 78 },
  { id: 2, name: "Priya Mehta", score: 35 },
  { id: 3, name: "Rohit Verma", score: 55 },
  { id: 4, name: "Sneha Gupta", score: 22 },
  { id: 5, name: "Karan Singh", score: 91 },
];

function App() {
  // useState stores all students — when this changes, React re-renders the UI
  const [students, setStudents] = useState(initialStudents);

  // Called from AddStudentForm when user submits a new student
  const addStudent = (name, score) => {
    const newStudent = {
      id: Date.now(), // unique id using timestamp
      name: name,
      score: Number(score),
    };
    setStudents([...students, newStudent]); // add to existing list
  };

  // Called from StudentRow when user updates a score
  const updateScore = (id, newScore) => {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, score: Number(newScore) } : student
      )
    );
  };

  return (
    <div className="app-container">
      {/* Header component — just shows the title */}
      <Header />

      {/* Form to add new students */}
      <AddStudentForm onAdd={addStudent} />

      {/* Table showing all students */}
      <StudentTable students={students} onUpdateScore={updateScore} />
    </div>
  );
}

export default App;
