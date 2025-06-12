import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import AddTaskForm from './AddTaskForm';

const Column = ({ column, onAddTask, onDeleteTask }) => {
    return (
        <div className="bg-gray-200 rounded-lg p-2 w-80 flex-shrink-0 flex flex-col">
            <h2 className="font-bold text-lg p-2">{column.name}</h2>
            <Droppable droppableId={String(column.id)}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-grow min-h-[100px] p-2 rounded-md transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-blue-100' : 'bg-gray-200'}`}
                    >
                        {column.tasks.map((task, index) => (
                            <Task key={task.id} task={task} index={index} onDelete={() => onDeleteTask(task.id)} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <AddTaskForm columnId={column.id} onAddTask={onAddTask} />
        </div>
    );
};

export default Column;