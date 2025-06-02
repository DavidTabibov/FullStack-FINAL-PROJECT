import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// יבוא הבקרים של ההזמנות
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  deleteOrder,
  updateOrderStatus
} from '../controllers/orderController.js';

// יצירת הזמנה חדשה
router.post('/', protect, createOrder);

// קבלת ההזמנות של המשתמש המחובר
router.get('/myorders', protect, getMyOrders);

// נתיבים למנהל
router.get('/', protect, admin, getOrders);

// קבלת הזמנה לפי מזהה
router.get('/:id', protect, getOrderById);

// עדכון הזמנה לשולמה
router.put('/:id/pay', protect, updateOrderToPaid);

// עדכון הזמנה לנשלחה
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

// עדכון סטטוס הזמנה
router.put('/:id/status', protect, admin, updateOrderStatus);

// מחיקת הזמנה
router.delete('/:id', protect, admin, deleteOrder);

export default router;
