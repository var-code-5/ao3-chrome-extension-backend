import express from "express";
import env from "dotenv";
import auth from "./routes/auth.js";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';


env.config();

const port = process.env.PORT || 3000;
const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", auth);
app.use(express.json());
app.use(cookieParser());

//the following will be redirected to the dashboard for now to the login page
app.get("/", (req, res) => {
  res.status(200).send({"msg":"home route"})
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;