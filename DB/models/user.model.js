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
    },
    birthday: {
        type: Date,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    },
    confirmCode: {
        type: String,
        minlength: 4,
        maxlength: 4
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    provider:{
        type:String,
        default:'system',
        enum:['system','google']
    },
    favouriteProducts:[{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    block: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true,
    }
)

hooks.deleteOne_H(userSchema)

const userModel = model('User', userSchema)

export default userModel