import { useState } from "react";
import Header from "./components/Header";
import StudentTable from "./components/StudentTable";
import AddStudentForm from "./components/AddStudentForm";
import StudentRow from './components/StudentRow';
import "./App.css";

const initialStudents = [
  { id: 1, name: "Aarav Sharma", score: 78 },
  { id: 2, name: "Priya Mehta", score: 35 },
  { id: 3, name: "Rohit Verma", score: 55 },
  { id: 4, name: "Sneha Gupta", score: 22 },
  { id: 5, name: "Karan Singh", score: 91 },
];

function App() {
  const [students, setStudents] = useState(initialStudents);
  const addStudent = (name, score) => {
    const newStudent = {
      id: Date.now(), 
      name: name,
      score: Number(score),
    };
    setStudents([...students, newStudent]); 
  };

  const updateScore = (id, newScore) => {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, score: Number(newScore) } : student
      )
    );
  };

  return (
    <div className="app-container">
      <Header />

      <AddStudentForm onAdd={addStudent} />
      <StudentTable students={students} onUpdateScore={updateScore} />
    </div>
  );
}

export default App;
