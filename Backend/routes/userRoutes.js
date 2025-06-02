import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  toggleFavorites,
  getFavoritesAnalytics,
  getUsersFavoritesStats
} from '../controllers/userController.js';

const router = express.Router();

// נתיבים ציבוריים
router.post('/login', authUser);
router.post('/register', registerUser);

// נתיבים מוגנים למשתמש
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/favorites', protect, getFavorites);
router.post('/favorites/:id', protect, toggleFavorites);
router.delete('/favorites/:id', protect, removeFromFavorites);

// נתיבים למנהל - Analytics
router.get('/admin/favorites-analytics', protect, admin, getFavoritesAnalytics);
router.get('/admin/users-favorites', protect, admin, getUsersFavoritesStats);

// נתיבים למנהל
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

export default router;