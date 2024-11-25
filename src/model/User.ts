import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string,
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: [true, "content is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifycode: string,
    verifycodeExpiry: Date,
    isVerified: boolean,
    isAccptedMssg: boolean,
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        match: [/.+\@.+\..+/, "please use a valid email address"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    verifycode: {
        type: String,
        required: [true, "verify-code is required"],

    },
    verifycodeExpiry: {
        type: Date,
        required: [true, "verify-code Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAccptedMssg: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)
export default UserModel;