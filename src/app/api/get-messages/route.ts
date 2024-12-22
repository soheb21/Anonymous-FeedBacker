import dbconnect from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOption";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function GET(request: Request) {
    dbconnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "user not authenticated"
            }, { status: 401 })
        }
        const userID = new mongoose.Types.ObjectId(user?._id);
        const founduser = await UserModel.aggregate([
            { $match: { id: userID } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])
        
        console.log("aggeration-message", founduser);

        if (!founduser || founduser.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                { status: 401 }
            )
        }
        return Response.json(
            {
                success: true,
                message: founduser[0].messages,
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("get-messages", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 501 }
        )
    }
}