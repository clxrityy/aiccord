// UNFINISHED

const express = require("express");
const axios = require("axios");
const url = require("url");
require('dotenv').config();
require("colors");
const RateLimit = require("express-rate-limit");
const path = require("path");

const port = process.env.PORT;
const app = express();

function isValidPath(string) {
    let pathRegex = /^(\/[^\/]+)+$/;

    return pathRegex.test(string);
}

const redirect = () => {

    const limiter = RateLimit({
        // maximum of five requests per minute
        windowMs: 15 * 60 * 1000,
        max: 100,
    });

    app.use(limiter);

    app.get(`/api/auth/discord/redirect/:path`, async (req, res) => {
        const { code } = req.query;
        let paramsPath = req.params.path;

        res.sendFile("../../public/html/index.html");

        if (code) {
            const formData = new url.URLSearchParams({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_TOKEN,
                grant_type: 'authorization_code',
                code: code.toString(),
                redirect_uri: `http://localhost:${port}/api/auth/discord/redirect`
            });

            const output = await axios.post("https://discord.com/api/v10/oauth2/token", formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            if (output.data) {
                const access = output.data.access_token;

                const userInfo = await axios.get('https://discord.com/api/v10/users/@me', {
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

                const refresh = await axios.post("https://discord.com/api/v10/oauth2/token",  formData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                const redirectPath = ("../../public/html/index.html");

                console.log(redirectPath)

                if (isValidPath(paramsPath)) res.status(200).sendFile(redirectPath);

            } 
        }
    });

    app.listen(port, () => {
        console.log(`[INFO] Running on port ${port}!`.bgGreen);
    })
}

module.exports = redirect;