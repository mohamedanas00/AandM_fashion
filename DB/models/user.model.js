import { Schema, model } from "mongoose";

const userSchema = Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true//delte space from first and end
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user']
    },
    isActive: {
        type: Boolean,
        default: false
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    block: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
    }
)


const userModel = model('User', userSchema)

export default userModel