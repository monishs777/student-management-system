import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
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

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit) {
            api.get(`students/${id}/`)
                .then(res => setStudent(res.data))
                .catch(err => {
                    console.error(err);
                    toast.error('Failed to load student data.');
                });
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
        // Clear specific field error when user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const request = isEdit
            ? api.put(`students/${id}/`, student)
            : api.post('students/', student);

        request
            .then(() => {
                toast.success(isEdit ? 'Student updated successfully!' : 'Student added successfully!');
                navigate('/');
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    setErrors(err.response.data);
                    toast.error('Please fix the errors in the form.');
                } else {
                    toast.error('An unexpected error occurred.');
                }
            });
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="card shadow-sm max-w-md mx-auto" style={{ maxWidth: '600px' }}>
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">{isEdit ? 'Edit Student' : 'Add Student'}</h3>
                </div>
                <div className="card-body">
                    {errors.non_field_errors && (
                        <div className="alert alert-danger">{errors.non_field_errors}</div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">First Name</label>
                            <input 
                                type="text" 
                                name="first_name" 
                                className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} 
                                value={student.first_name} 
                                onChange={handleChange} 
                                required 
                                maxLength="100"
                            />
                            {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input 
                                type="text" 
                                name="last_name" 
                                className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                value={student.last_name} 
                                onChange={handleChange} 
                                required 
                                maxLength="100"
                            />
                            {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                value={student.email} 
                                onChange={handleChange} 
                                required 
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Course</label>
                            <input 
                                type="text" 
                                name="course" 
                                className={`form-control ${errors.course ? 'is-invalid' : ''}`}
                                value={student.course} 
                                onChange={handleChange} 
                                required 
                                maxLength="100"
                            />
                            {errors.course && <div className="invalid-feedback">{errors.course}</div>}
                        </div>
                        <div className="d-flex justify-content-end mt-4">
                            <Link to="/" className="btn btn-outline-secondary me-2">Cancel</Link>
                            <button type="submit" className="btn btn-primary">{isEdit ? 'Update Student' : 'Save Student'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentForm;
