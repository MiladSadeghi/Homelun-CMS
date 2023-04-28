import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  Routes as RouterRoutes,
  useLocation,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../feature/store";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../components/Login";
import axios from "axios";
import { isProfileCompleted, userLoggedIn } from "../feature/user/userSlice";
import Dashboard from "../pages/Dashboard";
import { TRole } from "../types/role";
import Agents from "../pages/Agents";
import Insight from "../pages/Insight";
import Properties from "../pages/Properties";
import Users from "../pages/Users";
import Profile from "../pages/Profile";
import AddUser from "../pages/AddUser";
import AddProperty from "../pages/AddProperty/AddProperty";
import axiosInstance from "../services/api";
import { toast } from "react-toastify";

function Routes() {
  const location = useLocation();
  const isUserAuthenticated: Boolean = useSelector(
    (state: RootState) => state.userSlice.isAuthenticated
  );
  const userRole: TRole | null = useSelector(
    (state: RootState) => state.userSlice.role
  );

  const isAgentProfileComplete: boolean | any = useSelector(
    (state: RootState) => state.userSlice.profileCompleted
  );

  const dispatch = useDispatch();
  const refreshToken: string | null = localStorage.getItem("kq_c");
  const navigate = useNavigate();

  useEffect(() => {
    const whoAmI = async () => {
      if (refreshToken) {
        try {
          const { data } = await axios.get("/auth/who-am-i", {
            headers: { authorization: `Bearer ${refreshToken}` },
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
        } catch (error: any) {}
      }
    };

    whoAmI();
  }, []);

  useEffect(() => {
    const isUserProfileComplete = async () => {
      try {
        if (userRole === "agent") {
          await axiosInstance.get("agent");

          dispatch(isProfileCompleted(true));
        }
      } catch (error: any) {
        dispatch(isProfileCompleted(false));
        navigate("/profile");
        toast.error(error.response.data.message);
      }
    };
    isUserProfileComplete();
  }, [isUserAuthenticated]);

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
          {userRole && userRole === "super_admin" && (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/insight" element={<Insight />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/add" element={<AddUser />} />
              <Route path="/properties/add" element={<AddProperty />} />
            </>
          )}
          {userRole && userRole === "admin" && (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/insight" element={<Insight />} />
              <Route path="/properties" element={<Properties />} />
            </>
          )}
          {userRole && userRole === "agent" && (
            <>
              <Route
                path="/"
                element={isAgentProfileComplete && <Dashboard />}
              />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/insight"
                element={isAgentProfileComplete && <Insight />}
              />
              <Route
                path="/properties"
                element={isAgentProfileComplete && <Properties />}
              />
            </>
          )}
        </Route>
        <Route path="*" element={<Navigate to={"/"} />} />
      </RouterRoutes>
    </AnimatePresence>
  );
}

export default Routes;
