import mongoose from "mongoose"
import { dbConfig } from "../config"

export const dbConn = async () => {
    try {
        await mongoose.connect(`${dbConfig.uri}`, {
            dbName: `${dbConfig.name}`
        })
        console.log(`Database Connected`)
    } catch (err) {
        console.error(`Database Connection Error: ${err}`)
        process.exit(1)
    }
}