let currentPage = 1;
let MOVIE_LIST = [];

// ---- SELECTORS------

const movieListContainer = document.getElementById("movie-list");

//Search Bar Elements---

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

//Sorting Options BUttons---

const sortByDateElement = document.getElementById("sort-by-date");
const sortByRatingElement = document.getElementById("sort-by-rting");

//Tabs Buttons selectors---

const allTabBtn = document.getElementById("all-tab");
const favoritesTabBtn = document.getElementById("favorites-tab");

//Pagination Button selectors

const prevBtn = document.getElementById("prev-btn");
const currentPageNumberBtn = document.getElementById("current-page-number-btn");
const nextBtn = document.getElementById("next-btn");

//1. Fetch the DAta-----

function remapData(movieList = []){   
    //remapping coz we dont need all of movieList only few like id,etc
    const modifiedList = movieList.map((movieObj)=>{
        return{
            id:movieObj.id,
            popularity:movieObj.popularity,
            voteAverage:movieObj.vote_average,
            title:movieObj.title,
            posterPath:movieObj.poster_path
        };
    });

    return modifiedList;
}

async function fetchData(pageNumber,sortingOption){
    let url = "";
    if(sortingOption){
        url = `https://api.themoviedb.org/3/discover/movie?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${pageNumber}&sort_by=popularity.desc `;
    }else{
        url = `https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${pageNumber}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);
    const results = data["results"]; //all data of id,title,rating etc
    const modifiedList = remapData(results);

    MOVIE_LIST = modifiedList;
    return modifiedList;  //consoles and returns all data ofid,title,rating etc
}

//Rendering the Data ;Render - displaying output

function renderMovies(movieList = []){
    console.log(movieList);

    movieList.forEach((movie)=>{
        const { id } = movie;
        const movieCardHTMLElement = createCardForMovie(movie);
        movieListContainer.append(movieCardHTMLElement);//movieListContainer= div of movie-list

        const heartElement = document.getElementById(`icon${id}`);

        heartElement.addEventListener("click",(event)=>{
            const movieIdILiked = event.target.id;
            const isFavMovie = heartElement.classList.contains("fa-heart");
            if(isFavMovie){
                //removing or making unfav
                removeMovieFromLocalStorage(movieIdILiked);

                heartElement.classList.add("fa-heart-o");
                heartElement.classList.remove("fa-heart");
            }else{
                //making fav
                //setting to local storage
                setMoviesToLocalStorage(id);

                heartElement.classList.remove("fa-heart-o");
                heartElement.classList.add("fa-heart-")
            }
        });
        //Determine if each movie is fav or not
        const favMovies = getMoviesToLocalStorage;
        const isFavMovie = favMovies.includes(id);

        if(isFavMovie){
            heartElement.classList.remove("fa-heart-o");
            heartElement.classList.add("fa-heart");
        }
    });
}

function createCardForMovie(movie){
    const {id,title,popularity,posterPath,voteAverage} = movie;
    const imageLink = `https://image.tmdb.org/t/p/original/${posterPath}`;

    const cardContainerElement = document.createElement("div");
    cardContainerElement.id = id;
    cardContainerElement.classList.add("card");

    cardContainerElement.innerHTML = `
    <section>
        <img class = "poster" src = ${imageLink} alt = "movie image"/>
    </section>
    <p classs = "title">
        ${title}
    </p>


    <section class = "votes-favorites">
        <section class = "votes">
            <p class = "vote-count">Votes:${voteAverage}</p>
            <p class = "popularity-count">Popularity:${popularity}</p>  
        </section>

        <section style = "cursor:pointer" id = "favorites${id}" class = "favorites">
            <i id = icon${id} class = fa fa-heart-o" aria-hidden = "true"></i>
        </section>
    </section>
    `;
    return cardContainerElement;

}

function clearMovies(){
    movieListContainer.innerHTML = "";
}

async function fecilitator(sortingOptions = false){
    const data = await fetchData(currentPage,sortingOptions);
    clearMovies();
    renderMovies(data);
    
    allTabBtn.classList.add("active-tab");
}

fecilitator();

//Pagination

// ---------On click event listeners-----

prevBtn.addEventListener("click",()=>{
    currentPage--;
    fecilitator();

    currentPageNumberBtn.innerHTML = `Current Page:${currentPage}`;
});


nextBtn.addEventListener("click",()=>{
    currentPage++;
    fecilitator();

    currentPageNumberBtn.innerHTML = `Current Page:${currentPage}`;
});

//Sorting options 

sortByRatingElement.addEventListener("click",()=>{

    sortByRatingElement.classList.toggle("sort-button-active");

    if(sortByRatingElement.classList.contains("sort-button-active")){
        fecilitator(true);
    }else{
        fecilitator(false);
    }
});

//Tabs

function displayMoviesForSwitchTab(element){

    const id = element.id;
    if(id === all-tab){
        sortByRatingElement.style.display = "block";
        sortByDateElement.style.display = "block";
        fecilitator();
    }else if(id === favorites-tab){
        clearMovies();

        const favMovieListIds = getMoviesToLocalStorage();

        const FavMovieList = MOVIE_LIST.filter((movie)=>{
            const {id} = movie;
            return favMovieListIds.includes(id);
        });
        renderMovies(FavMovieList);

        sortByRatingElement.style.display = "none";
        sortByDateElement.style.display = "none";
    }else{

    }
}

function switchTabs(event){
    allTabBtn.classList.remove("active-tab");
    favoritesTabBtn.classList.remove("active-tab");

    const element = event.target;
    element.classList.add("active-tab");

    displayMoviesForSwitchTab(element);
}

allTabBtn.addEventListener("click",switchTabs);
favoritesTabBtn.addEventListener("click",switchTabs);

function setMoviesToLocalStorage(newFavMovie){
    const prevFavMovies = getMoviesToLocalStorage();
    const arrayOfFavMovies = [...prevFavMovies,newFavMovie];
    localStorage.setItem("favMovie",JSON.stringify(arrayOfFavMovies));
}

function getMoviesToLocalStorage(){

    const allFavMovieObj = JSON.parse(localStorage.getItem("favMovie"));
    if(!allFavMovieObj){
        return [];
    }else{
        return allFavMovieObj;
    }
}

function removeMovieFromLocalStorage(){
    const allFavMovieObj = getMoviesToLocalStorage();
    const filteredMovies = allFavMovieObj.filter(
        (ids) => Number(ids) !== Number(String(id).subString(4))
    );
    localStorage.setItem(("favMovie"),JSON.stringify(filteredMovies));
}
