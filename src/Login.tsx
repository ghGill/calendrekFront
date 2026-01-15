import './Login.css'
import api from './api/api.tsx'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useUserContext } from './context/User.tsx';

type loginParams = {
    dbUsers: any[];
}

function Login({ dbUsers }:loginParams) {
    const [curUserId, setCurUserId] = useState<number | string>(0);

    const navigate = useNavigate();
    
    const { user, setUser } = useUserContext()!;

    useEffect(() => {
        if (!user)
            setCurUserId(dbUsers[0].id);
        else
            setCurUserId(user.id);
        
    }, [])

    const userSelected = async () => {
        const userData:any = dbUsers.filter((u:any) => u.id == curUserId)[0];

        setUser(userData);
        
        await api.setDefaultUser(userData.id);

        navigate("/home");
    }

    return (
        <div className="login-wrapper">
            <div className="login-bg">
                <div>
                    <label>בחר משתמש</label>
                </div>
                <div>
                    <select value={curUserId} onChange={(e) => {setCurUserId(e.target.value)}}>
                        {
                            dbUsers.map((u:any) => {
                                return <option key={u.id} value={u.id}>{u.name}</option>
                            })
                        }
                    </select>
                </div>
                <div>
                    <button onClick={() => userSelected()}>כניסה</button>
                </div>
            </div>
        </div>
    )
}

export default Login;
