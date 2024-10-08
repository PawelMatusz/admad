document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'e84fd75c';

    const titleInput = document.querySelector('[data-input]');
    const typeSelect = document.querySelector('[data-select]');
    const tbody = document.querySelector('[data-table-body]');
    const templateRow = document.querySelector('[data-table-row]');
    const totalReults = document.querySelector('[data-total-results]');

    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    async function searchMovies() {
        const title = titleInput.value.trim();
        const type = typeSelect.value;

        tbody.innerHTML = '';
        tbody.appendChild(templateRow);

        if (title === '') {
            return;
        }

        try {
            const searchResponse = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(title)}&type=${type}`);
            const searchData = await searchResponse.json();

            if (searchData.Response === "True") {
                const promises = searchData.Search.map(async (movie) => {
                    const detailsResponse = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`);
                    const details = await detailsResponse.json();

                    const newRow = templateRow.cloneNode(true);
                    newRow.style.display = '';
                    newRow.querySelector('.title').textContent = details.Title;
                    newRow.querySelector('.year').textContent = details.Year;
                    newRow.querySelector('.country').textContent = details.Country;
                    newRow.querySelector('.type').textContent = details.Type;
                    tbody.appendChild(newRow);
   
                });
                await Promise.all(promises);

            } else {
                const newRow = templateRow.cloneNode(true);
                newRow.style.display = '';
                const titleCell = newRow.querySelector('.title');
                titleCell.setAttribute('colspan', '4');
                titleCell.textContent = 'Brak wyników.';

                newRow.querySelector('.year').remove();
                newRow.querySelector('.country').remove();
                newRow.querySelector('.type').remove();
                tbody.appendChild(newRow);
            }
            console.log(searchData);
            totalReults.textContent = await searchData.totalResults;

        } catch (error) {
            console.error('Błąd:', error);
        }
    }

    const debouncedSearch = debounce(searchMovies, 500);

    titleInput.addEventListener('input', debouncedSearch);
    typeSelect.addEventListener('change', debouncedSearch);
});
