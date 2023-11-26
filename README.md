# aiccord <img src="./public/assets/img/aiccord.png" width="22.5px"  />

A customizable AI Discord bot with authentication.

```zsh
npm install
```

```zsh
npm run dev
```

## .env

```env
CLIENT_ID=
CLIENT_PUBLIC_KEY=
CLIENT_TOKEN=
OPENAI_API_KEY=
OPENAI_ORGANIZATION_ID=
MONGO_URI=
PORT=
```

- Your Discord client credentials
  - **[Discord | Developers | Applications](https://discord.com/developers/applications)**
- Your OpenAI API credentials
  - **[OpenAI | API Keys](https://platform.openai.com/api-keys)**
- Your MongoDB connection string
  - **[MongoDB | Create a Connection String](https://www.mongodb.com/docs/drivers/node/current/quick-start/create-a-connection-string/)**
- **PORT**
  - Set this to the port you used to set up your redirect URI (view [here](https://discord.com/developers/docs/topics/oauth2) for more info).

### CONFIG ⚙️

#### `ai.json`

> - Configure how your AI responds by default.

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

#### `config.json`

> - The bot developer ID's and test guild ID.
> - `config.example.json`

```json
{
    "testGuildId": "",
    "developersId": [""]
}
```

### COMMANDS

- **`/ask [question]`**

> <img src="https://i.gyazo.com/f5e2beb0abccec6fe46c151285df8e09.png" width="500px" />

- **`/settings view | system | reset | help`**
  - >/settings system `role:`Respond in a funny way `temperature:` 0.86

> <img src="https://i.gyazo.com/d1d8ae94333c95308c297292eb590bef.png" width="500px" />

The settings such as temperature and system role content for a specific guild.
