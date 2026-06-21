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
npm --prefix demos/zai-api-key-demo run ask -- --model glm-5.2 "解释一下递归"
```

Or from this folder:

```bash
npm test
npm run check
npm run ask -- --model glm-5.2 "解释一下递归"
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
ZAI_MAX_TOKENS=4096
ZAI_TIMEOUT_MS=120000
```

The default model is `glm-4.5-flash` to keep the verification call small. The script only prints status, model, request id, and the model reply; it does not print the API key.

For practical prompts, use the `ask` script. It defaults to `glm-5.2` and can save the full reply:

```bash
npm run ask -- --model glm-5.2 --max-tokens 8192 --timeout-ms 120000 --output output/flappy-bird.html "写一个单文件 HTML Flappy Bird 游戏"
```
