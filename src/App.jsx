import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { TasksProvider } from "./context/DataProvider";
import NavBar, { NavActions } from "./components/NavBar";
import Board from "./components/Board";
import "./App.css";
import { BoardProvider } from "./context/BoardContext";

function App() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <BoardProvider>
          <article className="app">
            <header>
              <NavBar>
                <NavActions />
              </NavBar>
            </header>
            <main className="app__main">
              <Board />
            </main>
          </article>
        </BoardProvider>
      </TasksProvider>
    </ThemeProvider>
  );
}

export default App;
