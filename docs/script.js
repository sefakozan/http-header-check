document.getElementById('headerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const urlInput = document.getElementById('urlInput').value;
    const errorDiv = document.getElementById('error');
    const resultsDiv = document.getElementById('results');
    const headerTable = document.getElementById('headerTable');
    const urlDisplay = document.getElementById('urlDisplay');

    // Clear previous results and errors
    errorDiv.classList.add('d-none');
    resultsDiv.classList.add('d-none');
    headerTable.innerHTML = '';

    try {
        // Make a direct GET request to the provided URL
        const response = await fetch(urlInput, {
            method: 'GET',
            mode: 'cors', // CORS modunu etkinleştir
            headers: {
                'Accept': '*/*'
            }
        });

        // Get headers from the response
        const headers = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });

        // Display headers
        urlDisplay.textContent = urlInput;
        for (const [header, value] of Object.entries(headers)) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${header}</td><td>${value}</td>`;
            headerTable.appendChild(row);
        }
        resultsDiv.classList.remove('d-none');
    } catch (err) {
        errorDiv.textContent = 'Error: Unable to fetch headers. Ensure the URL is valid and CORS is allowed.';
        errorDiv.classList.remove('d-none');
        console.error('Fetch error:', err);
    }
});