import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";


const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbconnect();
    try {
        const { searchParams } = new URL(request.url);
        const querySchema = {
            username: searchParams.get('username')
        }
        //validation with zod
        const result = usernameQuerySchema.safeParse(querySchema);
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: usernameError?.length > 0 ? usernameError.join(", ") : "Invalid username"
                }, { status: 400 }
            )
        }
        const { username } = result.data;
        const exiistingUsername = await UserModel.findOne({ username, isVerified: true })
        if (exiistingUsername) {
            return Response.json(
                {
                    success: false,
                    message: "username is already taken"
                }, { status: 405 }
            )
        }
        return Response.json(
            {
                success: true,
                message: "username is available"
            }, { status: 201 }
        )

    } catch (error) {
        console.log("check-username error", error);
        return Response.json(
            {
                success: false,
                message: "username Error"
            },
            { status: 501 }
        )
    }
}