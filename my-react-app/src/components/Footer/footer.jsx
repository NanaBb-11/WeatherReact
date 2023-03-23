import './footer.css'
import {defaultStatus} from "../../App.jsx";

export function Footer({list, onClickCity, onClickDeleteCity}){
    return(
        <footer className={'favorite-locations'}>
            <h2 className={'locations-title'}>
                Added Locations:
            </h2>
            <div className={'location-list-container'}>
                <ListCities
                    list={list}
                    onClickCity={onClickCity}
                    onClickDeleteCity={onClickDeleteCity}
                />
            </div>
        </footer>
    )
}
function ListCities({list, onClickCity, onClickDeleteCity}){
    if (list.length){
        return(
            <ul className={'location-list'}>
                {list.map((element)=>(
                    <City
                        key={element}
                        city={element}
                        onClickCity={onClickCity}
                        onClickDeleteCity={onClickDeleteCity}
                    />
                ))}
            </ul>
        )
    }
    return(
        <>
            {defaultStatus.emptyListLocation}
        </>
    )
}
function City({city, onClickCity, onClickDeleteCity}){
    return(
        <li className={'location-item'}>
            <button  className={'location-item-title'} value={city} onClick={onClickCity}>
                {city}
            </button>
            <button  className={'location-item-button'} onClick={() => onClickDeleteCity(city)}/>
        </li>
    )
}