import { sendVerificationCode } from "@/helper/sendVerificationEmail";
import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    await dbconnect();
    try {
        const { username, email, password } = await request.json()

        const existingUserByUsername = await UserModel.findOne({ username, isVerified: true })
        if (existingUserByUsername) {
            return Response.json({ success: false, message: "username already taken" }, { status: 500 })
        }
        const verifycode = Math.floor(100000 + Math.random() * 900000).toString();
        const existingEmailByUser = await UserModel.findOne({ email });
        if (existingEmailByUser) {
            if (existingEmailByUser.isVerified) {
                return Response.json({
                    success: false,
                    message: "user is already exist"
                }, { status: 500 })
            } else {
                const hashedpassword = await bcrypt.hash(password, 10);
                existingEmailByUser.password = hashedpassword;
                existingEmailByUser.verifycode = verifycode;
                //expiry in one hours the code 1st way
                existingEmailByUser.verifycodeExpiry = new Date(Date.now() + 3600000)
                await existingEmailByUser.save();
            }

        } else {
            //create a new user
            const hashpassword = await bcrypt.hash(password, 10);
            const verifycodeExpiry = new Date();
            //expiry in one hours the code 2nd way
            verifycodeExpiry.setHours(verifycodeExpiry.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashpassword,
                verifycode,
                verifycodeExpiry,
                isVerified: false,
                isAccptedMssg: true,
                messages: []
            })
            await newUser.save();
        }
        const emailVerfiction = await sendVerificationCode(email, username, verifycode)
        if (!emailVerfiction.success) {
            return Response.json({
                success: false,
                message: emailVerfiction.message
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User Register Successfully"
        }, { status: 201 })

    } catch (error) {
        console.error("Register Error: ", error);
        return Response.json({
            success: false,
            message: "Failed to Register"
        }, { status: 500 })
    }
}