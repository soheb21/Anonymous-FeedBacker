import dbconnect from "@/lib/dbconnect";
import UserModel, { Message } from "@/model/User";


export async function POST(request: Request) {
    dbconnect();
    try {
        const { username, content } = await request.json();
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 401 })
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save();
        return Response.json({
            success: true,
            message: "messsge sent successfully"
        }, { status: 201 });


    } catch (error) {
        console.log("send-message error", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 501 }
        )
    }
}