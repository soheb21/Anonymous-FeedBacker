import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbconnect();
    try {
        const { username, code } = await request.json();
        const decodeedUsername =  decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodeedUsername });
        if (!user) {
            return Response.json({
                success: false,
                message: "user not found!"
            }, { status: 404 })
        }
        const isCodeValid = user?.verifycode === code;
        const isVerifyExpiryCode = new Date(user?.verifycodeExpiry) > new Date();
        if (isCodeValid && isVerifyExpiryCode) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 })
        } else if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            }, { status: 401 })
        } else {
            return Response.json({
                success: false,
                message: "verification code has expired,please signup again"
            }, { status: 400 })
        }

    } catch (error) {
        console.error("veriify-code Error: ", error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}