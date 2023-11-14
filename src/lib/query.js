const openai = require('./openai');
const { model, systemRoleContent, temperature, presence_penalty } = require("../config/ai.json");

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const query = async (prompt) => {

    if (!prompt || prompt.length < 1) return false;

    const res = await openai.chat.completions.create({
        model: model,
        messages: [
            {
                "role": "system", "content": systemRoleContent
            },
            {
                "role": "user", "content": prompt
            },
        ],
        temperature: Number(temperature),
        presence_penalty: Number(presence_penalty)
    })
        .then((res) => res.choices[0].message)
        .catch((err) => `I had an error! ${err}`);

    await sleep(1000);

    if (typeof res === 'object') {
        return res.content;
    }

    return res;
};

module.exports = query;