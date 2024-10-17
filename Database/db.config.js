import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://joshi14:IlHL7VxHTvUlLnQG@emailtrack.kll4x.mongodb.net/?retryWrites=true&w=majority&appName=emailtrack');
    console.log("Database Connected");
  } catch (error) {
    console.log("DB connection Failed");
    process.exit(1);
  }
};
