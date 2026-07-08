import express from "express";
import { getUser } from "../controllers/user.controller.js";
import { updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";
import { deleteUser } from "../controllers/user.controller.js";
import { getUserListings } from "../controllers/user.controller.js";

const router = express.Router();

router.get('/', getUser);
router.post('/update/:id', verifyToken ,updateUser);
router.delete('/delete/:id', verifyToken ,deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/:id',verifyToken,getUser );

export default router;