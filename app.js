// ==== ENTER YOUR BACK4APP KEYS HERE ====
Parse.initialize("qzKhHn8FQxBkEnOADBBA7hl356CtKbBqsBZTFtce", "NHKlhu3xDOyYFy6K3MU2lhPraON2Fd1eyoYY7v58");
Parse.serverURL = "https://parseapi.back4app.com";
// ==== END PARSE SETUP ====

const API_KEY = '1070730380f5fee0d87cf0382670b255';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let currentType = 'movie';
let currentQuery = '';
let currentItemData = null;
let isSandboxMode = true; // Default to No Sandbox mode

let currentReleaseDate = new Date();
let newReleaseType = 'movie';

// ADDED DATE VARIABLES FOR THE 14-DAY LOGIC
const today = new Date();
const fourteenDaysAgo = new Date();
fourteenDaysAgo.setDate(today.getDate() - 14);
today.setHours(0, 0, 0, 0);
fourteenDaysAgo.setHours(0, 0, 0, 0);

// DOM Elements
const galleryContainer = document.getElementById('galleryContainer');
const galleryTitle = document.getElementById('galleryTitle');
const searchInput = document.getElementById('searchInput');
const showMoviesBtn = document.getElementById('showMoviesBtn');
const showTvBtn = document.getElementById('showTvBtn');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfoSpan = document.getElementById('pageInfo');
// MODAL ELEMENTS
const videoModal = document.getElementById('videoModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalTitle = document.getElementById('modalTitle');
let videoPlayer = null; // Will be set dynamically
const sourceSelector = document.getElementById('sourceSelector');
const episodeSelector = document.getElementById('episodeSelector');
const seasonSelect = document.getElementById('seasonSelect');
const episodeSelect = document.getElementById('episodeSelect');
const iframeContainer = document.getElementById('iframeContainer');
const nowPlayingDisplay = document.getElementById('nowPlaying');
const summaryDisplay = document.getElementById('summary');
const trailerBtn = document.getElementById('trailerBtn');
const prevEpisodeBtn = document.getElementById('prevEpisodeBtn');
const nextEpisodeBtn = document.getElementById('nextEpisodeBtn');
const continueWatchingSection = document.getElementById('continueWatchingSection');
const continueWatchingContainer = document.getElementById('continueWatchingContainer');
const showNoSandboxBtn = document.getElementById('showNoSandboxBtn');
const showSandboxBtn = document.getElementById('showSandboxBtn');
const episodeNavButtons = document.getElementById('episodeNavButtons');

// NEW ELEMENTS FOR BOTTOM NAVIGATION
const prevPageBottomBtn = document.getElementById('prevPageBottom');
const nextPageBottomBtn = document.getElementById('nextPageBottom');
const pageInfoBottomSpan = document.getElementById('pageInfoBottom');


// NEW RELEASE ELEMENTS
const newReleasesContainer = document.getElementById('newReleasesContainer');
const prevReleaseDayBtn = document.getElementById('prevReleaseDayBtn');
const nextReleaseDayBtn = document.getElementById('nextReleaseDayBtn');
const releaseDateInfo = document.getElementById('releaseDateInfo');
const showNewReleaseMoviesBtn = document.getElementById('showNewReleaseMoviesBtn');
const showNewReleaseTvBtn = document.getElementById('showNewReleaseTvBtn');


const availableSources = [
    {
        id: 'wplayme',
        name: 'Mike Ty-thhon',
        urls: {
            movie: 'https://embed.wplay.me/embed/movie/{id}',
            tv: 'https://embed.wplay.me/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidsrcpk',
        name: 'VidSrcPk',
        urls: {
            movie: 'https://vidsrc.win/movie/?id={id}',
            tv: 'https://vidsrc.win/tv.html?id={id}&season={season}&episode={episode}'
        }
    },
    {
        id: "vidsrccc",
        name: "VidSrcCC",
        urls: {
            movie: "https://vidsrc.cc/v2/embed/movie/{id}?autoPlay=false",
            tv: "https://vidsrc.cc/v2/embed/tv/{id}/{season}/{episode}?nextEpisode=true&autoPlay=false",
        }
    },
    {
        id: 'primewire',
        name: 'Primewire',
        urls: {
            movie: 'https://www.primewire.tf/embed/movie?tmdb={id}',
            tv: 'https://www.primewire.tf/embed/tv?tmdb={id}&season={season}&episode={episode}&server=vidmoly'
        }
    },
    {
        id: 'vidpop',
        name: 'Vidpop',
        urls: {
            movie: 'https://www.vidpop.xyz/embed/?id={id}',
            tv: 'https://www.vidpop.xyz/embed/?id={id}&season={season}&episode={episode}'
        }
    },
    {
        id: 'rive',
        name: 'RiveStream',
        urls: {
            movie: 'https://rivestream.org/embed?type=movie&id={id}',
            tv: 'https://rivestream.org/embed?type=tv&id=tmdb&id={id}&season={season}&episode={episode}'
        }
    },
    {
        id: 'hexa',
        name: 'Hexa',
        urls: {
            movie: 'https://hexa.watch/watch/movie/{id}',
            tv: 'https://hexa.watch/watch/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidzee',
        name: 'VidZee',
        urls: {
            movie: 'https://player.vidzee.wtf/embed/movie/{id}',
            tv: 'https://player.vidzee.wtf/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidify',
        name: 'Vidify',
        urls: {
            movie: 'https://vidify.top/embed/movie/{id}',
            tv: 'https://vidify.top/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'spenflix',
        name: 'SpenFlix',
        urls: {
            movie: 'https://spencerdevs.xyz/movie/{id}',
            tv: 'https://spencerdevs.xyz/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidsrccx',
        name: 'VidSrcCX',
        urls: {
            movie: 'https://vidsrc.cx/embed/movie/{id}',
            tv: 'https://vidsrc.cx/embed/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidnest',
        name: 'VidNest',
        urls: {
            movie: 'https://vidnest.fun/movie/{id}',
            tv: 'https://vidnest.fun/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'bludclart',
        name: 'Bludclart',
        urls: {
            movie: 'https://watch.bludclart.com/movie/{id}',
            tv: 'https://www.vidking.net/embed/tv/{id}/{season}/{episode}'
        }
    },


    {
        id: 'videasy',
        name: 'VidEasy',
        urls: {
            movie: 'https://player.videasy.net/movie/{id}?color=8834ec',
            tv: 'https://player.videasy.net/tv/{id}/{season}/{episode}?nextEpisode=true&color=8834ec'
        }
    },
    {
        id: 'vidfast',
        name: 'VidFast',
        urls: {
            movie: 'https://vidfast.pro/movie/{id}',
            tv: 'https://vidfast.pro/tv/{id}/{season}/{episode}'
        }
    },
    {
        id: 'vidsrcvip',
        name: 'vidsrc.vip',
        urls: {
            movie: 'https://vidsrc.vip/embed/movie/{id}',
            tv: 'https://vidsrc.vip/embed/tv/{id}/{season}/{episode}'
        }
    }
];
const sandboxedSources = ['wplayme', 'vidsrcpk', 'vidsrccc', 'primewire', 'vidpop', 'rive', 'hexa', 'spenflix', 'vidzee', 'vidify', 'vidsrccx', 'bludclart', 'vidnest'];
const noSandboxSources = ['videasy', 'vidfast', 'vidsrcvip'];

function getContinueWatchingKey({
    sourceId,
    type,
    id,
    season,
    episode
}) {
    if (type === 'movie') return `${sourceId}:movie:${id}`;
    if (type === 'tv') return `${sourceId}:tv:${id}:${season}:${episode}`;
    return '';
}

async function saveContinueWatching(key, position) {
    try {
        const CW = Parse.Object.extend('ContinueWatching');
        const query = new Parse.Query(CW);
        query.equalTo('key', key);
        let record = await query.first();
        if (!record) {
            record = new CW();
            record.set('key', key);
        }
        record.set('position', position);
        await record.save();
    } catch (err) {
        console.error('Parse saveContinueWatching failed:', err);
    }
}

async function getContinueWatching(key) {
    try {
        const CW = Parse.Object.extend('ContinueWatching');
        const query = new Parse.Query(CW);
        query.equalTo('key', key);
        const obj = await query.first();
        return obj && typeof obj.get("position") === "number" ? obj.get("position") : 0;
    } catch (err) {
        console.error('Parse getContinueWatching failed:', err);
        return 0;
    }
}

async function deleteContinueWatching(key) {
    try {
        const CW = Parse.Object.extend('ContinueWatching');
        const query = new Parse.Query(CW);
        query.equalTo('key', key);
        const obj = await query.first();
        if (obj) {
            await obj.destroy();
        }
    } catch (err) {
        console.error("Failed to delete from continue watching:", err);
    }
}

let parseProgressTimer = null;
let lastVideoKey = null;
let watchSeconds = 0;
let lastSaved = 0;

function startParseProgressTracking() {
    stopParseProgressTracking();

    const sourceId = sourceSelector.value;
    const type = currentType;
    const id = currentItemData.id;
    let season = 1,
        episode = 1;
    if (type === 'tv') {
        season = seasonSelect.value;
        episode = episodeSelect.value;
    }
    lastVideoKey = getContinueWatchingKey({
        sourceId,
        type,
        id,
        season,
        episode
    });

    getContinueWatching(lastVideoKey).then(seconds => {
        watchSeconds = seconds;
        lastSaved = seconds;
        if (seconds > 0) {
            // This section can be used to add a "resume" feature
        }
    });

    parseProgressTimer = setInterval(() => {
        watchSeconds += 15;
        if (Math.abs(watchSeconds - lastSaved) >= 20) {
            saveContinueWatching(lastVideoKey, watchSeconds);
            lastSaved = watchSeconds;
            loadContinueWatchingParse();
        }
    }, 15000);
}

function stopParseProgressTracking() {
    if (parseProgressTimer) clearInterval(parseProgressTimer);
    parseProgressTimer = null;
}

async function loadContinueWatchingParse() {
    try {
        const CW = Parse.Object.extend('ContinueWatching');
        const query = new Parse.Query(CW);
        query.limit(1000);
        const results = await query.find();
        const continueWatchingData = [];
        for (let row of results) {
            const key = row.get('key');
            const position = row.get('position');
            const updatedAt = row.updatedAt;
            let sourceId, type, id, season, episode;
            let tmp = key.split(':');
            sourceId = tmp[0];
            type = tmp[1];
            id = tmp[2];
            if (type === "tv") {
                season = tmp[3];
                episode = tmp[4];
            }
            continueWatchingData.push({
                key,
                sourceId,
                type,
                id,
                season,
                episode,
                position,
                updatedAt
            });
        }
        renderContinueWatchingParse(continueWatchingData);
    } catch (err) {
        console.error("Failed to load continue watching from Parse:", err);
        continueWatchingSection.style.display = 'none';
    }
}

async function renderContinueWatchingParse(continueWatchingData) {
    const continueWatchingContainer = document.getElementById('continueWatchingContainer');
    const continueWatchingSection = document.getElementById('continueWatchingSection');

    const uniqueDataMap = new Map();
    continueWatchingData.forEach(item => {
        const cardId = `${item.type}:${item.id}:${item.season || ""}:${item.episode || ""}`;
        if (!uniqueDataMap.has(cardId) || new Date(item.updatedAt) > new Date(uniqueDataMap.get(cardId).updatedAt)) {
            uniqueDataMap.set(cardId, item);
        }
    });
    const uniqueContinueWatchingData = Array.from(uniqueDataMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);

    if (!uniqueContinueWatchingData.length) {
        continueWatchingSection.style.display = 'none';
        return;
    }
    continueWatchingSection.style.display = 'block';

    continueWatchingContainer.innerHTML = '';

    for (const item of uniqueContinueWatchingData) {
        const cardId = `${item.type}:${item.id}:${item.season || ""}:${item.episode || ""}`;

        const card = document.createElement('div');
        card.className = 'continue-watching-card';
        card.dataset.cardId = cardId;
        card.innerHTML = `
                        <button class="close-btn" title="Remove" type="button">&times;</button>
                        <div class="image-container">
                            <img src="https://via.placeholder.com/80x120/1a1a1a/bb86fc?text=Loading..." alt="Loading">
                        </div>
                        <div class="title-area">
                            <div class="title">Loading...</div>
                            <div class="progress">Last seen at: ${formatTime(item.position)}</div>
                        </div>
                    `;

        card.querySelector('.close-btn').addEventListener('click', async e => {
            e.stopPropagation();
            if (confirm('Remove this from "Continue Watching"?')) {
                await deleteContinueWatching(item.key);
                loadContinueWatchingParse();
            }
        });

        continueWatchingContainer.appendChild(card);

        fetchContentDetails(item.id, item.type).then(details => {
            if (!details) return;
            const title = details.title || details.name || 'Unknown';
            const image = details.poster_path ? `${IMAGE_BASE_URL}${details.poster_path}` : 'https://via.placeholder.com/80x120/1a1a1a/bb86fc?text=No+Image';
            let sub = "";
            if (item.type === "tv" && item.season && item.episode)
                sub = `S${item.season.toString().padStart(2, "0")}E${item.episode.toString().padStart(2, "0")}`;

            const fillCard = continueWatchingContainer.querySelector(`[data-card-id='${cardId}']`);
            if (!fillCard) return;
            fillCard.querySelector('.image-container img').src = image;
            fillCard.querySelector('.image-container img').alt = title;
            fillCard.querySelector('.title').innerHTML = title + (sub ? ' <span style="color:#bbb; font-size:.9em;">' + sub + '</span>' : '');
            fillCard.onclick = async (e) => {
                if (e.target.closest('.close-btn')) return;
                if (details) {
                    if (item.type === "tv") {
                        openPlayer(details, item.season, item.episode);
                    } else {
                        openPlayer(details);
                    }
                }
            };
        }).catch(err => {
            console.error("Failed to fetch details for continue watching item:", err);
        });
    }
}

async function fetchContent(type, page, query = '') {
    try {
        let url;
        if (query) {
            url = `${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
        } else {
            url = `${BASE_URL}/${type}/popular?api_key=${API_KEY}&page=${page}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("TMDB Fetch Error: " + error.message);
        return null;
    }
}

// MODIFIED FUNCTION TO FETCH NEW RELEASES
async function fetchNewReleases(date, type) {
    try {
        const formattedDate = date.toISOString().split('T')[0];
        let url = '';

        if (type === 'movie') {
            url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&primary_release_date.gte=${formattedDate}&primary_release_date.lte=${formattedDate}&sort_by=primary_release_date.desc`;
        } else if (type === 'tv') {
            url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&air_date.gte=${formattedDate}&air_date.lte=${formattedDate}&sort_by=air_date.desc`;
        }

        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("TMDB New Releases Fetch Error: " + error.message);
        return [];
    }
}

async function fetchTrailer(id, type) {
    try {
        const url = `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        const trailer = data.results.find(video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser'));
        return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
    } catch (error) {
        console.error("TMDB Trailer Fetch Error: " + error.message);
        return null;
    }
}

async function fetchContentDetails(id, type) {
    try {
        const url = `${BASE_URL}/${type}/${id}?api_key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (type === 'tv' && data.seasons) {
            const validSeasons = data.seasons.filter(s => s.season_number >= 1);
            const seasonPromises = validSeasons.map(async season => {
                const seasonUrl = `${BASE_URL}/tv/${id}/season/${season.season_number}?api_key=${API_KEY}`;
                const seasonRes = await fetch(seasonUrl);
                const seasonData = await seasonRes.json();
                return {
                    ...season,
                    episodes: seasonData.episodes || []
                };
            });
            data.seasons = await Promise.all(seasonPromises);
        }
        return data;
    } catch (error) {
        console.error("TMDB Details Error: " + error.message);
        return null;
    }
}

// MODIFIED renderGallery FUNCTION
function renderGallery(items) {
    galleryContainer.innerHTML = '';
    if (!items || items.length === 0) {
        galleryContainer.innerHTML = '<p class="text-center text-gray-500 col-span-full">No results found.</p>';
        return;
    }
    items.forEach(item => {
        const title = item.title || item.name;
        const releaseDate = item.release_date || item.first_air_date;
        const posterPath = item.poster_path;

        // New release logic
        let isNewRelease = false;
        if (releaseDate) {
            const itemReleaseDate = new Date(releaseDate);
            itemReleaseDate.setHours(0, 0, 0, 0);
            isNewRelease = itemReleaseDate >= fourteenDaysAgo && itemReleaseDate <= today;
        }

        if (posterPath) {
            const posterUrl = `${IMAGE_BASE_URL}${posterPath}`;
            const card = document.createElement('div');
            card.className = "gallery-card";
            card.setAttribute('data-id', item.id);
            card.setAttribute('data-type', currentType);

            // Add the new release banner if applicable
            let bannerHTML = '';
            if (isNewRelease) {
                const bannerText = currentType === 'movie' ? 'NEW RELEASE' : 'NEW EPISODE';
                bannerHTML = `<div class="absolute top-0 left-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-br-lg z-10 animate-pulse-banner">${bannerText}</div>`;
            }

            card.innerHTML = `
                        ${bannerHTML}
                        <img src="${posterUrl}" alt="${title}">
                        <div class="card-info">
                            <h3>${title}</h3>
                            <p>${releaseDate ? releaseDate.substring(0, 4) : 'N/A'}</p>
                        </div>
                    `;
            card.addEventListener('click', async () => {
                const id = card.getAttribute('data-id');
                const type = card.getAttribute('data-type');
                const itemData = await fetchContentDetails(id, type);
                if (itemData) {
                    openPlayer(itemData);
                } else {
                    console.error("Failed to fetch item details.");
                }
            });
            galleryContainer.appendChild(card);
        }
    });
}

// UPDATED RENDER FUNCTION FOR THE NEW RELEASES LIST
async function renderNewReleases(items) {
    newReleasesContainer.innerHTML = '';
    if (!items || items.length === 0) {
        newReleasesContainer.innerHTML = '<p class="text-center text-gray-500">No new releases on this day.</p>';
        return;
    }

    const displayedItems = items.slice(0, 10);
    for (const item of displayedItems) {
        const title = item.title || item.name;
        const posterPath = item.poster_path;

        if (posterPath) {
            const posterUrl = `${IMAGE_BASE_URL}${posterPath}`;
            const card = document.createElement('div');
            card.className = "new-release-card";
            card.setAttribute('data-id', item.id);
            card.setAttribute('data-type', newReleaseType);
            let subtitle = item.release_date ? item.release_date.substring(0, 4) : 'N/A';

            if (newReleaseType === 'tv') {
                const episodeInfo = await fetchTVShowDetailsWithEpisodes(item.id, currentReleaseDate);
                if (episodeInfo) {
                    subtitle = `S${String(episodeInfo.season).padStart(2, '0')} E${String(episodeInfo.episode).padStart(2, '0')}`;
                } else {
                    // If no episode matches the date, skip this card
                    continue;
                }
            }

            card.innerHTML = `
                        <div class="image-container">
                            <img src="${posterUrl}" alt="${title}">
                        </div>
                        <div class="card-info">
                            <h3>${title}</h3>
                            <p>${subtitle}</p>
                        </div>
                    `;
            card.addEventListener('click', async () => {
                const id = card.getAttribute('data-id');
                const type = card.getAttribute('data-type');
                const itemData = await fetchContentDetails(id, type);
                if (itemData) {
                    const episodeInfo = await fetchTVShowDetailsWithEpisodes(item.id, currentReleaseDate);
                    if (type === 'tv' && episodeInfo) {
                        openPlayer(itemData, episodeInfo.season, episodeInfo.episode);
                    } else {
                        openPlayer(itemData);
                    }
                } else {
                    console.error("Failed to fetch item details.");
                }
            });
            newReleasesContainer.appendChild(card);
        }
    }
}


async function updateUI() {
    const data = await fetchContent(currentType, currentPage, currentQuery);
    if (data) {
        renderGallery(data.results);
        pageInfoSpan.textContent = `Page ${data.page} of ${data.total_pages}`;
        pageInfoBottomSpan.textContent = `Page ${data.page} of ${data.total_pages}`;

        prevPageBtn.disabled = data.page <= 1;
        nextPageBtn.disabled = data.page >= data.total_pages;

        prevPageBottomBtn.disabled = data.page <= 1;
        nextPageBottomBtn.disabled = data.page >= data.total_pages;

        if (currentQuery) {
            galleryTitle.textContent = `Search Results for "${currentQuery}"`;
        } else {
            galleryTitle.textContent = currentType === 'movie' ? 'Popular Movies' : 'Popular TV Shows';
        }
    }
}

function updateNewReleasesUI() {
    releaseDateInfo.textContent = currentReleaseDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    fetchNewReleases(currentReleaseDate, newReleaseType).then(items => {
        renderNewReleases(items);
    });
}

function closeModal() {
    videoModal.classList.remove('visible');
    videoModal.classList.add('hidden');
    stopParseProgressTracking();
    if (videoPlayer) videoPlayer.src = '';
}

function openPlayer(itemData, initialSeason = null, initialEpisode = null) {
    currentItemData = itemData;
    modalTitle.textContent = currentItemData.title || currentItemData.name;
    stopParseProgressTracking();

    const isTV = itemData.media_type === 'tv' || itemData.first_air_date;
    episodeSelector.classList.toggle('hidden', !isTV);
    episodeNavButtons.classList.toggle('hidden', !isTV);

    if (isTV) {
        currentType = 'tv';
        populateSeasonSelect(initialSeason, initialEpisode);
    } else {
        currentType = 'movie';
        updatePlayer();
    }

    videoModal.classList.remove('hidden');
    videoModal.classList.add('visible');
}

function populateSourceSelector() {
    sourceSelector.innerHTML = '';
    const sourcesToShow = isSandboxMode ? sandboxedSources : noSandboxSources;
    const filteredSources = availableSources.filter(s => sourcesToShow.includes(s.id));
    sourceSelector.innerHTML = filteredSources.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    updatePlayer();
}

function populateSeasonSelect(initialSeason = null, initialEpisode = null) {
    seasonSelect.innerHTML = '';
    if (!currentItemData || !currentItemData.seasons) {
        return;
    }
    const seasons = currentItemData.seasons.filter(s => s.season_number >= 1).sort((a, b) => a.season_number - b.season_number);
    seasons.forEach(season => {
        const option = document.createElement('option');
        option.value = season.season_number;
        option.textContent = `Season ${season.season_number}`;
        seasonSelect.appendChild(option);
    });
    if (initialSeason) {
        seasonSelect.value = initialSeason;
    }
    if (seasons.length > 0) {
        populateEpisodeSelect(seasonSelect.value, initialEpisode);
    } else {
        episodeSelect.innerHTML = '';
    }
}

function populateEpisodeSelect(seasonNumber, initialEpisode = null) {
    const season = (currentItemData.seasons || []).find(s => s.season_number == seasonNumber);
    episodeSelect.innerHTML = '';
    if (!season || !season.episodes || season.episodes.length === 0) {
        const option = document.createElement('option');
        option.value = 0;
        option.textContent = `No episodes found`;
        episodeSelect.appendChild(option);
        episodeSelect.disabled = true;
        prevEpisodeBtn.disabled = true;
        nextEpisodeBtn.disabled = true;
        summaryDisplay.textContent = "";
        return;
    }
    episodeSelect.disabled = false;
    season.episodes.forEach(episode => {
        const option = document.createElement('option');
        option.value = episode.episode_number;
        option.textContent = `Episode ${episode.episode_number}: ${episode.name || 'Untitled'}`;
        episodeSelect.appendChild(option);
    });
    if (initialEpisode) {
        episodeSelect.value = initialEpisode;
    }
    updatePlayer();
}

function updatePlayer() {
    if (!currentItemData) {
        if (videoPlayer) videoPlayer.src = '';
        return;
    }

    const isTV = currentType === 'tv';
    episodeSelector.style.display = isTV ? 'block' : 'none';
    episodeNavButtons.style.display = isTV ? 'flex' : 'none';

    if (isTV) {
        const currentSeason = parseInt(seasonSelect.value);
        const currentEpisode = parseInt(episodeSelect.value);
        const seasonData = currentItemData.seasons.find(s => s.season_number === currentSeason);

        prevEpisodeBtn.disabled = currentEpisode <= 1 && currentSeason <= 1;
        nextEpisodeBtn.disabled = currentEpisode >= seasonData ? .episodes.length && currentSeason >= currentItemData.seasons.length;

        const currentEpisodeData = seasonData ? .episodes.find(e => e.episode_number === currentEpisode);
        if (currentEpisodeData) {
            nowPlayingDisplay.textContent = `Now Playing: ${currentItemData.name} - S${currentSeason} E${currentEpisode} - ${currentEpisodeData.name}`;
            summaryDisplay.textContent = currentEpisodeData.overview || "No summary available for this episode.";
        } else {
            nowPlayingDisplay.textContent = `Now Playing: ${currentItemData.name}`;
            summaryDisplay.textContent = "No episode details available.";
        }
    } else {
        nowPlayingDisplay.textContent = `Now Playing: ${currentItemData.title}`;
        summaryDisplay.textContent = currentItemData.overview || "No summary available for this movie.";
    }

    const activeSource = availableSources.find(s => s.id === sourceSelector.value);
    if (!activeSource) {
        if (videoPlayer) videoPlayer.src = '';
        return;
    }

    let url;
    if (currentType === 'movie') {
        url = activeSource.urls.movie.replace('{id}', currentItemData.id);
    } else {
        const season = seasonSelect.value || 1;
        const episode = episodeSelect.value || 1;
        if (isNaN(season) || isNaN(episode) || season == 0 || episode == 0) {
            if (videoPlayer) videoPlayer.src = '';
            return;
        }
        url = activeSource.urls.tv.replace('{id}', currentItemData.id).replace('{season}', season).replace('{episode}', episode);
    }

    const newIframe = document.createElement('iframe');
    newIframe.id = 'videoPlayer';
    newIframe.className = 'w-full h-full absolute top-0 left-0';
    newIframe.src = url;
    newIframe.frameborder = '0';
    newIframe.allowfullscreen = true;

    if (isSandboxMode) {
        newIframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-pointer-lock');
    } else {
        newIframe.removeAttribute('sandbox');
    }

    iframeContainer.innerHTML = '';
    iframeContainer.appendChild(newIframe);
    videoPlayer = newIframe;

    startParseProgressTracking();
}

async function playTrailer() {
    if (!currentItemData) return;
    const url = await fetchTrailer(currentItemData.id, currentType);
    if (url) {
        const newIframe = document.createElement('iframe');
        newIframe.id = 'videoPlayer';
        newIframe.className = 'w-full h-full absolute top-0 left-0';
        newIframe.src = url;
        newIframe.frameborder = '0';
        newIframe.allowfullscreen = true;
        newIframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        newIframe.removeAttribute('sandbox');

        iframeContainer.innerHTML = '';
        iframeContainer.appendChild(newIframe);
        videoPlayer = newIframe;
        stopParseProgressTracking();
    } else {
        alert('No trailer found for this title.');
    }
}

function toggleMediaType(type) {
    currentType = type;
    currentPage = 1;
    const movieBtn = document.getElementById('showMoviesBtn');
    const tvBtn = document.getElementById('showTvBtn');
    if (type === 'movie') {
        movieBtn.classList.add('active');
        movieBtn.classList.remove('inactive');
        tvBtn.classList.remove('active');
        tvBtn.classList.add('inactive');
    } else {
        tvBtn.classList.add('active');
        tvBtn.classList.remove('inactive');
        movieBtn.classList.remove('active');
        movieBtn.classList.add('inactive');
    }
    updateUI();
}

function toggleNewReleaseMediaType(type) {
    newReleaseType = type;
    const movieBtn = document.getElementById('showNewReleaseMoviesBtn');
    const tvBtn = document.getElementById('showNewReleaseTvBtn');
    if (type === 'movie') {
        movieBtn.classList.add('active');
        movieBtn.classList.remove('inactive');
        tvBtn.classList.remove('active');
        tvBtn.classList.add('inactive');
    } else {
        tvBtn.classList.add('active');
        tvBtn.classList.remove('inactive');
        movieBtn.classList.remove('active');
        movieBtn.classList.add('inactive');
    }
    updateNewReleasesUI();
}

function scrollAndLoad(action) {
    const gallerySection = document.getElementById('galleryContainer');
    if (gallerySection) {
        gallerySection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    if (action === 'prev') {
        if (currentPage > 1) {
            currentPage--;
            updateUI();
        }
    } else if (action === 'next') {
        currentPage++;
        updateUI();
    }
}

// Event listeners
searchInput.addEventListener('input', () => {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    updateUI();
});

showMoviesBtn.addEventListener('click', () => toggleMediaType('movie'));
showTvBtn.addEventListener('click', () => toggleMediaType('tv'));

// ADDED EVENT LISTENERS FOR BOTTOM BUTTONS
prevPageBtn.addEventListener('click', () => {
    scrollAndLoad('prev');
});
prevPageBottomBtn.addEventListener('click', () => {
    scrollAndLoad('prev');
});

nextPageBtn.addEventListener('click', () => {
    scrollAndLoad('next');
});
nextPageBottomBtn.addEventListener('click', () => {
    scrollAndLoad('next');
});

sourceSelector.addEventListener('change', updatePlayer);
trailerBtn.addEventListener('click', playTrailer);
seasonSelect.addEventListener('change', (e) => populateEpisodeSelect(e.target.value));
episodeSelect.addEventListener('change', updatePlayer);
prevEpisodeBtn.addEventListener('click', () => {
    let currentSeason = parseInt(seasonSelect.value);
    let currentEpisode = parseInt(episodeSelect.value);
    const seasonData = currentItemData.seasons.find(s => s.season_number === currentSeason);
    if (currentEpisode > 1) {
        episodeSelect.value = currentEpisode - 1;
    } else if (currentSeason > 1) {
        const prevSeason = currentItemData.seasons.find(s => s.season_number === currentSeason - 1);
        if (prevSeason) {
            seasonSelect.value = prevSeason.season_number;
            populateEpisodeSelect(prevSeason.season_number, prevSeason.episodes.length);
        }
    }
});
nextEpisodeBtn.addEventListener('click', () => {
    let currentSeason = parseInt(seasonSelect.value);
    let currentEpisode = parseInt(episodeSelect.value);
    const seasonData = currentItemData.seasons.find(s => s.season_number === currentSeason);
    if (seasonData && currentEpisode < seasonData.episodes.length) {
        episodeSelect.value = currentEpisode + 1;
    } else {
        const nextSeason = currentItemData.seasons.find(s => s.season_number === currentSeason + 1);
        if (nextSeason) {
            seasonSelect.value = nextSeason.season_number;
            populateEpisodeSelect(nextSeason.season_number, 1);
        }
    }
});

// ===========================================
// ===== MODIFIED SANDBOX BEHAVIOR HERE ======
// ===========================================
showNoSandboxBtn.addEventListener('click', () => {
    isSandboxMode = true;
    populateSourceSelector();
    showNoSandboxBtn.classList.add('active', 'ring-2', 'ring-purple-300');
    showSandboxBtn.classList.remove('active', 'ring-2', 'ring-purple-300');
    showNoSandboxBtn.classList.remove('inactive');
    showSandboxBtn.classList.add('inactive');
});
showSandboxBtn.addEventListener('click', () => {
    isSandboxMode = false;
    populateSourceSelector();
    showSandboxBtn.classList.add('active', 'ring-2', 'ring-purple-300');
    showNoSandboxBtn.classList.remove('active', 'ring-2', 'ring-purple-300');
    showSandboxBtn.classList.remove('inactive');
    showNoSandboxBtn.classList.add('inactive');
});
// ===========================================
// ===========================================
//9.11.25 ====================================

modalCloseBtn.addEventListener('click', closeModal);
videoModal.addEventListener('click', (e) => {
    if (e.target.id === 'videoModal') closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('visible')) closeModal();
});

// New Release List Event Listeners
prevReleaseDayBtn.addEventListener('click', () => {
    currentReleaseDate.setDate(currentReleaseDate.getDate() - 1);
    updateNewReleasesUI();
});

nextReleaseDayBtn.addEventListener('click', () => {
    currentReleaseDate.setDate(currentReleaseDate.getDate() + 1);
    updateNewReleasesUI();
});

showNewReleaseMoviesBtn.addEventListener('click', () => toggleNewReleaseMediaType('movie'));
showNewReleaseTvBtn.addEventListener('click', () => toggleNewReleaseMediaType('tv'));


document.addEventListener('DOMContentLoaded', () => {
    isSandboxMode = true;
    populateSourceSelector();
    updateUI();
    loadContinueWatchingParse();

    currentReleaseDate = new Date();

    updateNewReleasesUI();
});

function formatTime(seconds) {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
        return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// New function to fetch TV episode details
async function fetchTVShowDetailsWithEpisodes(id, date) {
    try {
        const url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        const formattedDate = date.toISOString().split('T')[0];

        if (data.seasons) {
            for (const season of data.seasons) {
                const seasonUrl = `${BASE_URL}/tv/${id}/season/${season.season_number}?api_key=${API_KEY}`;
                const seasonRes = await fetch(seasonUrl);
                const seasonData = await seasonRes.json();
                if (seasonData.episodes) {
                    const matchingEpisode = seasonData.episodes.find(ep => ep.air_date === formattedDate);
                    if (matchingEpisode) {
                        return {
                            season: season.season_number,
                            episode: matchingEpisode.episode_number
                        };
                    }
                }
            }
        }
        return null;
    } catch (error) {
        console.error("TMDB TV Episode Fetch Error: " + error.message);
        return null;
    }
}
