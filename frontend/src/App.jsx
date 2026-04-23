import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StoryPage from './pages/StoryPage';
import JournalPage from './pages/JournalPage';
import FAQPage from './pages/FAQPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ScrollToTop from './components/ScrollToTop';
// Account Pages
import AccountOverviewPage from './pages/AccountOverviewPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import PaymentsPage from './pages/PaymentsPage';
import AddressPage from './pages/AddressPage';
import CheckoutPage from './pages/CheckoutPage';
import { useAuth } from './context/AuthContext';

// Route that redirects to /login if not authenticated
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAuth();
  return userInfo ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main style={{ minHeight: '80vh', paddingBottom: '100px' }}>
        <Routes>
          {/* Public */}
          <Route path='/' element={<HomePage />} />
          <Route path='/product/:id' element={<ProductPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/story' element={<StoryPage />} />
          <Route path='/journal' element={<JournalPage />} />
          <Route path='/faq' element={<FAQPage />} />
          <Route path='/shipping' element={<ShippingPage />} />
          <Route path='/returns' element={<ReturnsPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/terms-of-service' element={<TermsPage />} />
          <Route path='/privacy-policy' element={<PrivacyPage />} />

          {/* Private — Account Pages */}
          <Route path='/account' element={<PrivateRoute><AccountOverviewPage /></PrivateRoute>} />
          <Route path='/account/orders' element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
          <Route path='/account/wishlist' element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
          <Route path='/account/payments' element={<PrivateRoute><PaymentsPage /></PrivateRoute>} />
          <Route path='/account/addresses' element={<PrivateRoute><AddressPage /></PrivateRoute>} />
          <Route path='/checkout' element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
