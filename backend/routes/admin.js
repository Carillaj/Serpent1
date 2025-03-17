const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all users (Admins only)
router.get('/users', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const users = await User.find({}, 'username role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching users." });
    }
});

// Promote a user to admin (Admins only)
router.put('/promote/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        if (req.user.id === req.params.id) {
            return res.status(400).json({ message: "You cannot promote yourself." });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: "User is already an admin." });
        }

        await User.findByIdAndUpdate(req.params.id, { role: 'admin' });
        res.json({ message: `User ${user.username} has been promoted to admin.` });
    } catch (error) {
        res.status(500).json({ message: "Server error while promoting user." });
    }
});

module.exports = router;
