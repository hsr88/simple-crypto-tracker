// URL do API CoinGecko
// Pobieramy: vs USD, sortujemy po MarketCap, pierwsze 20 sztuk, z procentową zmianą 24h
const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false';

const container = document.getElementById('crypto-container');

// Główna funkcja asynchroniczna
async function getCryptoData() {
    try {
        // 1. Pobieranie danych
        const response = await fetch(API_URL);
        
        // Sprawdzenie czy API odpowiedziało poprawnie
        if (!response.ok) throw new Error('Problem z połączeniem z API');
        
        // Zamiana odpowiedzi na JSON (tablica obiektów)
        const data = await response.json();

        // 2. Wyczyszczenie kontenera (usuwamy loader)
        container.innerHTML = '';

        // 3. Pętla po każdej walucie
        data.forEach(coin => {
            // Tworzymy kartę HTML dla każdej waluty
            createCoinCard(coin);
        });

    } catch (error) {
        console.error('Błąd:', error);
        container.innerHTML = '<p style="text-align:center; color:red;">Nie udało się pobrać danych. Spróbuj za chwilę.</p>';
    }
}

function createCoinCard(coin) {
    const changeClass = coin.price_change_percentage_24h >= 0 ? 'green' : 'red';
    // Plusik tylko dla estetyki tekstu
    const sign = coin.price_change_percentage_24h >= 0 ? '+' : '';

    const card = document.createElement('div');
    card.classList.add('coin-card');

    card.innerHTML = `
        <div class="coin-info">
            <img src="${coin.image}" alt="${coin.name}">
            <div class="coin-name">
                <h3>${coin.name}</h3>
                <span>${coin.symbol}</span>
            </div>
        </div>
        <div class="coin-price">
            <span class="current-price">$${coin.current_price.toLocaleString()}</span>
            <span class="price-change ${changeClass}">
                ${sign}${coin.price_change_percentage_24h.toFixed(2)}%
            </span>
        </div>
    `;

    container.appendChild(card);
}

// Uruchomienie przy starcie strony
getCryptoData();

// Odświeżanie danych co 60 sekund (opcjonalne)
setInterval(getCryptoData, 60000);