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

    const BASE_URL = 'http://127.0.0.1:3000';

    try {
        // Send POST request to backend
        const response = await fetch(`${BASE_URL}/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `url=${encodeURIComponent(urlInput)}`
        });

        const data = await response.json();

        if (response.ok) {
            // Display headers
            urlDisplay.textContent = urlInput;
            for (const [header, value] of Object.entries(data.headers)) {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${header}</td><td>${value}</td>`;
                headerTable.appendChild(row);
            }
            resultsDiv.classList.remove('d-none');
        } else {
            // Show error
            errorDiv.textContent = data.error || 'Failed to fetch headers';
            errorDiv.classList.remove('d-none');
        }
    } catch (err) {
        errorDiv.textContent = 'An error occurred. Please try again.';
        errorDiv.classList.remove('d-none');
    }
});