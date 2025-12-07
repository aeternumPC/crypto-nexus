new TradingView.widget({
    "container_id": "tradingview-chart",
    "width": "100%",
    "height": "500",
    "symbol": "BINANCE:BTCUSDT",
    "interval": "15",
    "timezone": "Etc/UTC",
    "theme": "dark",
    "style": "1",
    "locale": "en",
    "toolbar_bg": "#f1f3f6",
    "enable_publishing": false,
    "hide_side_toolbar": false,
    "allow_symbol_change": true,
    "details": true,
    "studies": ["Volume@tv-basicstudies"],
    "show_popup_button": true,
    "popup_width": "1000",
    "popup_height": "650"
});


async function fetchCryptoData() {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
        );
        const data = await response.json();
        updateCryptoTable(data);
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        document.querySelector('#crypto-table tbody').innerHTML = 
            '<tr><td colspan="4" class="text-center text-danger">Failed to load data</td></tr>';
    }
}


function updateCryptoTable(data) {
    const tableBody = document.querySelector('#crypto-table tbody');
    tableBody.innerHTML = '';

    data.forEach((coin, index) => {
        const changeClass = coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
        const changeIcon = coin.price_change_percentage_24h >= 0 ? '▲' : '▼';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <img src="${coin.image}" alt="${coin.name}" width="20" height="20" class="me-2">
                <strong>${coin.symbol.toUpperCase()}</strong>
                <br><small class="text-muted">${coin.name}</small>
            </td>
            <td>$${coin.current_price.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
            <td class="${changeClass}">
                ${changeIcon} ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </td>
        `;
        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchCryptoData();
    setInterval(fetchCryptoData, 60000); 
});


function showNotification(message) {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
        new Notification("Crypto Nexus Alert", { body: message });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Crypto Nexus Alert", { body: message });
            }
        });
    }
}


setTimeout(() => {
    showNotification("Crypto Nexus is live! Tracking 10 cryptocurrencies.");
}, 10000);
