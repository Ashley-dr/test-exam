/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import MovieList from "./component/MovieList";
import AddMovie from "./component/AddMovie";
import Login from "./pages/Login";
import Register from "./pages/Registration";

function App() {
  const auth = useContext(AuthContext);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => setRefreshFlag((flag) => !flag);
  const handleLogout = () => {
    auth.logout();
  };
  return (
    <Router>
      <div className="w-full  justify-self-center ">
        <nav className=" ">
          {auth.user ? (
            <div className="w-full font-bold  text-right px-10 py-5 space-x-10  bg-white text-[#005236]">
              <span>Welcome, {auth.user.username}</span>
              <button className="text-white" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="w-full font-bold  text-right px-10 py-5 space-x-10  bg-white text-[#005236]">
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {auth.user && <AddMovie onAdded={triggerRefresh} />}
                <MovieList key={refreshFlag.toString()} />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
