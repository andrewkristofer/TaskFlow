import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import axios from 'axios';
import Column from './Column';

const Board = ({ boardId }) => {
    const [boardData, setBoardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBoardData = useCallback(async () => {
        try {
            const res = await axios.get(`/api/boards/${boardId}`);
            setBoardData(res.data);
        } catch (err) {
            setError('Failed to fetch board data.');
        } finally {
            setLoading(false);
        }
    }, [boardId]);

    useEffect(() => {
        fetchBoardData();
    }, [fetchBoardData]);

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;

        const taskId = parseInt(draggableId);
        const newColumnId = parseInt(destination.droppableId);
        const oldColumnId = parseInt(source.droppableId);
        const newOrder = destination.index;

        if (oldColumnId === newColumnId && source.index === newOrder) return;
        
        // Optimistic UI Update
        const updatedBoardData = { ...boardData };
        const sourceCol = updatedBoardData.columns.find(c => c.id === oldColumnId);
        const [movedTask] = sourceCol.tasks.splice(source.index, 1);
        
        const destCol = updatedBoardData.columns.find(c => c.id === newColumnId);
        destCol.tasks.splice(newOrder, 0, movedTask);

        setBoardData(updatedBoardData);

        try {
            await axios.put(`/api/tasks/${taskId}/move`, { newColumnId, newOrder });
        } catch (err) {
            setError('Failed to move task. Refreshing board...');
            fetchBoardData(); // Revert on failure
        }
    };

    const handleAddTask = async (columnId, title) => {
        try {
            const res = await axios.post('/api/tasks', { columnId, title });
            fetchBoardData(); // Re-fetch to get the new task with correct order
        } catch (err) {
            setError('Failed to add task.');
        }
    };
    
    const handleDeleteTask = async (taskId) => {
        try {
            // Optimistic deletion
            const updatedBoard = {
                ...boardData,
                columns: boardData.columns.map(col => ({
                    ...col,
                    tasks: col.tasks.filter(t => t.id !== taskId)
                }))
            };
            setBoardData(updatedBoard);
            await axios.delete(`/api/tasks/${taskId}`);
        } catch (err) {
            setError('Failed to delete task. Refreshing...');
            fetchBoardData();
        }
    };

    if (loading) return <div>Loading Board...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-4 p-4 h-full overflow-x-auto">
                {boardData?.columns.map(column => (
                    <Column
                        key={column.id}
                        column={column}
                        onAddTask={handleAddTask}
                        onDeleteTask={handleDeleteTask}
                    />
                ))}
            </div>
        </DragDropContext>
    );
};

export default Board;