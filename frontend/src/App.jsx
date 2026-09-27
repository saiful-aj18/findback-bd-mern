import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import SearchPage from "./pages/Search";
import ItemDetails from "./pages/ItemDetails";
import CreateReport from "./pages/CreateReport";
import ComingSoon from "./pages/ComingSoon";
import ChatList from "./pages/ChatList";
import ChatThread from "./pages/ChatThread";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/item/:id"
        element={
          <ProtectedRoute>
            <ItemDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateReport />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:userId"
        element={
          <ProtectedRoute>
            <ChatThread />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
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
      <Route
        path="/profile/reviews"
        element={
          <ProtectedRoute>
            <ComingSoon title="Reviews" note="Rating and review history is planned for a later phase." />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/password"
        element={
          <ProtectedRoute>
            <ComingSoon title="Change Password" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/language"
        element={
          <ProtectedRoute>
            <ComingSoon title="Language" note="Only English is available for now." />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/help"
        element={
          <ProtectedRoute>
            <ComingSoon title="Help & Support" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/about"
        element={
          <ProtectedRoute>
            <ComingSoon title="About FindBack BD" note="Lost & Found, Together — helping communities across Bangladesh reunite with what they've lost." />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
