import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import nolertNotify from "@nolert/notify";

import "@nolert/notify/dist/style.min.css";
import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import FormViewPage from './pages/FormView';

function App() {

  const location = useLocation();

  useEffect(()=>{
    nolertNotify.setConfig({
      position:"bottom",
      display:"solo"
    })
  },[]);

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/form/:id" element={<FormViewPage />} />
      </Routes>
    </>
  );
}

export default App;
