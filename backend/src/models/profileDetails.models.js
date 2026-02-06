import mongoose from 'mongoose';

const profileDetailsSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true,
    },
    lName: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    contactPhone: {
        type: String,
        required: true,
    },
    companySite: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    timeZone: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    communications: {
        email: {
            type: Boolean,
            default: false,
        },
        phone: {
            type: Boolean,
            default: false,
        }
    },
    allowMarketing: {
        type: Boolean,
        default: false
    }
});

// Create a Mongoose model based on the schema
export const ProfileDetails = mongoose.model('ProfileDetails', profileDetailsSchema);

