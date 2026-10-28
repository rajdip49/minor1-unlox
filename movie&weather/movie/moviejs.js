const url= "https://www.omdbapi.com/?apikey=a6606658"

let allmovies=[]

const searchdiv=document.getElementById("search")
const counter=document.getElementById("counter")
const container=document.getElementById("movie-card")
const searchinput=document.getElementById("searchbar")
const loadbtn=document.getElementById("loadbtn")
const searchbtn=document.getElementById("searchbtn")

async function loadmovie() 
{
    const status=document.getElementById("status")
    status.textContent="Loading Movies"

    try{
        const response= await fetch(url)
        if(!response.ok) {
            throw new Error("Unable to find movie/ Movie doesnot exist")
        }
        const movies= await response.json()
        allmovies=[movies]
        status.textContent="Movies Loaded"
        displaymovies(movies);
    }
    catch(error){
         status.textContent = "Could not load movie. Check your internet connection.";
        console.log(error);
    }
}

// CHANGED: Now expects an array of movies from the search results
function displaymovies(movies)
{
    container.innerHTML=""
    counter.textContent="";

    // CHANGED: Checks if the array is empty or undefined
    if(!movies || movies.length === 0)
    {
        const msg = document.createElement("p");
        msg.className = "empty-msg";
        msg.textContent = "No movie found";
        container.appendChild(msg);
        counter.textContent = "Movies Displayed: 0";
        return;
    }

    // CHANGED: Loops through every movie in the search results
    movies.forEach(movie => {
        const card = document.createElement("article");
        card.className = "movie-card"; // CHANGED: Now uses a class instead of ID

        // NEW: Creating the poster image using the separate image API you provided
        // We append the unique imdbID to get the exact poster
        const poster = document.createElement("img");
        poster.src = `http://img.omdbapi.com/?apikey=a6606658&i=${movie.imdbID}`;
        poster.alt = `${movie.Title} Poster`;
        poster.className = "movie-poster";

        const title = document.createElement("h3");
        title.textContent = movie.Title || "Title unavailable";

        const year = document.createElement("h5");
        year.textContent = "Year: " + (movie.Year || "N/A");

        const type = document.createElement("h5");
        type.textContent = "Type: " + (movie.Type || "N/A");

        
        // NEW: Append the poster first so it shows at the top of the card
        card.appendChild(poster);
        card.appendChild(title);
        card.appendChild(year);
        card.appendChild(type);
       

        container.appendChild(card);
    });

    // CHANGED: Updates the counter with the total number of movies found
    counter.textContent = `Movies Displayed: ${movies.length}`;
}

async function searchmovie()
{
    const moviename=searchinput.value.trim();

    if(moviename==="")
    {
         document.getElementById("status").textContent = "Please enter a movie name";
        return;
    }

    // CHANGED: Swapped '?t=' for '?s=' to search for ALL matching movies (e.g., all Avengers movies)
    const searchurl=`https://www.omdbapi.com/?s=${encodeURIComponent(moviename)}&apikey=a6606658`

    const status = document.getElementById("status");
    status.textContent = "Searching for movie...";

    try{
        const response=await fetch(searchurl)
        const data=await response.json();

        if (!response.ok)
        {
            throw new Error("Unable to fetch movie");
        }
        console.log(data);

        if (data.Response === "False")
        {
            status.textContent = "Movie not found";
            displaymovies(null);
            return;
        }

        status.textContent = "Search complete";

        // CHANGED: Passing 'data.Search' (the array of results) instead of the whole data object
        displaymovies(data.Search); 
    }
    catch(error)
    {
        status.textContent = "Could not search movie. Check your internet connection.";
        console.log("ERROR FETCHING:",error)
    }
}

loadbtn.addEventListener('click',loadmovie)
searchbtn.addEventListener('click',searchmovie)

searchinput.addEventListener('keydown',function(event)
{
    if(event.key==="Enter")
    {
        searchmovie();
    }
});