'use strict';

// Get elements from HTML
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const errorMessage = document.getElementById('error-message');
const resultsTable = document.getElementById('results-table');
const noResultsMessage = document.getElementById('no-results-message');

// Button handler with Enter button option
searchButton.addEventListener('click', searchRepositories);
searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchRepositories();
    }
});

function searchRepositories() {
    const searchValue = searchInput.value.trim();

    // Validation for input
    if (searchValue.length < 3) {
        errorMessage.innerHTML = 'Enter at least 3 characters';
        searchInput.classList.add('error');
        return false;
    } else {
        errorMessage.innerHTML = '';
        searchInput.classList.remove('error');
    }

    // Fetch and handling API data
    fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=10`)
        .then(response => response.json())
        .then(data => {
            
            // Making table head after searching start for better look
            const thead = resultsTable.querySelector('thead');
            thead.style.display = 'table-header-group';

            // Nothing found condition
            if (data.items.length == 0) {
                noResultsMessage.innerHTML = 'Nothing found';
                resultsTable.style.display = 'none';
                return false;
            } else {
            noResultsMessage.innerHTML = '';
            resultsTable.style.display = 'table';
            }
            
            // Making table body
            const tbody = resultsTable.querySelector('tbody');
            tbody.innerHTML = '';
            
            data.items.forEach(item => {
                const tr = document.createElement('tr');
     
                const nameTd = document.createElement('td');
                const nameLink = document.createElement('a');
                nameLink.href = item.html_url;
                nameLink.target = '_blank';
                nameLink.innerText = item.name;
                nameTd.appendChild(nameLink);
     
                const starsTd = document.createElement('td');
                starsTd.innerText = item.stargazers_count;

                const updatedTd = document.createElement('td');
                updatedTd.innerText = new Date(item.updated_at).toLocaleDateString();
     
                tr.appendChild(nameTd);
                tr.appendChild(starsTd);
                tr.appendChild(updatedTd);
     
                tbody.appendChild(tr);
            });
        })
    
    // Handling errors
    .catch(error => console.error(error));
}