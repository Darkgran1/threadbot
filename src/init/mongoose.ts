import * as mongoose from 'mongoose'

export const mongodbURI = process.env.MONGODB_URI!
if (!mongodbURI) throw new Error('[ENV] Missing environment variable: MONGODB_URI')

mongoose.connect(mongodbURI, { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error:'))

export default mongoose
