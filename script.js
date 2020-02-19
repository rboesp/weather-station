//globals
let iurl = "https://openweathermap.org/img/w/"
let ifiletype = ".png"

//
class URL {
    constructor() {
        this.endpoint = "https://api.openweathermap.org/data/2.5/"
        this.route = ""
        this.params = {}
        this.api_key = "APPID=97e1348e87bfbee5fd6bae1ca77e4dfa"
    }
    finalURL() {
        this.endpoint += this.route
        let entries = Object.entries(this.params)
        for (const [label, value] of entries) {
            console.log(`${label}=${value}`)
            this.endpoint += `${label}=${value}&`
        }
        this.endpoint += this.api_key
        return this.endpoint
    }
    setRoute(route) {
        this.route = route + "?"
    }
    setParams(params) {
        let entries = Object.entries(params)
        console.log(entries)

        //prettier-ignore
        for (const [key, value] of entries) {
            this.params[key] = value
        }
        console.log(this.params)
    }
}

//
class City {
    constructor(name = "", prov = "", temp = "", img = "", forecast = []) {
        this.name = name
        this.prov = prov
        this.temp = temp
        this.img = img
        this.forecast = forecast
    }
}

//representing local stroage and will hold
//the local storage data when parsing (if that makes sense)
class City_List {
    constructor() {
        this.list = {}
    }
    add(name, city) {
        this.list[name] = city
    }
    get() {
        return this.list
    }
}

//global saved
let global_saved = new City_List()

//events

//hitting green search btn
$(document).on("submit", e => {
    e.preventDefault()
    let inp = $(".maap").val()
    let split = inp
        .trim()
        .toLowerCase()
        .split(",")
    // .map(i => i.trim())

    //using method: city, province
    let params = {
        units: "imperial",
        q: `${split[0]},${split[1]}`
    }
    //save and fetch
    fetch_and_render(params)
})

//clicking side saved cities
$(".city-list").on("click", e => {
    let city_name = e.target.closest("div").getAttribute("data-name")
    let city_prov = e.target.closest("div").getAttribute("data-prov")
    console.log(city_name, city_prov)

    //request weather from these params
    let params = {
        units: "imperial",
        q: `${city_name}, ${city_prov}`
    }

    let saved_cities = getSavedCities(global_saved.get())
    saved_cities.forEach(city => {
        if (city.name === city_name) {
            fetch_and_render(params)
        }
    })
})

//functions
function getCoords(geo) {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log("Runs when location got!!!")
                geo.lat = position.coords.latitude
                geo.long = position.coords.longitude
                console.log(geo)
                $("#lat").text(geo.lat)
                $("#long").text(geo.long)
                resolve(geo)
            },
            error => {
                console.log(
                    "Here I would make city and render search for city!"
                )
                let curr = makeCity("Search a city to get weather!", "", "")
                renderCurrentCity(curr)
                reject(error)
            }
        )
    })
}

function renderSavedCities(saved_cities) {
    $(".city-list").empty()
    //for every city
    saved_cities.forEach(city => {
        let div = $(
            `<div  data-prov=${city.prov} data-name=${city.name} class='border justify-content-start d-flex text-left p-1 text-light border-secondary rounded m-1'></div>`
        )
        let p = $(
            `<p class="city m-auto">${city.name}, ${city.prov} <span>${city.temp}&deg;</span> </p>`
        )
        let img = $(`<img class="saved-city-img" src="${city.img}" alt="">`)
        div.append(p, img)
        $(".city-list").append(div)
    })
}

function renderCurrentCity(current_city) {
    $(".jumbotron").empty()
    let name = $(
        `<h1 class=current-city> ${current_city.name}, ${current_city.prov}</h1>`
    )
    let temp = $(
        `<span class="current-city-temp"> - ${current_city.temp}&deg;</span>`
    )

    name.append(temp)
    let img = $(`<img src='${current_city.img}'>`)
    img.css({
        height: "50px",
        width: "50px"
    })
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, "0")
    var mm = String(today.getMonth() + 1).padStart(2, "0") //January is 0!
    var yyyy = today.getFullYear()

    today = mm + "/" + dd + "/" + yyyy + " - "
    let date = $(`<h1>${today}</h1>`)
    $(".jumbotron").append(name, img)
}

