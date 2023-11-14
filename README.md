# aiccord <img src="./public/assets/img/aiccord.png" width="22.5px"  />

An AI Discord bot.

```zsh
npm install
```

```zsh
npm run dev
```

## .env

```env
CLIENT_TOKEN=
CLIENT_ID=
OPENAI_API_KEY=
OPENAI_ORGANIZATION=
```

- Your Discord client credentials
  - **[Discord | Developers | Applications](https://discord.com/developers/applications)**
- Your OpenAI API credentials
  - **[OpenAI | API Keys](https://platform.openai.com/api-keys)**

### CONFIG

#### `ai.json`

> - Configure how your AI responds.

```json
{
    "model": "gpt-3.5-turbo",
    "systemRoleContent": "You are a friendly and witty chat bot. Your only job is to either answer a question in a funny way, or be intrigued by whatever the user says.",
    "temperature": "0.86",
    "presence_penalty": "0"
}
```

- `model` — See **[here](https://platform.openai.com/docs/models/models)**.
- `systemRoleContent` — Tell the AI how to respond.
- `temperature` — See **[here](https://platform.openai.com/docs/guides/text-generation/how-should-i-set-the-temperature-parameter)**.
- `presence_penalty` — See **[here](https://platform.openai.com/docs/guides/text-generation/parameter-details)**.
