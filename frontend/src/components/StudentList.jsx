import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiSearch, FiUserPlus } from 'react-icons/fi';
import api from '../api';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = (query = '') => {
        setLoading(true);
        const endpoint = query ? `students/?search=${query}` : 'students/';
        api.get(endpoint)
            .then(res => {
                setStudents(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to fetch students.');
                setLoading(false);
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStudents(searchQuery);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            api.delete(`students/${id}/`)
                .then(() => {
                    toast.success('Student deleted successfully!');
                    fetchStudents(searchQuery);
                })
                .catch(err => {
                    console.error(err);
                    toast.error('Failed to delete student.');
                });
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-3 shadow-sm">
                <h2 className="mb-0 text-primary fw-bold">Students</h2>
                <Link to="/add" className="btn btn-primary d-flex align-items-center">
                    <FiUserPlus className="me-2" /> Add Student
                </Link>
            </div>
            
            <div className="card shadow-sm mb-4">
                <div className="card-body p-3">
                    <form onSubmit={handleSearch} className="d-flex">
                        <input 
                            type="text" 
                            className="form-control me-2" 
                            placeholder="Search students by name, email, or course..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-outline-primary d-flex align-items-center px-4" type="submit">
                            <FiSearch className="me-2" /> Search
                        </button>
                        {searchQuery && (
                            <button 
                                className="btn btn-outline-danger ms-2" 
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    fetchStudents('');
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Course</th>
                                <th>Enrollment Date</th>
                                <th className="text-center">Actions</th>
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
                                    <td className="text-center">
                                        <Link to={`/edit/${student.id}`} className="btn btn-sm btn-warning me-2">
                                            <FiEdit2 className="me-1" /> Edit
                                        </Link>
                                        <button onClick={() => handleDelete(student.id)} className="btn btn-sm btn-danger">
                                            <FiTrash2 className="me-1" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {students.length === 0 && (
                        <div className="alert alert-info text-center shadow-sm">
                            No students found matching your criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentList;
