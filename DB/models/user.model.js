import { Schema, model } from "mongoose";

import * as hooks from '../hooks/user.hooks.js'

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
    phone: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    },
    confirmCode: {
        type: String,
        minlength: 6,
        maxlength: 6
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

hooks.deleteOne_H(userSchema)

const userModel = model('User', userSchema)

export default userModel