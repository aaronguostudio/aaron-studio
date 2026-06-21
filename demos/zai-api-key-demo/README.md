# ZAI API Key Demo

This tiny Node.js demo verifies that `ZAI_API_KEY` can call the Z.ai / Zhipu chat completions REST API.

It follows the official docs:

- Base URL: `https://open.bigmodel.cn/api/paas/v4`
- Endpoint: `POST /chat/completions`
- Auth header: `Authorization: Bearer YOUR_API_KEY`

## Run

From the repo root:

```bash
npm --prefix demos/zai-api-key-demo test
npm --prefix demos/zai-api-key-demo run check
```

Or from this folder:

```bash
npm test
npm run check
```

The CLI searches for `.env` in the current directory and then parent directories, so it can read the repo root `.env`.
It uses Node's built-in `https` module directly, so there are no runtime dependencies to install.

## Environment

Required:

```bash
ZAI_API_KEY=your-api-key
```

Optional:

```bash
ZAI_MODEL=glm-4.5-flash
ZAI_BASE_URL=https://open.bigmodel.cn/api/paas/v4
```

The default model is `glm-4.5-flash` to keep the verification call small. The script only prints status, model, request id, and the model reply; it does not print the API key.
