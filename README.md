# MONSTER8222025 — Private Multi-source Streaming Aggregator

## 🚀 Quick Deploy for Back4app or any Docker host

1. Place these files in your repo/folder: `server.js`, `package.json`, `aggregator.html`, `Dockerfile`
2. Deploy as a Custom Docker App (see [Back4app guide](https://www.back4app.com/docs/docker/overview)):
    - Set port to 3000
    - Mount `/app/db.json` to a persistent volume so user data and continue-watching is saved long-term
3. When live, browse to **the public Back4app URL** from any device. No localhost needed!
4. Login with your passphrase/profile name. Each user gets their own progress and session!

### To add/edit hosters:
- Open `server.js`, edit or add to `sourcesConfig`
- All scraping and merging is automatic, runs every 12 hours by default.

---

**Now you have a true private streaming tracker/aggregator. Open from anywhere, share with trusted family, and your progress is always safe!**

Need more sources, custom logos/themes, or an allowlist for tighter user control? Just ask!
