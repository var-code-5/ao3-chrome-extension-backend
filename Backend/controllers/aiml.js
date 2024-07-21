import axios from 'axios';
import env from 'dotenv';

env.config()

export const get_recommendations = (req, res) =>{
    const url = process.env.AIML_URL+req.body.ao3_user;
    console.log(url);
    axios.get(url)
    .then(response => {
        res.status(200).send({"Data": response.data});
    })
    .catch(error => {
        res.status(500).send({"msg": "application side error"});
        console.log(error);
    });
} 