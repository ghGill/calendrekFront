import './App.css'
import Month from './components/Month.tsx'
import Login from './Login.tsx'
import Open from './Open.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from './context/User.tsx';
import api from './api/api.tsx'
import { useEffect, useRef, useState } from 'react'

function App() {
  const [loading, setLoading] = useState(true);
  const dbUsers = useRef([]);

  const loadUsers = async () => {
      const result:any = await api.getAllUsers();

      if (result.success) {
          dbUsers.current = result.data;
          setLoading(false);
      }
  }

  useEffect(() => {
      loadUsers();
  }, [])

  return (
    <>
      {
        !loading &&
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Open />} />
              <Route path="/login" element={<Login dbUsers={dbUsers.current} />} />
              <Route path="/home" element={<Month dbUsers={dbUsers.current}/>} />
            </Routes>
          </BrowserRouter>      
        </UserProvider>
      }
    </>
  )
}

export default App
