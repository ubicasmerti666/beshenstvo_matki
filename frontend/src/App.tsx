import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { CreatePostPage } from './pages/CreatePostPage';

function App() {
  return (
    <div className="w-full min-h-screen">
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Публичные страницы */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Защищённые страницы */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/posts/new"
              element={
                <PrivateRoute>
                  <CreatePostPage />
                </PrivateRoute>
              }
            />

            {/* Редирект на главную */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;