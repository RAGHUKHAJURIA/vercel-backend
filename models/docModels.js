const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
    website: {
        type: String,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
    },
    experience: {
        type: String,
        required: [true, 'Experience is required'],
    },
    feesPerCunsaltation: {  // Keep your original spelling
        type: Number,
        required: [true, 'Fees per consultation is required'],
    },
    status: {
        type: String,
        default: 'pending',
    },
    timings: {
        type: Array,  // Changed from Object to Array
        required: [true, 'Working hours are required'],
    },
}, { timestamps: true });

const doctorModel = mongoose.model('doctors', doctorSchema);
module.exports = doctorModel;