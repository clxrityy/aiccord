const openai = require('./openai');
const { model, imgSystemRoleContent, temperature, presence_penalty } = require("../config/ai.json");
require("colors");

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const imgQuery = async (image) => {
    if (!image || image.length < 1) return false;

    const res = await openai.chat.completions.create({
        model: model,
        messages: [
            {
                "role": "system", "content": imgSystemRoleContent
            },
            {
                "role": "user", "content": image
            },
        ],
        temperature: Number(temperature),
        presence_penalty: Number(presence_penalty)
    }).then((res) => res.choices[0].message).catch((err) => console.log(`[AI ERROR] \n ${err}`.bgRed));

    await sleep(1000);

    if (typeof res === 'object') {
        return res.content;
    }

    return res;
};

module.exports = imgQuery;