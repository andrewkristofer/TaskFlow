import React, { useState } from 'react';

const AddTaskForm = ({ columnId, onAddTask }) => {
    const [title, setTitle] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAddTask(columnId, title);
        setTitle('');
        setIsAdding(false);
    };

    if (!isAdding) {
        return (
            <button
                onClick={() => setIsAdding(true)}
                className="w-full text-left p-2 mt-2 text-gray-500 hover:bg-gray-300 rounded-md"
            >
                + Add a card
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-2">
            <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 rounded-md border-gray-300 shadow-sm"
                placeholder="Enter a title for this card..."
                autoFocus
                onBlur={() => !title && setIsAdding(false)}
            />
            <div className="mt-2 flex items-center">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Add card
                </button>
                <button type="button" onClick={() => setIsAdding(false)} className="ml-2 text-2xl text-gray-500 hover:text-gray-700">
                    &times;
                </button>
            </div>
        </form>
    );
};

export default AddTaskForm;