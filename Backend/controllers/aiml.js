import axios from 'axios';
import env from 'dotenv';

env.config()

export const get_recommendations = (req, res) =>{
    const url = process.env.AIML_URL.concat(req.body.ao3_user);
    // console.log(url);
    axios.get(url)
    .then(response => {
        res.status(200).json({Data: response.data});
    })
    .catch(error => {
        res.status(500).json({message: "application side error, username not found"});
        console.log(error);
    });
} 