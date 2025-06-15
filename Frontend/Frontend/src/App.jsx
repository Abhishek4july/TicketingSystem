import React from 'react';
import './App.css';
import Footer from './Components/Footer';
import Header from './Components/Header';
import { Outlet } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loginUser } from './redux/authSlice';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      dispatch(loginUser(JSON.parse(storedAuth)));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen w-full">
      <div className="w-full block">
        <Header />
        <main className='pt-16'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
