import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Board from '../kanban/Board';

const BoardPage = () => {
    const [boards, setBoards] = useState([]);
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const res = await axios.get('/api/boards');
                setBoards(res.data);
                if (res.data.length > 0) {
                    setSelectedBoardId(res.data[0].id);
                }
                setLoading(false);
            } catch (err) {
                setError('Could not fetch boards.');
                setLoading(false);
            }
        };
        fetchBoards();
    }, []);

    if (loading) return <div className="text-center p-10">Loading your boards...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (boards.length === 0) return <div className="text-center p-10">No boards found. A default board should have been created.</div>;

    return (
        <div className="h-full">
            {/* Board selection can be added here if you implement multiple boards */}
            {selectedBoardId && <Board boardId={selectedBoardId} />}
        </div>
    );
};

export default BoardPage;