let whitelist = [
  "http://localhost:5173",
  "http://192.168.1.5",
  "https://homelun-admin.miladsdgh.ir",
  "https://homelun.miladsdgh.ir",
  "http://localhost",
  "http://127.0.0.1",
];
export const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
