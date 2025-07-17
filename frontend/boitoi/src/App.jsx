import './App.css'
import './styles/global.css' // Uncomment if you have global styles
import Homepage from './pages/Homepage'
import AuthPage from './pages/AuthPage'
import BookDetail from './pages/BookDetails' // Ensure this path and file exist and exports a React component
import BooksSection from './pages/BooksSection' // Ensure this path and file exist and exports a React component
import CartPage from './pages/CartPage'
import CartTestPage from './pages/CartTestPage'
import OrdersPage from './pages/OrdersPage'
import UserProfilePage from './pages/UserProfilePage'
import AdminControlPanel from './pages/AdminControlPanel'
import BookRequestsManagement from './pages/BookRequestsManagement'
import PublisherAuth from './pages/PublisherAuth'
import PublisherDashboard from './pages/PublisherDashboard'
import PublisherBookSubmission from './pages/PublisherBookSubmission'
import PublisherLoginPage from './pages/PublisherLoginPage'
import { Routes, Route } from 'react-router-dom'; // Ensure you have react-router-dom installed
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './contexts/CartContext'

function App() {
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL); // Log the API base URL for debugging
  console.log('App component rendered');
  return (
    <>
      <BrowserRouter>
        <CartProvider>
          {/* <StatusBanner /> */}
          <div>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/books" element={<BooksSection />}/>
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/cart-test" element={<CartTestPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/admin" element={<AdminControlPanel />} />
              <Route path="/admin/book-requests" element={<BookRequestsManagement />} />
              <Route path="/publisher/auth" element={<PublisherAuth />} />
              <Route path="/publisher-login" element={<PublisherLoginPage />} />
              <Route path="/publisher/dashboard" element={<PublisherDashboard />} />
              <Route path="/publisher/:id/dashboard" element={<PublisherDashboard />} />
              <Route path="/publisher/:id/submit-book" element={<PublisherBookSubmission />} />
              <Route path="/publisher/submit-book" element={<PublisherBookSubmission />} />
            </Routes>
          </div>
          {/* Toast Notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#292524',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#14b8a6',
                  color: '#fff',
                },
              },
            }}
          />
        </CartProvider>
      </BrowserRouter >
    </>
  );
}

export default App;