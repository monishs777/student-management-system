import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api';

const StudentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [student, setStudent] = useState({
        first_name: '',
        last_name: '',
        email: '',
        course: ''
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            api.get(`students/${id}/`)
                .then(res => setStudent(res.data))
                .catch(err => console.error(err));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const request = isEdit
            ? api.put(`students/${id}/`, student)
            : api.post('students/', student);

        request
            .then(() => navigate('/'))
            .catch(err => {
                if (err.response && err.response.data) {
                    setError(JSON.stringify(err.response.data));
                } else {
                    setError('An error occurred.');
                }
            });
    };

    return (
        <div className="container mt-4">
            <h2>{isEdit ? 'Edit Student' : 'Add Student'}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input type="text" name="first_name" className="form-control" value={student.first_name} onChange={handleChange} required maxLength="100"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" name="last_name" className="form-control" value={student.last_name} onChange={handleChange} required maxLength="100"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" value={student.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Course</label>
                    <input type="text" name="course" className="form-control" value={student.course} onChange={handleChange} required maxLength="100"/>
                </div>
                <button type="submit" className="btn btn-success me-2">{isEdit ? 'Update' : 'Save'}</button>
                <Link to="/" className="btn btn-secondary">Cancel</Link>
            </form>
        </div>
    );
};

export default StudentForm;
