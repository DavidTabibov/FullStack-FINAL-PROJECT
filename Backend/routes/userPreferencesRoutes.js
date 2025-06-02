import express from 'express';
import { auth } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.patch('/view-mode', auth, async (req, res) => {
    try {
        const { viewMode } = req.body; // 'table' או 'cards'
        const user = req.user;

        user.preferences = {
            ...user.preferences,
            viewMode
        };
        await user.save();

        res.json({
            status: 'success',
            data: { viewMode }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'שגיאה בעדכון העדפות תצוגה'
        });
    }
});

export default router;