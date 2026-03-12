// import '../index.css';
// import ReactDOM from "react-dom";
// import App from "./App/App";

// const app = document.getElementById("root");
// ReactDOM.render(<App />, app);

import React from 'react';
import { createRoot } from 'react-dom/client'; 
import App from "./App/App";

// Grab the DOM element
const container = document.getElementById('root');

// Create a root, and render your app to it
const root = createRoot(container);
root.render(<App />);