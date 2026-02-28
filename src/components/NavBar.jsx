import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useTasks } from "../context/DataProvider";
import useDebounce from "../debounce/UseDebounce";
import Button from "./ReUsedComponents/Button";
import Input from "./ReUsedComponents/Input";
import {
  Grid2X2Check,
  Search,
  MoonIcon,
  SunIcon,
  CircleHelp,
} from "lucide-react";
import styles from "../styles/Navbar.module.css";

function NavBar() {
  const [search, setSearch] = useState("");
  const { onSearchTasks } = useTasks();

  const debouncedSearch = useDebounce(search, 700);

  useEffect(() => {
    onSearchTasks(debouncedSearch);
  }, [debouncedSearch, onSearchTasks]);

  return (
    <nav className={styles.navbar}>
      <NavBrand />
      <NavSearch search={search} setSearch={setSearch} />
      <NavActions />
    </nav>
  );
}

function NavBrand() {
  return (
    <div className={styles.navbar__brand}>
      <span className={styles.navbar__logo}>
        <Grid2X2Check size={20} />
      </span>
      <span className={styles.navbar__name}>TaskFlow</span>
    </div>
  );
}

function NavSearch({ search, setSearch }) {
  return (
    <div className={styles.navbar__search}>
      <span className={styles.navbar__searchIcon}>
        <Search size={18} />
      </span>

      <Input
        className={styles.navbar__searchInput}
        htmlFor="searchInput"
        type="search"
        name="search"
        id="searchInput"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

function NavActions() {
  const { theme, onToggleTheme } = useTheme();
  const [showSummary, setShowSummary] = useState(false);

  function onToggleSummary() {
    setShowSummary((prev) => !prev);
  }

  return (
    <div className={styles.navbar__actions}>
      <Button
        className={styles.navbar__aboutBtn}
        type="button"
        onClick={onToggleSummary}
      >
        <CircleHelp size={16} />
        About
      </Button>

      <Button
        className={styles.navbar__themeBtn}
        type="button"
        onClick={onToggleTheme}
      >
        {theme === "light" ? <MoonIcon size={18} /> : <SunIcon size={18} />}
      </Button>

      {showSummary && (
        <div className={styles.navbar__summaryPanel}>
          <h3 className={styles.navbar__summaryTitle}>TaskFlow Summary</h3>
          <p className={styles.navbar__summaryText}>
            TaskFlow is a simple task board to create, organize, and track work
            across progress stages.
          </p>
          <ul className={styles.navbar__summaryList}>
            <li>Kanban columns: To Do, In Progress, Done</li>
            <li>Drag and drop tasks between columns</li>
            <li>Debounced task search from the navbar</li>
            <li>Add and delete tasks quickly</li>
            <li>Light and dark theme toggle</li>
          </ul>
        </div>
      )}
    </div>
  );
}
export default NavBar;
