import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Task = ({ task, index, onDelete }) => {
    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-3 rounded-md shadow-sm mb-3 relative group"
                >
                    <p>{task.title}</p>
                    <button
                        onClick={onDelete}
                        className="absolute top-1 right-1 bg-gray-300 text-gray-600 rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
                        aria-label="Delete task"
                    >
                        ✕
                    </button>
                </div>
            )}
        </Draggable>
    );
};

export default Task;