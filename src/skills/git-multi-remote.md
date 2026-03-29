方案：多 Remote + 定期同步
在 GitHub 上创建你自己的 repo（比如 aguo/vgpt3）
添加为第二个 remote，保留 Jon 的作为 upstream：

# 重命名 Jon 的 remote 为 upstream
git remote rename origin upstream

# 添加你自己的 repo 为 origin
git remote add origin https://github.com/<你的用户名>/vgpt3.git

# 推送到你的 repo
git push -u origin master
日常同步流程：

# 拉取 Jon 的最新改动
git fetch upstream
git merge upstream/master

# 推送到你的 repo
git push origin master
为什么不用 Fork？
GitHub Fork 也可以，但多 remote 方式更灵活：

你的 repo 完全独立，可以控制谁有访问权限
同步操作就是 fetch upstream + merge + push origin，很简单
如果以后需要给 Jon 贡献代码，也可以从你的 repo 开 PR 到 upstream
你要现在就操作吗？我需要知道你的新 repo URL。