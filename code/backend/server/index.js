import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import dotenv from "dotenv";
import routes from "./routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(ClerkExpressWithAuth());

mongoose.connect(process.env.MONGODB_URI);

app.use("/api", routes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
