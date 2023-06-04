import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { fileURLToPath } from "url";
import path from "path";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import userRouter from "./routes/userRouters.js";
import { corsOptions } from "./config/corsOptions.js";
import * as fs from "fs";
import moment from "moment-timezone";
import propertyRoutes from "./routes/propertyRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import tourRouter from "./routes/tourRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

morgan.token("date", (req, res, tz) => {
  return moment().tz(tz).format();
});
morgan.format(
  "myformat",
  '[:date[Asia/Tehran]] ":method :url" :status :res[content-length] - :response-time ms'
);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs", "access.log"),
  { flags: "a" }
);

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("myformat", "combined", { stream: accessLogStream }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.get("/", (req, res) => res.send("Its Work!"));

app.use("/auth", authRoutes);
app.use("/user", userRouter);
app.use("/property", propertyRoutes);
app.use("/agent", agentRoutes);
app.use("/contact", contactRouter);
app.use("/tour", tourRouter);

const PORT = process.env.PORT || 6321;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