/****
 * these will be taken out and data will be fetched from api request
 ****/
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
}

function getfive() {
    return ["Mon", "tue", "Wed", "Thurs", "Fri"]
}

function getForecast() {
    return [
        getRandomInt(100),
        getRandomInt(100),
        getRandomInt(100),
        getRandomInt(100),
        getRandomInt(100)
    ]
}
/****
 *****/

function renderPage(current_city, saved_cities) {
    //get current(geo)
    renderCurrentCity(current_city)

    //get saved()
    renderSavedCities(saved_cities)

    //function definition in graph.js
    renderGraph(current_city.forecast[0], current_city.forecast[1])
}

//here is where you call local storage
function getSavedCities(saved) {
    let cities = []
    let entries = Object.entries(saved)
    console.log(entries)

    //prettier-ignore
    for (const [name, city] of entries) {
        let c = new City(city.name, city.prov, city.temp, city.img)
        cities.push(c)
    }
    return cities
}

//here is where you would fetch from api
function makeCity(
    name,
    prov,
    temp = getRandomInt(100),
    img = "./images/search_icon.png",
    forecast = getForecast()
) {
    let city = new City(name, prov, temp, img, forecast)
    return city
}

function fetch_weather(url) {
    return new Promise(resolve => {
        let spinner = $(".spinner")
        spinner.show()
        fetch(url)
            .then(res => {
                return res.json()
            })
            .then(res => {
                spinner.hide()
                resolve(res)
            })
    })
}

//gets weather from params
//and renders response to screen
async function fetch_and_render(params) {
    let current_city_url = new URL()
    let forecast_url = new URL()
    forecast_url.setParams(params)
    forecast_url.setRoute("forecast")
    current_city_url.setParams(params)
    current_city_url.setRoute("weather")

    let current_city_endpoint = current_city_url.finalURL()
    let forecast_endpoint = forecast_url.finalURL()
    console.log(current_city_endpoint)
    console.log(forecast_endpoint)

    let weather_res = await fetch_weather(current_city_endpoint)
    let forecast_res = await fetch_weather(forecast_endpoint)

    console.log(forecast_res.list)
    let fiveday_forecast = {}
    for (var i = 0; i < forecast_res.list.length; i++) {
        // only look at forecasts around 3:00pm
        if (forecast_res.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            let temp_date = new Date(
                forecast_res.list[i].dt_txt
            ).toLocaleDateString()
            let temp_temperature = forecast_res.list[i].main.temp_max
            fiveday_forecast[temp_date] = temp_temperature
        }
    }

    console.log(fiveday_forecast)

    //get the xaxis for graph
    let forecast_keys = Object.keys(fiveday_forecast)

    //get the yaxis for graph
    let forecast_values = Object.values(fiveday_forecast)

    console.log(weather_res)
    let img = weather_res.weather[0]["icon"]
    var iconurl = iurl + img + ifiletype

    //jumbotron
    let current_city = makeCity(
        weather_res["name"],
        weather_res["sys"]["country"],
        weather_res["main"]["temp"],
        iconurl,
        [forecast_keys, forecast_values]
    )

    //sidenav set and get, dict so no duplicates
    global_saved.add([current_city["name"]], current_city)
    let saved_cities = getSavedCities(global_saved.get())

    renderPage(current_city, saved_cities)
}

//entry point
$(function() {
    console.log("ready!")

    //get coords then render
    start()
})

//like main
async function start() {
    let response = await getCoords(history, (geo = {}))
    console.log(response)
    console.log(response.lat, response.long)
    console.log("Runs after promise resolves!")

    let params = {
        units: "imperial",
        lat: response.lat,
        lon: response.long
    }

    fetch_and_render(params)

    /*
    NEXT: 
    1. Add title and change font
    2. waiting circles when getting api data and hover when over saved tiles 
    3. Make saved from local storage not data structure
    6. Add in more jumbotron data, style differntly
    7. style page and add title, footer, dark mode
    8. Make more robust search form
    9.ERROR MESSAGING -- currently no indication of bad request
    10. metric -> imperial switch!
    */
}
