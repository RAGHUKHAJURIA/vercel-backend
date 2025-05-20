const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/docModels");
const moment = require("moment");
const userModel = require("../models/userModels");


const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Doctor Details",
    });
  }
};


const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update issue",
      error,
    });
  }
};


const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.doctorId });
    res.status(200).send({
      success: true,
      message: "Sigle Doc Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Erro in Single docot info",
    });
  }
};

// doctor appointments
const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.userId });
    const appointments = await appointmentModel.find({ doctorId: doctor._id });
    res.status(200).send({
      success: true,
      message: 'Doctor appoinment successfully',
      data: appointments
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'doctor appointment fails',
    })
  }
}

//update controller

const updateStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    // Validate input
    if (!appointmentId || !status) {
      return res.status(400).send({
        success: false,
        message: 'Appointment ID and status are required'
      });
    }

    // Update appointment
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true } // Return updated document
    );

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Update user notification
    const user = await userModel.findById(appointment.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }

    user.notification.push({
      type: "status-updated",
      message: `Your appointment has been ${status}`,
      onClickPath: "/doctor-appointments",
    });

    await user.save();

    res.status(200).send({
      success: true,
      message: 'Appointment updated successfully'
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Update failed',
      error: error.message // Send only error message for security
    });
  }
};

module.exports = { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController };