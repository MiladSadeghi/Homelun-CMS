import { RootState } from "../feature/store";
import { setToken } from "../feature/user/userSlicer";
import axiosInstance from "./api";
const setup = (store: any) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = store.getState().userSlice.accessToken;
      if (token) {
        config.headers["authorization"] = `Bearer ${token}`; // for Node.js Express back-end
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const { dispatch } = store;
  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;

      if (originalConfig.url !== "/auth/login" && err.response) {
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
            const rs = await axiosInstance.post("/auth/refresh-token", {
              refreshToken: localStorage.getItem("kq_c"),
            });

            const { accessToken } = rs.data;

            dispatch(setToken(accessToken));
            return axiosInstance(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(err);
    }
  );
};

export default setup;
