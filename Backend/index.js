import express from "express";
import env from "dotenv";
import auth from "./routes/auth.js";
import aiml from "./routes/aiml.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

env.config();

const port = process.env.PORT || 3000;
const app = express();

// middleware
// var whitelist = [
//   "https://ao3-chrome-extension-website.vercel.app/",
//   "chrome-extension://nnmmeljlhmhpnfphcpifdahblfmhlilm",
//   "http://localhost:5173",
//   "http://localhost:5174"
// ];
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", auth);
app.use(aiml);
app.use(express.json());
app.use(cookieParser());

//the following will be redirected to the dashboard for now to the login page
app.get("/", (req, res) => {
  // res.redirect("/auth/login");
  res.status(200).send({ msg: "home route" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
