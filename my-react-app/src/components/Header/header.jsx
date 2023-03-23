import {defaultStatus} from "../../App.jsx";
import './header.css'
export function Header({value, onChange, onSubmit}){
    return(
        <form className='search-form' onSubmit={onSubmit}>
            <input
                className='search-input'
                type='text'
                placeholder={defaultStatus.placeholderCity}
                value={value}
                onChange={onChange}
            />
            <input
                className='search-button'
                type='submit'
                value={defaultStatus.value}
            />
        </form>
    )
}