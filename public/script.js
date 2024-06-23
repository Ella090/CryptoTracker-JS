class CryptoTracker {
    constructor() {
        this.apiUrl = 'https://api.coincap.io/v2/assets';
        this.cryptoListElement = document.getElementById('cryptoList');
        this.refreshButton = document.getElementById('refreshBtn');
        this.searchInput = document.getElementById('searchInput');
        this.cryptoData = [];

        this.refreshButton.addEventListener('click', this.fetchData.bind(this));
        this.searchInput.addEventListener('input', this.filterData.bind(this));
    }

    async fetchData() {
        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            this.cryptoData = data.data;
            this.displayData(this.cryptoData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    filterData() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filteredData = this.cryptoData.filter(crypto => crypto.name.toLowerCase().includes(searchTerm));
        this.displayData(filteredData);
    }

    displayData(cryptoData) {
        cryptoData.sort((a, b) => a.name.localeCompare(b.name));

        this.cryptoListElement.innerHTML = '';
        cryptoData.forEach(crypto => {
            const cryptoCard = this.createCryptoCard(crypto);
            this.cryptoListElement.appendChild(cryptoCard);
        });
    }

    createCryptoCard(crypto) {
        const { name, symbol, priceUsd, changePercent24Hr } = crypto;
        const card = document.createElement('div');
        card.classList.add('bg-slate-50','rounded', 'shadow-md', 'p-5', 'text-center', 'border', 'border-slate-200', 'font-opensans', 'text-blue-950');

        const title = document.createElement('h2');
        title.textContent = `${name} (${symbol})`;
        title.classList.add('text-lg', 'font-semibold', 'mb-2');
        card.appendChild(title);

        const price = document.createElement('p');
        price.textContent = `Price: $${parseFloat(priceUsd).toFixed(2)}`;
        card.appendChild(price);

        const change = document.createElement('p');
        change.innerHTML = `Change (24h): ${parseFloat(changePercent24Hr).toFixed(2)}% `;
        change.classList.add(changePercent24Hr < 0 ? 'text-red-500' : 'text-green-500');
        
        const icon = document.createElement('i');
        icon.classList.add('fas', changePercent24Hr < 0 ? 'fa-arrow-down' : 'fa-arrow-up', changePercent24Hr < 0 ? 'text-red-500' : 'text-green-500');
        change.appendChild(icon);
        
        card.appendChild(change);

        return card;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const cryptoTracker = new CryptoTracker();
    cryptoTracker.fetchData();
});
