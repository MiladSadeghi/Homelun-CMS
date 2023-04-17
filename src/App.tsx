import { BrowserRouter } from "react-router-dom";
import { store } from "./feature/store";
import { Provider } from "react-redux";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes />
        <ToastContainer />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
