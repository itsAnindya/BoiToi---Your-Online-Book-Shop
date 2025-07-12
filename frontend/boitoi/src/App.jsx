import './App.css'
import './styles/global.css' // Uncomment if you have global styles
import Homepage from './pages/Homepage'
import AuthPage from './pages/AuthPage'
import BookDetail from './pages/BookDetails' // Ensure this path and file exist and exports a React component
import BooksSection from './pages/BooksSection' // Ensure this path and file exist and exports a React component
import { Routes, Route } from 'react-router-dom'; // Ensure you have react-router-dom installed
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function App() {
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL); // Log the API base URL for debugging
  console.log('App component rendered');
  return (
    <>
      <BrowserRouter>
        {/* <StatusBanner /> */}
        <div>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/books" element={<BooksSection />}/>
            <Route path="/books/:id" element={<BookDetail />} />
          </Routes>
        </div>
        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#10B981',
                color: '#fff',
              },
            },
          }}
        />
      </BrowserRouter >
    </>
  );
}

export default App;