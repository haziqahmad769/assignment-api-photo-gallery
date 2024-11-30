//insert api key here
const apiKey = '8L72Jii3WwGi3d0BaPnzPxnzLSlvwpgEzqbap7AS1Do4OTR3S5knUqNq';

// selectors
const searchForm = document.getElementById('search-form');
const searchResult = document.getElementById('result');

let sentinelObserver;
let currentQuery = '';
let currentPage = 1;

// event listeners
const setupListeners = () => {
    searchForm.addEventListener('submit', onSearchFormSubmit);
}

// event handlers
const onSearchFormSubmit = (e) => {
    e.preventDefault();

    const query = searchForm.query.value.trim();

    if(!query) {
        alert('Please provide valid search keywords');
        return;
    }

    // Reset for new search
    currentQuery = query;
    currentPage = 1;
    searchResult.innerHTML = "";
    removeObserver();

    fetchImages(query);
}

// fetch images function using promise based function
const fetchImages = (query, page = 1) => {
    showLoading();

    fetch(`https://api.pexels.com/v1/search?query=${query}&page=${page}&orientation=landscape`, {
        headers: {
            'Authorization': apiKey
        }
    })
    .then(response => response.json())
    .then(body => { 
        if(body.total_results === 0) {
            searchResult.innerHTML = `<div class="text-center">No images found.</div>`;
            return;
        }

        // display images
        body.photos.forEach((photo) => {
            searchResult.innerHTML += `
                <div class="col-lg-4 col-sm-6 d-flex flex-column justify-content-center aligns-item-center gy-4">
                    <a class="d-flex flex-column justify-content-center align-items-center text-decoration-none" href="${photo.url}">
                        <img src="${photo.src.medium}" alt="${photo.alt}" class="rounded img-fluid">
                        <div class="image-content">
                            <h3 class="figure-caption">&#128247 ${photo.photographer}</h3>
                        </div>
                    </a>
                </div>`;
        });

        // set up infinite scroll
        createObserver(body);
    })
    .finally(hideLoading)
    .catch(err => {
        console.error('Error fetching images:', err);
        hideLoading();
    });
}

// create intersection observer
const createObserver = (data) => {
    // Remove previous observer
    removeObserver();

    // only create observer if there's a next page
    if(data.next_page) {
        // Create sentinel element
        const sentinel = document.createElement('div');
        sentinel.id = 'sentinel';
        sentinel.style.height = '10px';
        document.querySelector('.container').appendChild(sentinel);

        // Initialize intersection observer
        sentinelObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if(entry.isIntersecting) {
                    currentPage++;
                    fetchImages(currentQuery, currentPage);
                }
            });
        }, {
            threshold: 0.1 // Trigger when a small portion is visible
        });

        // start observing sentinel
        sentinelObserver.observe(sentinel);
    }
}

// remove existing observer
const removeObserver = () => {
    const sentinel = document.getElementById('sentinel');
    sentinel && sentinel.remove();

    if(sentinelObserver){
        sentinelObserver.disconnect();
        sentinelObserver = null;
    }
}

// loading indicator functions
const showLoading = () => {
    const div = document.createElement("div");
    div.innerHTML = `
        <div id="loader" class="d-flex justify-content-center" style="position: fixed; inset: 0; z-index: 10; background: rgba(0,0,0,0.5);">
            <div class="spinner-border text-warning" role="status" style="align-self: center;">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`;

    document.body.prepend(div);
}

const hideLoading = () => {
    const loader = document.querySelector("#loader");
    loader && loader.remove();
}

// initialize
setupListeners();