const userModel = require('../models/userModels')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctorModel = require('../models/docModels')
const appointmentModel = require('../models/appointmentModel');
const moment = require('moment');


const registeController = async (req, res) => {
    try {

        const existingUser = await userModel.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(200).send({ message: `user already register`, success: false })
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassord = await bcrypt.hash(password, salt)
        req.body.password = hashedPassord
        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(200).send({ message: `Registered Sucessfully`, success: true })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: `Register Controller ${error.message}` })
    }
}



const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ message: `user not found`, success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: `Invalid Email or Password`, success: false });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.status(200).send({ message: `Login Success`, success: true, token });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
    }
}

const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.userId });
        user.password = undefined;
        if (!user) {
            return res.status(200).send({
                message: 'user not found',
                success: false,
            })
        } else {
            res.status(200).send({
                success: true,
                data: user,
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Auth Fail',
            success: false,
            error
        })
    }
}

const applyDoctorController = async (req, res) => {
    try {
        console.log(req.body);
        const newDoctor = await doctorModel({ ...req.body, status: "pending" });
        await newDoctor.save();

        const adminUser = await userModel.findOne({ isAdmin: true });
        if (!adminUser) {
            return res.status(404).send({
                success: false,
                message: "Admin user not found"
            });
        }

        // Corrected notification spelling to match your user model
        adminUser.notification.push({
            type: "apply-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: "/admin/doctors",  // Fixed typo in path
            },
        });

        await adminUser.save();  // Save the admin user

        res.status(201).send({
            success: true,
            message: "Doctor Account Applied Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: error.message,  // Send only error message for security
            message: "Error While Applying For Doctor",
        });
    }
};

// notification controller
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.userId });
        const seennotification = user.seennotification;
        const notification = user.notification;
        seennotification.push(...notification);
        user.notification = [];
        user.seennotification = notification;
        const updatedUser = await user.save();
        res.status(200).send({
            message: 'All notification marked as read',
            success: true,
            data: updatedUser,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Get notification failed',
            success: false,
            error
        })
    }
}


//delete notification controller
const deleteAllNotificationController = async (req, res) => {
    try {
        // chnge kiys req.body.userId
        const user = await userModel.findById({ _id: req.userId });
        user.notification = [];
        user.seennotification = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: 'all notification delete successfully',
            data: updatedUser,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'delete notification fail',
            success: false,
            error
        })
    }
}


const getAllDoctorController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: "approved" });
        res.status(200).send({
            success: true,
            message: "Docots Lists Fetched Successfully",
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Errro WHile Fetching DOcotr",
        });
    }
};


const bookAppointmentController = async (req, res) => {
    try {
        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        req.body.time = moment(req.body.time, "HH:mm").toISOString();
        req.body.status = "pending";
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();
        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
        user.notification.push({
            type: "New-appointment-request",
            message: `A New Appointment Request from ${req.body.userInfo.name}`,
            onCLickPath: "/user/appointments",
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: "Appointment Book succesfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While Booking Appointment",
        });
    }
};



const bookingAvailabilityController = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;

        // Combine date and time into one moment object
        const dateTime = moment(`${date} ${time}`, "DD-MM-YYYY HH:mm");

        if (!dateTime.isValid()) {
            return res.status(400).send({
                success: false,
                message: "Invalid date or time format",
            });
        }

        const fromTime = dateTime.clone().subtract(1, "hour").toISOString();
        const toTime = dateTime.clone().add(1, "hour").toISOString();

        const appointments = await appointmentModel.find({
            doctorId,
            time: {
                $gte: fromTime,
                $lte: toTime,
            },
        });
        console.log(appointments);
        if (appointments.length > 0) {
            return res.status(200).send({
                success: false,
                message: "Appointments not available at this time",
            });
        } else {
            return res.status(200).send({
                success: true,
                message: "Appointments available",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error checking booking availability",
            error: error.message,
        });
    }
};

//user appointment controller
const userAppointmentsController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ userId: req.userId });
        res.status(200).send({
            success: true,
            message: 'user appointmnet fetched successful',
            data: appointments,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in user appointmnets',
            error: error.message,
        })
    }
}



module.exports = { loginController, registeController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorController, bookAppointmentController, bookingAvailabilityController, userAppointmentsController }