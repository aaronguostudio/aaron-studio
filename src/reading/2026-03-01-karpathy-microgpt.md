# MicroGPT — Andrej Karpathy

- **Author:** Andrej Karpathy
- **URL:** https://karpathy.github.io/2026/02/12/microgpt/
- **Date Read:** 2026-03-01
- **Tags:** #ai #llm #gpt #from-scratch #education #deep-learning

## Summary

Karpathy 把 GPT 压缩到 200 行纯 Python（零依赖），包含完整的训练和推理流程。这不是玩具——它包含了 GPT 的全部算法本质：tokenizer、autograd 引擎、Transformer 架构（multi-head attention + MLP）、Adam optimizer、训练循环和推理循环。用 32K 名字数据集训练后能生成 plausible 的新名字。

他的核心观点：**从这里到 ChatGPT，改变的只是效率和规模，核心算法完全一样。**

## Key Takeaways

1. **GPT 的本质就是 next-token prediction** — 200 行就够了，其余全是工程优化
2. **Autograd 用乐高积木类比** — 每个运算是一块积木，知道输入输出的局部导数，chain rule 把它们串起来
3. **Attention 是唯一的 token 通信机制** — position t 只在 attention block 里能 "看到" 0..t-1
4. **MLP 是 "思考"** — attention 是通信，MLP 是计算，Transformer 交替执行两者
5. **KV Cache 训练时概念上也存在** — 只是生产实现里被向量化隐藏了
6. **Temperature 控制创造力** — 除以 temperature 后再 softmax，低温保守，高温发散
7. **"幻觉"本质** — 模型只知道统计上 plausible 的序列，不知道 truth。microgpt 生成 "karia" 和 ChatGPT 编造事实是同一现象
8. **从 microgpt 到 ChatGPT 的差距：**
   - Data: 32K names → trillions of tokens
   - Tokenizer: character-level → BPE (~100K vocab)
   - Compute: scalar Python → GPU tensor parallelism
   - Architecture: 4,192 params → hundreds of billions
   - Post-training: SFT + RLHF 把 document completer 变成 chatbot
   - 但核心 loop 完全一样

## Architecture Details (4,192 params)

```
n_embd = 16      # embedding dimension
n_head = 4       # attention heads
n_layer = 1      # transformer layers
block_size = 16   # max sequence length
vocab_size = 27   # 26 letters + BOS
```

Components:
- **Token + Position Embeddings** → 加在一起
- **RMSNorm** (simpler than LayerNorm)
- **Multi-head Attention** with KV cache
- **MLP** (linear → ReLU → linear, 4x expansion)
- **Residual connections** on both blocks
- **Adam optimizer** with linear LR decay

## Progression (Learning Path)

| File | What it adds |
|------|-------------|
| train0.py | Bigram count table — no neural net |
| train1.py | MLP + manual gradients + SGD |
| train2.py | Autograd (Value class) |
| train3.py | Position embeddings + single-head attention + rmsnorm + residuals |
| train4.py | Multi-head attention + layer loop — full GPT |
| train5.py | Adam optimizer — final version |

## Resources

- **Code:** https://gist.github.com/karpathy/8627fe009c40f57531cb18360106ce95
- **Web version:** https://karpathy.ai/microgpt.html
- **Colab:** https://colab.research.google.com/drive/1vyN5zo6rqUp_dYNbT4Yrco66zuWCZKoN
- **Build progression:** https://gist.github.com/karpathy/561ac2de12a47cc06a23691e1be9543a
- **Micrograd video (2.5h):** https://www.youtube.com/watch?v=VMj-3S1tku0

## GG's Notes

这篇文章对 Aaron 的价值：
- **Content angle** — 可以做一个 "I trained GPT in 200 lines" 的 X thread 或短视频
- **Education** — 如果要给团队解释 LLM 原理，这是最好的入门材料
- **Perspective** — 理解 "everything else is just efficiency" 有助于判断 AI 行业的 hype vs substance
