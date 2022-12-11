// Connect to the database
import mongoose from "mongoose";

const dbConnect = async () => {
    const connection = await mongoose.connect(process.env.DB_URL)
    console.log(`Database connection established: ${connection.connection.host}`)
}

export default dbConnect
