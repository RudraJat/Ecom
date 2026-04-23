import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  toggleWishlist,
  addCard,
  removeCard,
  setDefaultCard,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/addresses').post(protect, addAddress);
router.route('/addresses/:addressId').put(protect, updateAddress).delete(protect, deleteAddress);
router.route('/wishlist/:productId').put(protect, toggleWishlist);
router.route('/cards').post(protect, addCard);
router.route('/cards/:cardId').delete(protect, removeCard);
router.route('/cards/:cardId/default').put(protect, setDefaultCard);

export default router;
