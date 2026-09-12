import express from 'express';
import { getAllMatches, getMatchById, getStandSeats } from '../controllers/matchController.js';
import { register, login, updateSavedFans } from '../controllers/authController.js';
import { lockSeats, releaseSeats, createBooking, getUserBookings, validateGatePass } from '../controllers/bookingController.js';
import { createMatch, deleteMatch, updateMatchStands, getAllUsers, sendTicketEmail, getAdminStats } from '../controllers/adminController.js';

const router = express.Router();

router.get('/matches', getAllMatches);
router.get('/matches/:id', getMatchById);
router.get('/matches/:matchId/stands/:standId/seats', getStandSeats);

router.post('/auth/register', register);
router.post('/auth/login', login);
router.put('/auth/fans', updateSavedFans);

router.post('/bookings/lock', lockSeats);
router.post('/bookings/release', releaseSeats);
router.post('/bookings/create', createBooking);
router.get('/bookings/user/:email', getUserBookings);
router.post('/bookings/validate-gate', validateGatePass);

router.get('/admin/stats', getAdminStats);
router.get('/admin/users', getAllUsers);
router.post('/admin/matches', createMatch);
router.delete('/admin/matches/:id', deleteMatch);
router.put('/admin/matches/:id/stands', updateMatchStands);
router.post('/admin/send-email', sendTicketEmail);

export default router;
