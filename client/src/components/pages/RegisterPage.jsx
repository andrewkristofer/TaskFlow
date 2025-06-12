import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import setAuthToken from '../../utils/setAuthToken';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '', password2: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { email, password, password2 } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) {
            setError('Passwords do not match');
            return;
        }
        try {
            const res = await axios.post('/api/auth/register', { email, password });
            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);
            navigate('/board');
        } catch (err) {
            setError(err.response.data.msg || 'Something went wrong');
        }
    };

    return (
        <div className="container mx-auto max-w-sm mt-10">
            <h1 className="text-3xl text-center font-bold mb-6">Sign Up</h1>
            {error && <p className="bg-red-200 text-red-800 p-3 mb-4 rounded">{error}</p>}
            <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input type="email" name="email" value={email} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded mt-1"/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input type="password" name="password" value={password} onChange={onChange} required minLength="6" className="w-full p-2 border border-gray-300 rounded mt-1"/>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700">Confirm Password</label>
                    <input type="password" name="password2" value={password2} onChange={onChange} required minLength="6" className="w-full p-2 border border-gray-300 rounded mt-1"/>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;