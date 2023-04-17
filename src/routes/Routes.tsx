import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import { Routes as RouterRoutes, useLocation, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../feature/store";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../components/Login";
import Home from "../pages/Home";
import axios from "axios";
import { userLoggedIn } from "../feature/user/userSlicer";

function Routes() {
  const location = useLocation();
  const isUserAuthenticated: Boolean = useSelector(
    (state: RootState) => state.userSlice.isAuthenticated
  );
  const dispatch = useDispatch();
  const refreshToken: string | null = localStorage.getItem("kq_c");

  useEffect(() => {
    const whoAmI = async () => {
      if (refreshToken) {
        try {
          const { data } = await axios.get("/user/who-am-i", {
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${refreshToken}`,
            },
          });
          dispatch(
            userLoggedIn({
              accessToken: data.accessToken,
              isAuthenticated: true,
              name: data.name,
              role: data.role,
            })
          );
        } catch (error) {}
      }
    };
    whoAmI();
  }, []);

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
