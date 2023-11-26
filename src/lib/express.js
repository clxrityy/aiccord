const express = require("express");
const axios = require("axios");
const url = require("url");
require('dotenv').config();
require("colors");

const port = process.env.PORT;
const app = express();

const redirect = () => {
    app.get(`/api/auth/discord/redirect`, async (req, res) => {
        const { code } = req.query;
    
        if (code) {
            const formData = new url.URLSearchParams({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_TOKEN,
                grant_type: 'authorization_code',
                code: code.toString(),
                redirect_uri: `http://localhost:${port}/api/auth/discord/redirect`
            });
    
            const output = await axios.post("https://dscord.com/api/v18/oauth2/token", {
                formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            
            if (output.data) {
                const access = output.data.access_token;
    
                const userInfo = await axios.get('https://discord.com/api/v18/users/@me', {
                    headers: {
                        "Authorization": `Bearer ${access}`
                    }
                });
    
                // refresh token

                const formData1 = new url.URLSearchParams({
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_TOKEN,
                    grant_type: 'refresh_token',
                    refresh_token: output.data.refresh_token,
                });
        
                const refresh = await axios.post("https://dscord.com/api/v18/oauth2/token", {
                    formData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                });

                res.sendFile("../../public/html/index.html");
            }
        }
    });

    app.listen(port, () => {
        console.log(`[INFO] Running on port ${port}!`.bgGreen);
    })
}

module.exports = redirect;