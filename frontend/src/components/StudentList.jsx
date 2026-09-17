import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const StudentList = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        api.get('students/')
            .then(res => setStudents(res.data))
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            api.delete(`students/${id}/`)
                .then(() => fetchStudents())
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Student List</h2>
            <Link to="/add" className="btn btn-primary mb-3">Add Student</Link>
            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Enrollment Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.first_name}</td>
                            <td>{student.last_name}</td>
                            <td>{student.email}</td>
                            <td>{student.course}</td>
                            <td>{student.enrollment_date}</td>
                            <td>
                                <Link to={`/edit/${student.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                                <button onClick={() => handleDelete(student.id)} className="btn btn-sm btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {students.length === 0 && <p className="text-center">No students found.</p>}
        </div>
    );
};

export default StudentList;
