import {BrowserRouter,} from "react-router-dom";
import MainRouter from "./components/MainRouter";

function App() {
  return (
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  );
}

export default App;
