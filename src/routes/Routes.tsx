import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import { Routes as RouterRoutes, useLocation, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../feature/store";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../components/Login";
import Home from "../pages/Home";

function Routes() {
  const location = useLocation();
  const isUserAuthenticated: Boolean = useSelector(
    (state: RootState) => state.userSlice.isAuthenticated
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <RouterRoutes location={location} key={location.pathname}>
        <Route
          path="/"
          element={isUserAuthenticated ? <PrivateRoute /> : <Login />}
        >
          <Route index element={<Home />} />
        </Route>
      </RouterRoutes>
    </AnimatePresence>
  );
}

export default Routes;
