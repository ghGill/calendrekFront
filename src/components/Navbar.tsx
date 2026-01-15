import './Navbar.css'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

type navbarParams = {
    yearlyEventHandler:any
}

function Navbar({ yearlyEventHandler }:navbarParams) {
    const navigate = useNavigate();

    const [openMenu, setOpenMenu] = useState(false);

    const displayYearlyEvents = (type:string) => {
        setOpenMenu(false);
        yearlyEventHandler(type);
    }
    
    return (
        <>
            <div className='navbar'>
                <div className='half-bar'>
                    <div className='img-div'>
                        <img src='/calander-icon.png'></img>
                    </div>
                    <div className='title'>
                        <label>CALENDREK</label>
                    </div>
                </div>

                <div className='half-bar'>
                    <div className='menu'>
                        <div className='img-div menu-img clickable'>
                            <img src='/menu.png' onClick={() => {setOpenMenu(!openMenu)}}></img>
                            {
                                openMenu &&
                                <div className='menu-options'>
                                    <div className='menu-item' onClick={() => {displayYearlyEvents('heb')}}>ארועים עבריים</div>
                                    <div className='menu-item' onClick={() => {displayYearlyEvents('greg')}}>ארועים לועזיים</div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='img-div clickable'>
                        <img src='/users.png' onClick={() => {navigate("/login")}}></img>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar;
