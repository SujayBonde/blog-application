import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

import { Home } from './pages/Home';
import { BlogDetails } from './pages/BlogDetails';
import { Explore } from './pages/Explore';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CreateBlog } from './pages/CreateBlog';
import { EditBlog } from './pages/EditBlog';
import { MyBlogs } from './pages/MyBlogs';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/create-blog"
              element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-blog/:id"
              element={
                <ProtectedRoute>
                  <EditBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-blogs"
              element={
                <ProtectedRoute>
                  <MyBlogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin only route */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
