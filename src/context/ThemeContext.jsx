import { createContext, useContext, useEffect, useState } from "react";

const themeContext = createContext("light");

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    return savedTheme ? savedTheme : "light";
  });

  function onToggleTheme() {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <themeContext.Provider value={{ theme, onToggleTheme }}>
      {children}
    </themeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(themeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
