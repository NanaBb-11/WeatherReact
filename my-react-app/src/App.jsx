import React, {useState, useEffect, useMemo} from 'react'
import {format} from "date-fns";
import './App.css'
import { Header } from "./components/Header/header.jsx";
import {Info} from "./components/Info/Info.jsx";
import {Footer} from "./components/Footer/footer.jsx";

export const defaultStatus = {
    value: '',
    list: [],
    object: {},
    activeListCities: 'list',
    activeCity: 'city',
    listDetails: ['Temperature', 'Feels like', 'Weather', 'Sunrise', 'Sunset'],
    listPages: ['Now','Details','Forecast'],
    forecastLength: 20,
    degree: '\u00b0',
    placeholderCity: 'Aktobe',
    emptyListLocation: 'Пока что нет никаких городов',
    API : 'd576e142f94eb9a61eec6618fbcaa015',
    serverImage: 'http://openweathermap.org/img/wn/',
    serverWeather : 'http://api.openweathermap.org/data/2.5/weather',
    serverForecast : 'http://api.openweathermap.org/data/2.5/forecast',
}

function checkStorage(value, defaultValue = defaultStatus.value){
    try {
        const newValue = localStorage.getItem(value)
        if (newValue === null)  return defaultValue
        return JSON.parse(newValue)
    }
    catch (Error){
        return defaultValue
    }
}

function App() {
    const [searchCity, setSearchCity] = useState(defaultStatus.value)
    const [city, setCity] = useState(useMemo(() => checkStorage(defaultStatus.activeCity),[]))
    const [listCities, setListCities] = useState(useMemo(()=> checkStorage(defaultStatus.activeListCities, defaultStatus.list), []))
    const [page, setPage] = useState(defaultStatus.listPages[0])
    const [weatherNow, setWeatherNow] = useState(defaultStatus.object)
    const [weatherForecast, setWeatherForecast] = useState(defaultStatus.list)


    useEffect(() => {
        if (checkStorage(defaultStatus.activeCity)) fetchRequest()
    }, [])

    async function fetchRequest(value = city){
        try{
            await fetchMain(value)
        }
        catch (Error){
            alert(Error.message)
            return
        }
        localStorage.setItem(defaultStatus.activeCity, JSON.stringify(value))
        setCity(value)
        try{
            await fetchForecast(value)
        }
        catch (Error){
            alert(Error.message)
        }
    }

    async function fetchMain(value){
        try {
            const response = await fetch(`${defaultStatus.serverWeather}?q=${value}&appid=${defaultStatus.API}`)
            if (response.status >= 400)  throw new Error(`Ошибка в запросе информации: ${response.status}`)
            response.json()
                .then(response => fetchMainImage(response))
        }
        catch (Error){
            throw Error
        }
    }
    async function fetchMainImage(commit){
        try {
            const newResponse = await fetch(`${defaultStatus.serverImage}${commit.weather[0].icon}@2x.png`)
            if (newResponse.status >= 400)  throw new Error(`Ошибка в запросе информации: ${newResponse.status}`)
            newResponse.blob()
                .then((newResponse) => (
                    setWeatherNow({
                        'Weather': commit.weather[0].main,
                        'Temperature':`${(commit.main.temp - 273).toFixed(0)}${defaultStatus.degree}` ,
                        'Feels like': `${(commit.main.feels_like - 273).toFixed(0)}${defaultStatus.degree}`,
                        'Sunrise': `${format(new Date(commit.sys.sunrise*1000), 'HH')}:${format(new Date(commit.sys.sunrise*1000), 'mm')}`,
                        'Sunset': `${format(new Date(commit.sys.sunset*1000), 'HH')}:${format(new Date(commit.sys.sunset*1000), 'mm')}`,
                        image: URL.createObjectURL(newResponse)
                    })
                ))
        }
        catch (Error){
            throw Error
        }
    }
    async function fetchForecast(value){
        try {
            const response = await fetch(`${defaultStatus.serverForecast}?q=${value}&appid=${defaultStatus.API}`)
            if (response.status >= 400)  throw new Error(`Ошибка в запросе Forecast: ${response.status}`)
            response.json()
                .then(commits => {
                    setWeatherForecast([
                        ...commits.list.slice(0, defaultStatus.forecastLength),
                    ])
                })
        }
        catch (Error){
            throw Error
        }
    }

    async function handlerOnSubmit(event){
        event.preventDefault()
        await fetchRequest(searchCity)
    }
    async function handlerOnClickFavoriteCity(event){
        const newCity = event.target.value
        if (newCity === city) return
        await fetchRequest(newCity)
    }

    function handlerOnClickAddCity(){
        if (!listCities.includes(city)){
            try {
                setListCities([
                    ...listCities,
                    city
                ])
                const newList = checkStorage(defaultStatus.activeListCities, defaultStatus.list)
                newList.push(city)
                localStorage.setItem(defaultStatus.activeListCities, JSON.stringify(newList))
            }
            catch (Error){
                alert(Error.message)
            }
        }

    }
    function handlerOnClickDeleteCity(value){
        try {
            const newList = [...listCities].filter((element) => element !== value)
            setListCities([
                ...newList
            ])
            localStorage.setItem(defaultStatus.activeListCities, JSON.stringify(newList))
        }
        catch (Error){
            alert(Error.message)
        }
    }

    const handlerOnChangeCity = (event => setSearchCity(event.target.value))
    const handlerOnClickPage = (event => setPage(event.target.value))

    return (
        <div className={'wrapper'}>
            <Header
                value={searchCity}
                onChange={handlerOnChangeCity}
                onSubmit={handlerOnSubmit}
            />
            <div className={'wrapper-info'}>
                <Info
                    city={city}
                    page={page}
                    weatherNow={weatherNow}
                    weatherForecast={weatherForecast}
                    onClickPage={handlerOnClickPage}
                    onClickAddCity={handlerOnClickAddCity}
                />
                <Footer
                    list={listCities}
                    onClickCity={handlerOnClickFavoriteCity}
                    onClickDeleteCity={handlerOnClickDeleteCity}
                />
            </div>
        </div>
    )
}

export default App
