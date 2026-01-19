import './Open.css'
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

function Open() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate("/login");
        }, 5000);
    }, []);

    return (
        <div className='open-wrapper'>
            <div className='img-wrapper'>
                <img src="/open.png" alt="" />
            </div>
        </div>
    )
}

export default Open;
