const openai = require('./openai');
const { model, systemRoleContent, temperature, presence_penalty, imgSystemRoleContent } = require("../config/ai.json");
const guildSchema = require("../schemas/guild");

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const query = async (prompt, guildId) => {

    let guildData = await guildSchema.findOne({ GuildID: guildId });

    if (!guildData) {
        guildData = new guildSchema({
            GuildID: guildId,
            Temperature: temperature,
            SystemRoleContent: systemRoleContent,
            ImageRoleContent: imgSystemRoleContent
        })

        await guildData.save();
    }

    if (!prompt || prompt.length < 1) return false;

    const res = await openai.chat.completions.create({
        model: model,
        messages: [
            {
                "role": "system", "content": guildData.SystemRoleContent
            },
            {
                "role": "user", "content": prompt
            },
        ],
        temperature: guildData.Temperature,
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