import {format} from "date-fns";
import {defaultStatus} from "../../App.jsx";
import './info.css'

export function Info({city, page, weatherNow, weatherForecast, onClickPage, onClickAddCity}){
    return(
        <div className={'weather'}>
            <div className={'weather-info-UI'}>
                <UI
                    city={city}
                    page={page}
                    weatherNow={weatherNow}
                    weatherForecast={weatherForecast}
                    onClickAddCity={onClickAddCity}
                />
            </div>
            <Nav
                item={page}
                onClick={onClickPage}
            />
        </div>
    )
}

function UI({city, page, weatherNow, weatherForecast, onClickAddCity}){
    switch (page){
        case defaultStatus.listPages[0]:
            return (
                <WeatherNow
                    city={city}
                    weatherInfo={weatherNow}
                    onClick={onClickAddCity}
                />
            )
        case defaultStatus.listPages[1]:
            return (
                <WeatherDetails
                    city={city}
                    weatherInfo={weatherNow}
                />
            )
        case defaultStatus.listPages[2]:
            return (
                <WeatherForecast
                    city={city}
                    weatherInfo={weatherForecast}
                />
            )
    }
}

function Nav({item, onClick}){
    return(
        <ul className={'info-menu'}>
            {defaultStatus.listPages.map((element)=>(
                <Page
                    key={element}
                    value={element}
                    currentValue={item}
                    onClick={onClick}
                />
            ))}
        </ul>
    )
}
function Page({value, currentValue, onClick}){
    const className = (value === currentValue) ? 'menu-item-button' : 'menu-item-button menu-item-button--active'
    return(
        <li className={'menu-item'}>
            <button className={className} value={value} onClick={onClick}>
                {value}
            </button>
        </li>
    )
}

function WeatherNow({city, weatherInfo, onClick}){
    return (
        <div className={'weather-now'}>
            <div className="now-temperature">
                {weatherInfo.Temperature}
            </div>
            <div className="now-cover">
                <img className="now-image" src={weatherInfo.image} alt={''}/>
            </div>
            <div className="now-location">
                {city}
                <button className="now-favorite-button" onClick={onClick}/>
            </div>
        </div>
    )
}

function WeatherDetails({city, weatherInfo}){
    return (
        <div className={'weather-details'}>
            <h2 className="details-location">
                {city}
            </h2>
            <ul className="details-list">
                {defaultStatus.listDetails.map((element) =>(
                    <Detail
                        key={element}
                        title={element}
                        text={weatherInfo[element]}
                    />
                ))}
            </ul>
        </div>
    )
}
function Detail({title, text}){
    return (
        <li className={'details-item'}>
            {title}: {text}
        </li>
    )
}

function WeatherForecast({city, weatherInfo}){
    return (
        <div className={'weather-forecast'}>
            <h2 className="forecast-location">
                {city}
            </h2>
            <ForecastList
                weatherInfo={weatherInfo}
            />
        </div>
    )
}
function ForecastList({weatherInfo}){
    return(
        <ul className="weather-forecast-list">
            {weatherInfo.map((element, index) => (
                <ForecastItem
                    key={index}
                    date={`${format(new Date(element.dt*1000), 'do')} ${format(new Date(element.dt*1000), 'MMMM')}`}
                    time={`${format(new Date(element.dt*1000), 'HH')}:${format(new Date(element.dt*1000), 'mm')}`}
                    temperature={`${(element.main.temp - 273).toFixed(0)}${defaultStatus.degree}`}
                    feelsLike={`${(element.main.feels_like- 273).toFixed(0)}${defaultStatus.degree}`}
                    description={element.weather[0].description}
                />
            ))}
        </ul>
    )
}
function ForecastItem({date, time, temperature, feelsLike, description}){
    return(
        <li className={'forecast-item'}>
            <div className="forecast-item-data">
                {date}
            </div>
            <div className="forecast-item-time">
                {time}
            </div>
            <div className="forecast-item-temperature">
                <p>
                    Temperature: {temperature}
                </p>
                <p>
                    Feels like: {feelsLike}
                </p>
            </div>
            <div className="forecast-item-description">
                {description}
            </div>
        </li>
    )
}