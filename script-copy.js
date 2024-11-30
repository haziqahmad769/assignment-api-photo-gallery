// selectors
const searchForm = document.getElementById('search-form');
const searchResult = document.getElementById('result');


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
    
    // fetch( `https://api.pexels.com/v1/search?query=${query}&orientation=landscape`, {
    //     headers: {
    //         'Authorization': '8L72Jii3WwGi3d0BaPnzPxnzLSlvwpgEzqbap7AS1Do4OTR3S5knUqNq'
    //     }
    // })
    //    .then(response => response.json())
    //    .then(body => { 
    //      const imageList = body.photos.map( (photo) => ( 
    //         `<div class="col-lg-4 col-sm-6 d-flex flex-column justify-content-center aligns-item-center gy-4">
    //             <a class="d-flex flex-column justify-content-center align-items-center" href="${photo.url}">
    //                 <img src="${photo.src.medium}" alt="${photo.alt}" class="rounded img-fluid">
    //             </a>
    //         </div>`
    //      )).join('');

    //      return imageList
    //    })
    //    .then(list => {
    //     // document.getElementById('result').innerHTML = list
    //     searchResult.innerHTML = list
    //    })
    //    .catch(err => {debugger})

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

        showLoading();

        fetch( `https://api.pexels.com/v1/search?query=${query}&orientation=landscape`, {
        headers: {
            'Authorization': '8L72Jii3WwGi3d0BaPnzPxnzLSlvwpgEzqbap7AS1Do4OTR3S5knUqNq'
        }
        })

       .then(response => response.json())

       .then(body => { 
         
        if(body.total_results === 0) {
            searchResult.innerHTML =`<div class="text-center"> No images found.</div>`;
    
            return;
        }
    
        if(body.page === 1) {
            searchResult.innerHTML = "";
        }
    
        body.photos.forEach((photo) => {
            searchResult.innerHTML += `
                <div class="col-lg-4 col-sm-6 d-flex flex-column justify-content-center aligns-item-center gy-4">
                    <a class="d-flex flex-column justify-content-center align-items-center text-decoration-none" href="${photo.url}">
                        <img src="${photo.src.medium}" alt="${photo.alt}" class="rounded img-fluid">
                        <div class="image-content">
                            <h3 class="figure-caption">&#128247 ${photo.photographer}</h3>
                        </div>
                    </a>
                </div>`

        });

       })

       .finally(hideLoading)

       .catch(err => {debugger})
   
}

//initialize
setupListeners();