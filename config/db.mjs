// Connect to the database
import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_URL)
        console.log(`Database connection established: ${connection.connection.host}`)

    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

export default dbConnect
