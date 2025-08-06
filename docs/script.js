// Professional HTTP Header Analyzer JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

document.getElementById('headerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const urlInput = document.getElementById('urlInput').value;
    const errorDiv = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const headerTable = document.getElementById('headerTable');
    const urlDisplay = document.getElementById('urlDisplay');
    const timestampSpan = document.getElementById('timestamp');

    // Clear previous results and errors
    errorDiv.classList.add('d-none');
    resultsDiv.classList.add('d-none');
    loadingDiv.classList.remove('d-none');
    headerTable.innerHTML = '';

    // Use relative URL for API calls - works both locally and on Vercel
    const BASE_URL = window.location.origin;

    try {
        // Send POST request to backend
        const response = await fetch(`${BASE_URL}/api/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: urlInput })
        });

        const data = await response.json();
        loadingDiv.classList.add('d-none');

        if (response.ok) {
            // Display headers
            urlDisplay.textContent = urlInput;
            timestampSpan.textContent = new Date().toLocaleString();
            
            // Sort headers alphabetically for better organization
            const sortedHeaders = Object.entries(data.headers).sort(([a], [b]) => a.localeCompare(b));
            
            sortedHeaders.forEach(([header, value]) => {
                const row = document.createElement('tr');
                row.className = 'fade-in';
                
                // Escape HTML and format the value
                const escapeHtml = (unsafe) => {
                    return unsafe
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#039;");
                };
                
                const formattedValue = escapeHtml(String(value));
                const headerInfo = getHeaderInfo(header);
                
                row.innerHTML = `
                    <td>
                        <div class="d-flex align-items-center">
                            <i class="${headerInfo.icon} me-2 text-${headerInfo.type}"></i>
                            <span class="fw-bold">${escapeHtml(header)}</span>
                        </div>
                        ${headerInfo.description ? `<small class="text-muted d-block mt-1">${headerInfo.description}</small>` : ''}
                    </td>
                    <td>
                        <span class="header-value">${formattedValue}</span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm action-btn" 
                                onclick="copyToClipboard('${escapeHtml(value)}')"
                                data-bs-toggle="tooltip" 
                                title="Copy value">
                            <i class="bi bi-clipboard"></i>
                        </button>
                    </td>
                `;
                headerTable.appendChild(row);
            });
            
            resultsDiv.classList.remove('d-none');
            resultsDiv.classList.add('slide-up');
            
            // Initialize new tooltips
            const newTooltips = resultsDiv.querySelectorAll('[data-bs-toggle="tooltip"]');
            newTooltips.forEach(el => new bootstrap.Tooltip(el));
            
        } else {
            // Show error
            errorMessage.textContent = data.error || 'Failed to fetch headers';
            errorDiv.classList.remove('d-none');
            errorDiv.classList.add('slide-up');
        }
    } catch (err) {
        loadingDiv.classList.add('d-none');
        errorMessage.textContent = 'Network error occurred. Please check your connection and try again.';
        errorDiv.classList.remove('d-none');
        errorDiv.classList.add('slide-up');
    }
});

// Header information database
function getHeaderInfo(headerName) {
    const headerLower = headerName.toLowerCase();
    const headerDatabase = {
        'content-type': {
            icon: 'bi-file-earmark-text',
            type: 'primary',
            description: 'Media type of the resource'
        },
        'content-length': {
            icon: 'bi-rulers',
            type: 'info',
            description: 'Size of the response body in bytes'
        },
        'cache-control': {
            icon: 'bi-arrow-repeat',
            type: 'warning',
            description: 'Caching directives for the response'
        },
        'set-cookie': {
            icon: 'bi-cookie',
            type: 'secondary',
            description: 'HTTP cookies sent by the server'
        },
        'server': {
            icon: 'bi-server',
            type: 'success',
            description: 'Information about the server software'
        },
        'date': {
            icon: 'bi-calendar-event',
            type: 'info',
            description: 'Date and time the response was sent'
        },
        'last-modified': {
            icon: 'bi-clock-history',
            type: 'secondary',
            description: 'Last modification date of the resource'
        },
        'etag': {
            icon: 'bi-fingerprint',
            type: 'primary',
            description: 'Unique identifier for the resource version'
        },
        'location': {
            icon: 'bi-geo-alt',
            type: 'warning',
            description: 'URL to redirect to or location of created resource'
        },
        'x-powered-by': {
            icon: 'bi-lightning',
            type: 'info',
            description: 'Technology powering the server'
        },
        'access-control-allow-origin': {
            icon: 'bi-shield-check',
            type: 'success',
            description: 'CORS policy for allowed origins'
        },
        'strict-transport-security': {
            icon: 'bi-shield-lock',
            type: 'success',
            description: 'HTTPS enforcement policy'
        },
        'content-security-policy': {
            icon: 'bi-shield-exclamation',
            type: 'warning',
            description: 'Security policy for content loading'
        }
    };
    
    return headerDatabase[headerLower] || {
        icon: 'bi-info-circle',
        type: 'secondary',
        description: null
    };
}

// Copy to clipboard function
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Copied to clipboard!', 'success');
    }
}

// Export results function
function exportResults() {
    const urlDisplay = document.getElementById('urlDisplay').textContent;
    const timestamp = document.getElementById('timestamp').textContent;
    const headerTable = document.getElementById('headerTable');
    
    if (!headerTable.children.length) {
        showToast('No data to export', 'warning');
        return;
    }
    
    let exportData = `HTTP Headers Analysis Report\n`;
    exportData += `URL: ${urlDisplay}\n`;
    exportData += `Analyzed at: ${timestamp}\n`;
    exportData += `${'='.repeat(50)}\n\n`;
    
    Array.from(headerTable.children).forEach(row => {
        const cells = row.children;
        const headerName = cells[0].querySelector('.fw-bold').textContent;
        const headerValue = cells[1].querySelector('.header-value').textContent;
        exportData += `${headerName}: ${headerValue}\n`;
    });
    
    // Create and download file
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `http-headers-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showToast('Results exported successfully!', 'success');
}

// Toast notification function
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast-container');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    
    const toastElement = document.createElement('div');
    toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
    toastElement.setAttribute('role', 'alert');
    
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-check-circle-fill me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toastElement);
    document.body.appendChild(toastContainer);
    
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    // Clean up after toast is hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastContainer.remove();
    });
}