import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import {
  Routes as RouterRoutes,
  useLocation,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../feature/store";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../components/Login";
import axios from "axios";
import { userLoggedIn } from "../feature/user/userSlicer";
import Dashboard from "../pages/Dashboard";
import { TRole } from "../types/role";
import Agents from "../pages/Agents";
import Insight from "../pages/Insight";
import Properties from "../pages/Properties";
import Users from "../pages/Users";
import Profile from "../pages/Profile";
import AddUser from "../pages/AddUser";

function Routes() {
  const location = useLocation();
  const isUserAuthenticated: Boolean = useSelector(
    (state: RootState) => state.userSlice.isAuthenticated
  );
  const userRole: TRole | null = useSelector(
    (state: RootState) => state.userSlice.role
  );

  const dispatch = useDispatch();
  const refreshToken: string | null = localStorage.getItem("kq_c");

  useEffect(() => {
    const whoAmI = async () => {
      if (refreshToken) {
        try {
          const { data } = await axios.get("/auth/who-am-i", {
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${refreshToken}`,
            },
          });
          console.log(data);
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
          <Route path="/" element={<Dashboard />} />
          {userRole && userRole === "super_admin" && (
            <>
              <Route path="/agents" element={<Agents />} />
              <Route path="/insight" element={<Insight />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/add" element={<AddUser />} />
            </>
          )}
          {userRole && userRole === "admin" && (
            <>
              <Route path="/agents" element={<Agents />} />
              <Route path="/insight" element={<Insight />} />
              <Route path="/properties" element={<Properties />} />
            </>
          )}
          {userRole && userRole === "agent" && (
            <>
              <Route path="/profile" element={<Profile />} />
              <Route path="/insight" element={<Insight />} />
              <Route path="/properties" element={<Properties />} />
            </>
          )}
        </Route>
        <Route path="*" element={<Navigate to={"/"} />} />
      </RouterRoutes>
    </AnimatePresence>
  );
}

export default Routes;
