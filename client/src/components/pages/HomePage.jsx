import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="container mx-auto text-center py-20">
            <h1 className="text-5xl font-bold mb-4">Welcome to TaskFlow</h1>
            <p className="text-xl text-gray-600 mb-8">The simple, visual way to manage your projects and organize anything.</p>
            <Link to="/register" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition duration-300">
                Get Started
            </Link>
        </div>
    );
};

export default HomePage;