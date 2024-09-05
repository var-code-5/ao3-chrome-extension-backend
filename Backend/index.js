import express from "express";
import env from "dotenv";
import auth from "./routes/auth.js";
import aiml from "./routes/aiml.js";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import cors from 'cors';

env.config();

const port = process.env.PORT || 3000;
const app = express();

// middleware
const allowedOrigins = [
  "https://ao3-chrome-extension-website.vercel.app",
  "https://localhost:5173" // only for dev env
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  // allowedHeaders: "Content-Type,Authorization",
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", auth);
app.use(aiml);
app.use(express.json());
app.use(cookieParser());

//the following will be redirected to the dashboard for now to the login page
app.get("/", (req, res) => {
  // res.redirect("/auth/login");
  res.status(200).send({"msg":"home route"})
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;