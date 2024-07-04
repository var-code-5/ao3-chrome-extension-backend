import express from 'express';
import env from 'dotenv';
import auth from './routes/auth.js';
import bodyParser from 'body-parser';

env.config();

const port = process.env.PORT || 3000;
const app = express();

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use('/auth',auth);

//the following will be redirected to the dashboard for now to the login page
app.get('/', (req, res) => {
    res.redirect('/auth/login');
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
