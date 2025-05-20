const express = require('express');
const { loginController, registeController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorController, bookAppointmentController, bookingAvailabilityController, userAppointmentsController } = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

//router exports
const router = express.Router();

//routes
//login || POST
router.post('/login', loginController);

//registe || POST
router.post('/register', registeController);

//Auth || POST
router.post('/getUserData', authMiddleware, authController);

//Apply-doc || POST
router.post('/apply-doctor', authMiddleware, applyDoctorController);

//notification doctor || POST
router.post('/get-all-notification', authMiddleware, getAllNotificationController);

//notification doctor || POST
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController);

//get all doctors || GET
router.get('/getAllDoctors', authMiddleware, getAllDoctorController)

//Book Appointment || POST
router.post('/book-appointment', authMiddleware, bookAppointmentController);

//booking availability || POST
router.post('/booking-availability', authMiddleware, bookingAvailabilityController);

//Appoinemnet List
router.get('/user-appointments', authMiddleware, userAppointmentsController)


module.exports = router;