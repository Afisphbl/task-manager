import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { TasksProvider } from "./context/DataProvider";
import NavBar from "./components/NavBar";
import Board from "./components/Board";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <article className="app">
          <header>
            <NavBar />
          </header>
          <main className="app__main">
            <Board />
          </main>
        </article>
      </TasksProvider>
    </ThemeProvider>
  );
}

export default App;
