import StudentCard from './StudentCard'
import './App.css'

function App() {
  const students = [
    {
      id: 1,
      name: 'Maahi',
      rollNumber: '101',
      marks: {
        math: 92,
        english: 85,
        science: 88
      }
    },
    {
      id: 2,
      name: 'Virat',
      rollNumber: '102',
      marks: {
        math: 95,
        english: 90,
        science: 92
      }
    },
    {
      id: 3,
      name: 'Rohith',
      rollNumber: '103',
      marks: {
        math: 78,
        english: 82,
        science: 80
      }
    },
    {
      id: 4,
      name: 'Hardik Vijay',
      rollNumber: '104',
      marks: {
        math: 88,
        english: 92,
        science: 86
      }
    },
    {
      id: 5,
      name: 'Shubman',
      rollNumber: '105',
      marks: {
        math: 85,
        english: 88,
        science: 90
      }
    }
  ]

  return (
    <div className="container">
      <h1>Student Marks Card System</h1>
      <div className="cards-grid">
        {students.map(student => (
          <StudentCard 
            key={student.id}
            name={student.name}
            rollNumber={student.rollNumber}
            marks={student.marks}
          />
        ))}
      </div>
    </div>
  )
}

export default App
