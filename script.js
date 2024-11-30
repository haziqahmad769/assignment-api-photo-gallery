// selectors
const searchForm = document.getElementById('search-form');
const searchResult = document.getElementById('result');

let sentinelObserver;

// event listeners
const setupListeners = () => {
    searchForm.addEventListener('submit', onSearchFormSubmit);
}
// event handlers
const onSearchFormSubmit = (e) => {
    e.preventDefault();

    const query = searchForm.query.value.trim();

    if(!query) {
        alert('Invalid search input');

        return;
    }

    // console.log(query);
 
    const apiURL = `https://api.pexels.com/v1/search?query=${query}&orientation=landscape`;

    showLoading();

    fetchImages(apiURL).then((data) => displayResults(data)).finally(hideLoading);
    
}

// render functions
const displayResults = (data) => {
    console.log(data);

    //remove previous observer to prevent conflict
    removeObserver();

    if(data.total_results === 0) {
        searchResult.innerHTML =`<div class="text-center"> No images found.</div>`;

        return;
    }

    if(data.page === 1) {
        searchResult.innerHTML = "";
    }

    data.photos.forEach((photo) => {
        searchResult.innerHTML += `
            <div class="col-lg-4 col-sm-6 d-flex flex-column justify-content-center aligns-item-center gy-4">
                <a class="d-flex flex-column justify-content-center align-items-center" href="${photo.url}">
                    <img src="${photo.src.medium}" alt="${photo.alt}" class="rounded img-fluid">
                </a>
            </div>`
    });

    createObserver(data.next_page);
};

const showLoading = () => {
    // console.log('show loading')

    const div = document.createElement("div");
    div.innerHTML = `<div id="loader" class="d-flex justify-content-center" style="position: fixed; inset: 0; z-index: 10; background: rgba(0,0,0,0.5);">
        <div class="spinner-border" role="status" style="align-self: center;">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>`

      document.body.prepend(div);
}

const hideLoading = () => {
    // console.log('hide loading')

    const loader = document.querySelector("#loader");
    loader && loader.remove();
}

const createObserver = (nextPageURL) => {

    if(!nextPageURL) return;

    // create element to be observed
    const sentinel = document.createElement('div');
    sentinel.id = 'sentinel';
    //append element @ the end of image grid
    document.querySelector('.container').appendChild(sentinel);

    //initialize intersection observer
    sentinelObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting) {
                console.log('display more images');

                loadMoreResults(nextPageURL);
            }
        })
    })

    //connect element to observer
    sentinelObserver.observe(sentinel);

}

const removeObserver = () => {

    //remove observed elment
    const sentinel = document.getElementById('sentinel');
    sentinel && sentinel.remove();

    //diconnect observer
    if(sentinelObserver){
        sentinelObserver.disconnect();
        sentinelObserver = null;
    }

    
}


//helper functions
const fetchImages = async (apiURL) => {
    try {

        const response = await fetch( apiURL, {
            headers: {
                'Authorization': '8L72Jii3WwGi3d0BaPnzPxnzLSlvwpgEzqbap7AS1Do4OTR3S5knUqNq'
            }
        });

        if(!response.ok) {
            throw new Error(`HTTP Error! status=${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch Error', error);
    }
}

const loadMoreResults = (nextPageURL) => {
    showLoading();
  
    fetchImages(nextPageURL)
      .then((data) => displayResults(data))
      .finally(hideLoading);
  }

//initialize
setupListeners();


