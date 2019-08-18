import React from "react";
import ReactDOM from "react-dom";
import TopTrumps from "./TopTrumps/TopTrumps";

function App() {
  return (
    <div>
      <TopTrumps />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
