const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// Get all boards for a user
router.get('/', auth, async (req, res) => {
    try {
        const boards = await prisma.board.findMany({
            where: { userId: req.user.userId },
        });
        res.json(boards);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get a single board with its columns and tasks
router.get('/:id', auth, async (req, res) => {
    try {
        const boardId = parseInt(req.params.id);
        const board = await prisma.board.findFirst({
            where: {
                id: boardId,
                userId: req.user.userId,
            },
            include: {
                columns: {
                    orderBy: { id: 'asc' }, // Or a custom order field
                    include: {
                        tasks: {
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });

        if (!board) {
            return res.status(404).json({ msg: 'Board not found or access denied' });
        }
        res.json(board);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;