import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 py-3">
          <div className="container">
            <Link className="navbar-brand d-flex align-items-center fw-bold fs-4" to="/">
               Student<span className="text-primary ms-1">Portal</span>
            </Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<StudentList />} />
          <Route path="/add" element={<StudentForm />} />
          <Route path="/edit/:id" element={<StudentForm />} />
        </Routes>
        <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      </div>
    </Router>
  );
}

export default App;
