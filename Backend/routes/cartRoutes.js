import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// יבוא הבקרים של עגלת הקניות
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';

// כל הנתיבים של עגלת הקניות דורשים הרשאת משתמש
router.use(protect);

// קבלת עגלת הקניות של המשתמש
router.get('/', getCart);

// הוספת פריט לעגלה
router.post('/items', addItemToCart);

// עדכון כמות של פריט בעגלה
router.patch('/items/:itemId', updateCartItem);

// הסרת פריט מהעגלה
router.delete('/items/:itemId', removeCartItem);

// ריקון העגלה
router.delete('/', clearCart);

export default router;
