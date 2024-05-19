import express from 'express';
import userCtrl from '../controllers/userCtrl.js';

const router = express.Router();

router.post('/register',userCtrl.createUser);
router.post('/login',userCtrl.loginUser);
router.get('/allusers',userCtrl.getAllUsers);
router.get('/:id',userCtrl.getUser);
router.delete('/:id',userCtrl.deleteUser);





export default router;