const express = require('express');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');
const router = express.Router();

// Mark attendance (Members)
router.post('/mark', auth, async (req, res) => {
    try {
        const newAttendance = new Attendance({
            userId: req.user.id,
            username: req.user.username
        });
        await newAttendance.save();
        res.status(201).json({ message: "Attendance marked" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// View all attendance (Admins only)
router.get('/records', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Forbidden" });

    const records = await Attendance.find().populate('userId', 'username');
    res.json(records);
});

// Delete an attendance record (Admins only)
router.delete('/delete/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Forbidden" });

    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: "Attendance record deleted" });
});

module.exports = router;
