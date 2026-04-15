import { Router } from "express";
import * as controller from '../booking/booking.controller.js'
import { authenticate } from '../auth/auth.middleware.js';

const router = Router();
router.post('/:id', authenticate, controller.bookings);
router.get('/seats', authenticate, controller.seats);
export default router;