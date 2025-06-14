import express from 'express';
import { getUsers, updateUser, deleteUser } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.get('/', auth(['Admin']), getUsers);
router.put('/:id', auth(['Admin']), updateUser)
router.delete('/:id', auth(['Admin']), deleteUser)

export default router;