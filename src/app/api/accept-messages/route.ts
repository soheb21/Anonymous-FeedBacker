import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOption";

export async function POST(request: Request) {
    await dbconnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "user not authenticated"
            }, { status: 401 })
        }
        const userID = user?._id;
        const { isAccptedMssg } = await request.json();
        const existingUser = await UserModel.findByIdAndUpdate({ _id: userID }, { isAccptedMssg }, { new: true });
        if (existingUser) {
            return Response.json({
                success: true,
                message: "Message acceptance status updated successfully",
                user: existingUser
            }, { status: 200 })
        } else {
            return Response.json({
                success: false,
                message: "Failed to change Message acceptance status"
            }, { status: 401 })
        }

    } catch (error) {
        console.error("accept-messages Error: ", error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}

export async function GET(request: Request) {
    await dbconnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "user not authenticated"
            }, { status: 401 })
        }
        const userID = user?._id;
        const foundUser = await UserModel.findById(userID);
        if (foundUser) {
            return Response.json({
                success: true,
                isAccptedMssg: foundUser.isAccptedMssg,
            }, { status: 200 })
        } else {
            return Response.json({
                success: false,
                message: "user not found",
            }, { status: 401 })
        }
    } catch (error) {
        console.error("getting accept-messages-status Error: ", error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}