const searchButton = document.getElementById('search-button');
const overlay = document.getElementById('modal-overlay');
const movieName = document.getElementById('movie-name');
const movieyear = document.getElementById('movie-year');
const movieListContainer = document.getElementById('movie-list');

//let movieList = [];
let movieList = JSON.parse(localStorage.getItem('movieList')) ?? [];

async function searchbuttonClickHandler()  {
    try {
        let url =`http://www.omdbapi.com/?apikey=${key}&t=${movienameparamatergenerator()}${movieYearParameterGenerator()}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log('data: ', data);
        if(data.Error){
            throw new Error("Filme não encontrado")
        }
        createModal(data);
        overlay.classList.add('open');
    }  catch (error) {
    notie.alert({type: 'error',text: error.message});
}}

function  movienameparamatergenerator () {
    if(movieName.value === ''){
        throw new Error("o nome do Filme deve ser informado");
    }
    return movieName.value
        .split(' ')
        .join('+');
}

function movieYearParameterGenerator(){
    if (movieyear.value === ''){
        return '';
    }
    if (movieyear.value.length !== 4 || Number.isNaN(Number(movieyear.value))) {
        throw new Error('Ano do filme invalido.');
    }
    return `&y=${movieyear.value}`;
}


function addtolist(movieObject){
    movieList.push(movieObject);
}

function isMovieAlreadyOnList(id) {
    function DoesThisIdBeLongToThisMovie(movieObject){
        return movieObject.imdbID === id;
    }
    return Boolean(movieList.find(DoesThisIdBeLongToThisMovie));

}

function updateUI(movieObject){
    movieListContainer.innerHTML += `<article id= "movie-card-${movieObject.imdbID}">
    <img src="${movieObject.Poster}"
    alt="Poster de ${movieObject.Title}."
    />
    <button class="remove-button" onclick="{removeFilmFromList('${movieObject.imdbID}')}">
    <i class="bi bi-trash"></i>Remover
    </button>
</article>`;
}

function removeFilmFromList(id){
    notie.confirm({
        text: 'Deseja Remover o filme de sua Lista?',
        submitText: "Sim",
        cancelText: "Não",
        position: "top",
        submitCallback: function removeMovie(){movieList = movieList.filter(movie => movie.imdbID !== id);
            document.getElementById(`movie-card-${id}`).remove();
            updateLocalStorage();

        }
    })

}

function updateLocalStorage(){
    localStorage.setItem('movieList', JSON.stringify(movieList));
}

for (const movieInfo of movieList){
    updateUI(movieInfo);
}
searchButton.addEventListener('click', searchbuttonClickHandler);

