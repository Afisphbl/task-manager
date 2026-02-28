import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useTasks } from "../context/DataProvider";
import Button from "./ReUsedComponents/Button";
import Input from "./ReUsedComponents/Input";
import { Grid2X2Check, Search, MoonIcon, SunIcon } from "lucide-react";
import styles from "../styles/Navbar.module.css";

function NavBar() {
  const [search, setSearch] = useState("");
  const { onSearchTasks } = useTasks();

  useEffect(() => {
    onSearchTasks(search);
  }, [search, onSearchTasks]);

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
  return (
    <div className={styles.navbar__actions}>
      <Button
        className={styles.navbar__themeBtn}
        type="button"
        onClick={onToggleTheme}
      >
        {theme === "light" ? <MoonIcon size={18} /> : <SunIcon size={18} />}
      </Button>
    </div>
  );
}
export default NavBar;
