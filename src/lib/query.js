const openai = require('./openai');
const { model, systemRoleContent, temperature, presence_penalty } = require("../config/aiConfig.json");

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const query = async (prompt) => {
    const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    if (!prompt || prompt.length < 1) return false;

    for (const item in list) {
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
            .then((res) => res.choices[Number(item)].message)
            .catch((err) => `I had an error! ${err}`);
        
        await sleep(50);

        if (typeof res === 'object') {
            return res.content;
        }

        return res;
    }
};

module.exports = query;