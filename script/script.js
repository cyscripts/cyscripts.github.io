const styles = `
    @keyframes fadeInUp {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes pageLoadAnimation {
        0% {
            opacity: 0;
            transform: scale(0.95);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    body {
        margin: 0;
        padding: 0;
        background-color: #101321;
        color: white;
        font-family: Arial, sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        min-height: 100vh;
        text-align: center;
        overflow-y: scroll;
        animation: pageLoadAnimation 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        opacity: 0;
    }

    body::-webkit-scrollbar {
        width: 12px;
    }

    body::-webkit-scrollbar-track {
        background: #1a1d2e;
    }

    body::-webkit-scrollbar-thumb {
        background-color: #2a2f45;
        border-radius: 6px;
        border: 3px solid #1a1d2e;
    }

    body::-webkit-scrollbar-thumb:hover {
        background-color: #3a3f55;
    }

    h1 {
        font-size: 2.5rem;
        font-weight: bold;
        margin-top: 10vh;
        margin-bottom: 10px;
        animation: fadeInUp 0.7s ease-out 0.2s forwards;
        opacity: 0;
    }

    .search-container {
        position: relative;
        margin-top: 10px;
        width: 100%;
        max-width: 500px;
        animation: fadeInUp 0.7s ease-out 0.4s forwards;
        opacity: 0;
    }

    .search-bar {
        width: 100%;
        padding: 10px;
        font-size: 1rem;
        border: 2px solid #2a2f45;
        border-radius: 20px;
        background-color: #1a1d2e;
        color: white;
        outline: none;
        overflow: hidden;
    }

    .search-bar::placeholder {
        color: #6c757d;
    }

    .search-bar .loading-effect {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.15);
        z-index: 10;
    }

    .search-bar.loading .loading-effect {
        animation: searchLoadingAnimation 1.5s linear infinite;
    }

    @keyframes searchLoadingAnimation {
        0% {
            width: 0;
            left: 0;
        }
        50% {
            width: 100%;
            left: 0;
        }
        100% {
            width: 0;
            left: 100%;
        }
    }

    .box-container {
        display: grid;
        grid-template-columns: repeat(2, 380px);
        gap: 20px 60px;
        margin-top: 20px;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .box {
        width: 380px;
        padding: 20px;
        background-color: #1a1d2e;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        color: white;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
        animation: fadeInUp 0.7s ease-out forwards;
        opacity: 0;
    }

    .box:hover {
        transform: scale(1.03);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
    }

    .box:nth-child(1) { animation-delay: 0.6s; }
    .box:nth-child(2) { animation-delay: 0.7s; }
    .box:nth-child(3) { animation-delay: 0.8s; }
    .box:nth-child(4) { animation-delay: 0.9s; }

    .thumbnail {
        width: 100%;
        height: 180px;
        background-color: #2a2f45;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
        color: #6c757d;
        background-size: cover;
        background-position: center;
    }

    .name {
        margin-top: 15px;
        font-size: 1.5rem;
        font-weight: bold;
    }

    .no-matches {
        margin-top: 20px;
        font-size: 1.2rem;
        color: #6c757d;
    }

    .single-result {
        grid-column: 1 / -1;
        justify-self: center;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

document.body.innerHTML = `
    <h1>What Script Are You Looking For?</h1>
    <div class="search-container">
        <input type="text" class="search-bar" placeholder="Type Script Name Here...">
        <div class="loading-effect"></div>
    </div>
    <div id="box-container" class="box-container"></div>
    <div id="no-matches" class="no-matches"></div>
`;

const searchBar = document.querySelector('.search-bar');
const boxContainer = document.getElementById('box-container');
const noMatches = document.getElementById('no-matches');
const loadingEffect = document.querySelector('.loading-effect');

let scriptsData = [];

async function fetchData() {
    try {
        const response = await fetch('https://cyscripts.github.io/IPJUQ9GXE4TTK.txt');
        if (!response.ok) throw new Error('Failed to fetch data');
        const base64 = await response.text();
        const json = atob(base64);
        scriptsData = JSON.parse(json);
    } catch (error) {
        noMatches.textContent = 'Error loading data. Please try again later.';
    }
}

function filterScripts(query) {
    if (query.trim() === '') {
        searchBar.classList.remove('loading');
        boxContainer.innerHTML = '';
        noMatches.textContent = '';
        return;
    }

    searchBar.classList.add('loading');
    noMatches.textContent = '';

    setTimeout(() => {
        const filteredScripts = scriptsData.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );

        boxContainer.innerHTML = '';

        if (filteredScripts.length === 0) {
            noMatches.textContent = 'No matches found.';
        } else {
            filteredScripts.forEach((item) => {
                const box = document.createElement('div');
                box.className = 'box' + (filteredScripts.length === 1 ? ' single-result' : '');

                const thumbnail = document.createElement('div');
                thumbnail.className = 'thumbnail';
                thumbnail.style.backgroundImage = `url('${item.thumbnail}')`;

                const name = document.createElement('div');
                name.className = 'name';
                name.textContent = item.name;

                box.appendChild(thumbnail);
                box.appendChild(name);
                boxContainer.appendChild(box);

                box.addEventListener('click', () => {
                    box.style.animation = 'glowingBorder 1.5s infinite';
                    setTimeout(() => {
                        window.location.href = item.link || 'https://example.com';
                    }, 2000);
                });
            });
        }
        searchBar.classList.remove('loading');
    }, 300);
}

searchBar.addEventListener('input', (e) => {
    filterScripts(e.target.value);
});

fetchData();