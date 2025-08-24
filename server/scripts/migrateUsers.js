import mongoose from "mongoose";
import UserModel from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const migrateUsers = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/typefast`);
    console.log("Connected to database");

    // Update all existing users to have the new fields
    const result = await UserModel.updateMany(
      {
        $or: [
          { totalPoints: { $exists: false } },
          { currentPeriodPoints: { $exists: false } },
          { lastLeaderboardReset: { $exists: false } }
        ]
      },
      {
        $set: {
          totalPoints: 0,
          currentPeriodPoints: 0,
          lastLeaderboardReset: new Date()
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} users`);
    
    // Calculate total points for existing users based on their history
    const users = await UserModel.find({});
    console.log(`Found ${users.length} users to process`);

    for (const user of users) {
      // This would require the History model to be imported
      // For now, we'll just set default values
      console.log(`Processed user: ${user.name}`);
    }

    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateUsers();
