import mongoose from "mongoose";

type connectionType = {
    isConnected?: Number
}
const connection: connectionType = {}

async function dbconnect(): Promise<void> {
    //basic optimization for nextjs its check if there is already connected with databsse
    if (connection.isConnected) {
        console.log('Already connected to database')
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URL || '');
        connection.isConnected = db.connections[0].readyState
        console.log("Database is connected");


    } catch (error) {
        console.log("Database failed to connect ", error)
        process.exit(1);
    }
}
export default dbconnect;