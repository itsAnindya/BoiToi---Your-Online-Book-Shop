import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './styles/global.css' // Uncomment if you have global styles
import Homepage from './pages/Homepage'
import AuthPage from './pages/AuthPage'
import { Routes, Route } from 'react-router-dom'; // Ensure you have react-router-dom installed
import { BrowserRouter } from 'react-router-dom'
import StatusBanner from './components/StatusBanner'
import { API_BASE_URL } from './config'; // Adjust the import path as necessary

// import Homepage from './pages/Homepage'; // Ensure this path and file exist and exports a React component

import NavBar from './components/NavBar';

function App() {
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL); // Log the API base URL for debugging
  console.log('App component rendered');
  return (
    <BrowserRouter>
      <StatusBanner />
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </div>
    </BrowserRouter >
  );
}

export default App

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <Homepage></Homepage>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

