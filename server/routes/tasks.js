const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// Create a new task
router.post('/', auth, async (req, res) => {
    const { title, description, columnId } = req.body;
    if (!title || !columnId) {
        return res.status(400).json({ msg: 'Please provide a title and columnId' });
    }
    try {
        const column = await prisma.column.findFirst({
            where: { id: columnId, board: { userId: req.user.userId } },
        });
        if (!column) return res.status(404).json({ msg: 'Column not found or access denied' });

        const maxOrder = await prisma.task.aggregate({
            _max: { order: true },
            where: { columnId },
        });

        const newOrder = (maxOrder._max.order ?? -1) + 1;
        
        const newTask = await prisma.task.create({
            data: { title, description: description || '', columnId, order: newOrder },
        });
        res.json(newTask);
    } catch (err) { res.status(500).send('Server Error'); }
});

// Update a task (title, description)
router.put('/:id', auth, async (req, res) => {
    const { title, description } = req.body;
    const taskId = parseInt(req.params.id);
    try {
        const task = await prisma.task.findFirst({
            where: { id: taskId, column: { board: { userId: req.user.userId } } },
        });
        if (!task) return res.status(404).json({ msg: 'Task not found or access denied' });

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                title: title !== undefined ? title : task.title,
                description: description !== undefined ? description : task.description,
            },
        });
        res.json(updatedTask);
    } catch (err) { res.status(500).send('Server Error'); }
});

// Move a task
router.put('/:id/move', auth, async (req, res) => {
    const { newColumnId, newOrder } = req.body;
    const taskId = parseInt(req.params.id);

    try {
        await prisma.$transaction(async (tx) => {
            const task = await tx.task.findFirst({
                where: { id: taskId, column: { board: { userId: req.user.userId } } },
            });
            if (!task) throw new Error('Task not found or access denied');
            
            const oldColumnId = task.columnId;

            // Decrement order for tasks in the old column
            await tx.task.updateMany({
                where: { columnId: oldColumnId, order: { gt: task.order } },
                data: { order: { decrement: 1 } },
            });
            
            // Increment order for tasks in the new column
            await tx.task.updateMany({
                where: { columnId: newColumnId, order: { gte: newOrder } },
                data: { order: { increment: 1 } },
            });

            // Finally, update the moved task
            const movedTask = await tx.task.update({
                where: { id: taskId },
                data: { columnId: newColumnId, order: newOrder },
            });
            res.json(movedTask);
        });
    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
             res.status(500).send(err.message || 'Server Error');
        }
    }
});


// Delete a task
router.delete('/:id', auth, async (req, res) => {
    const taskId = parseInt(req.params.id);
    try {
        const task = await prisma.task.findFirst({
            where: { id: taskId, column: { board: { userId: req.user.userId } } },
        });
        if (!task) return res.status(404).json({ msg: 'Task not found or access denied' });

        await prisma.task.delete({ where: { id: taskId } });
        res.json({ msg: 'Task removed' });
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;