const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { nanoid } = require('nanoid');
const fs = require('fs');
const cron = require('node-cron');
const { Low, JSONFile } = require('lowdb');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const dbFile = './db.json';
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);
async function dbInit() {
    await db.read();
    db.data = db.data || { users: {}, sources: [], videos: {} };
    await db.write();
}
dbInit();

// === SOURCE AGGREGATOR ===
const sourcesConfig = [
    {
        name: "Vidmoly",
        listUrl: "https://vidmoly.to/latest.html",
        extract: async function () {
            const res = await axios.get(this.listUrl);
            const $ = cheerio.load(res.data);
            return $('a[href^="/embed-"]').map((i, el) => ({
                title: $(el).attr('title') || $(el).text().trim(),
                url: "https://vidmoly.to" + $(el).attr('href'),
                poster: $(el).find('img').attr('src') || null,
                id: $(el).attr('href').split('-')[1]?.split('.')[0],
                source: this.name
            })).get();
        }
    },
    {
        name: "DoodStream",
        listUrl: "https://doodstream.com/latest", // update if you know the right list URL
        extract: async function () {
            const res = await axios.get(this.listUrl);
            const $ = cheerio.load(res.data);
            return $('a[href*="dood.watch/e/"]').map((i, el) => ({
                title: $(el).attr('title') || $(el).text().trim(),
                url: $(el).attr('href'),
                poster: $(el).find('img').attr('src') || null,
                id: $(el).attr('href').split('/e/')[1],
                source: this.name
            })).get();
        }
    },
    {
        name: "Videasy",
        listUrl: "https://player.videasy.net/latest", // update if you know actual list page
        extract: async function () {
            const res = await axios.get(this.listUrl);
            const $ = cheerio.load(res.data);
            return $('a[href*="/movie/"]').map((i, el) => ({
                title: $(el).attr('title') || $(el).text().trim(),
                url: "https://player.videasy.net" + $(el).attr('href'),
                poster: $(el).find('img').attr('src') || null,
                id: $(el).attr('href').split('/movie/')[1]?.split('?')[0],
                source: this.name
            })).get();
        }
    }
];

async function scrapeAllSources() {
    await db.read();
    let allVideos = {};
    for (const src of sourcesConfig) {
        try {
            let vids = await src.extract();
            vids.forEach(video => {
                allVideos[video.url] = video;
            });
        } catch (e) {
            console.error(`[SCRAPER ERROR] ${src.name}:`, e.message);
        }
    }
    db.data.videos = allVideos;
    await db.write();
    console.log(`[SCRAPER] Updated at ${new Date().toISOString()}`);
}
// Initial scrape & repeat every 12 hours
scrapeAllSources();
cron.schedule('0 */12 * * *', scrapeAllSources);

function getUserIdFromPass(pass) {
    return 'user_' + Buffer.from(pass.trim().toLowerCase()).toString('base64').replace(/=+$/, '');
}
app.post('/api/login', async (req, res) => {
    const passphrase = req.body.passphrase;
    if (!passphrase || passphrase.length < 2) return res.status(400).json({ error: "Enter a valid passphrase." });

    await db.read();
    const userId = getUserIdFromPass(passphrase);

    if (!db.data.users[userId]) {
        db.data.users[userId] = { passphrase, progress: {}, createdAt: new Date() };
        await db.write();
    }

    res.cookie('userid', userId, { httpOnly: true, maxAge: 10 * 365 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, user: { userId, profile: passphrase } });
});

async function requireAuth(req, res, next) {
    await db.read();
    const userId = req.cookies.userid;
    if (!userId || !db.data.users[userId]) return res.status(401).json({ error: "Login required." });
    req.userId = userId;
    next();
}

app.get('/api/search', requireAuth, async (req, res) => {
    await db.read();
    const q = (req.query.q || '').toLowerCase();
    const vids = Object.values(db.data.videos || {});
    if (!q) return res.json(vids);
    res.json(vids.filter(v =>
        v.title && v.title.toLowerCase().includes(q)
    ));
});

app.get('/api/progress', requireAuth, async (req, res) => {
    await db.read();
    const progress = db.data.users[req.userId].progress || {};
    const vids = Object.entries(progress).map(([url, prog]) => ({
        ...db.data.videos[url],
        url,
        lastTime: prog.lastTime || 0,
        lastWatched: prog.lastWatched || null,
    }));
    res.json(vids);
});

app.post('/api/progress', requireAuth, async (req, res) => {
    const { url, lastTime } = req.body;
    await db.read();
    db.data.users[req.userId].progress = db.data.users[req.userId].progress || {};
    db.data.users[req.userId].progress[url] = {
        lastTime: lastTime || 0,
        lastWatched: new Date()
    };
    await db.write();
    res.json({ ok: true });
});

app.get('/api/videos', requireAuth, async (req, res) => {
    await db.read();
    res.json(Object.values(db.data.videos || {}));
});

app.get('/', (req, res) => res.sendFile(__dirname + '/aggregator.html'));

app.listen(port, () => console.log(`MONSTER8222025 running on :${port}`));
