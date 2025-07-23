import React, { Profiler } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import AuthForm from "./components/AuthForm";
import BoardList from "./components/BoardList";
import Sidebar from "./components/Sidebar";
import BoardDetail from "./components/BoardDetail";
import MemberList from "./components/MemberList";
import UserList from "./components/UserList";
import GithubInfo from "./components/GithubInfo";
import Profile from "./components/GithubInfo";


function PrivateRoute({ children }) {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <AuthProvider>
          <BrowserRouter>
            <main className="main-content">
              <div className="columns">
                <div className="left">
                  <Sidebar  />
                  

                </div>
                <div className="right">
                       <Routes>
                        <Route path="/login" element={<AuthForm />} />
                        <Route path="/users" element={<UserList />} />
                        <Route path="/github-info" element={<GithubInfo />} />

                        <Route
                          path="/"
                          element={
                            <PrivateRoute>
                              <BoardList />
                            </PrivateRoute>
                          }
                        />
                        <Route path="/members" element={<MemberList />} />

                        <Route
                          path="/board/:id"
                          element={
                            <PrivateRoute>
                              <BoardDetail />
                            </PrivateRoute>
                          }
                        />
                      </Routes>             
                </div>
              </div>
            </main>
          </BrowserRouter>
      </AuthProvider>
      
    </div>
  );
}
