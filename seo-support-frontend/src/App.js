import { BrowserRouter as Router } from "react-router-dom";

import MainRoute from "./Component/MainRoute/MainRoute.js";
function App() {

  return (
    <div className="App">
      <wc-toast></wc-toast>
      <Router>
        <MainRoute />
      </Router>
    </div>
  );
}

export default App;
