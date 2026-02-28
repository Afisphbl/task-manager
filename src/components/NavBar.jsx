import React from "react";
import { useTheme } from "../context/ThemeContext";
import Button from "./ReUsedComponents/Button";
import Input from "./ReUsedComponents/Input";
import { Grid2X2Check, Search, MoonIcon, SunIcon } from "lucide-react";
import styles from "../styles/Navbar.module.css";

function NavBar() {
  return (
    <nav className={styles.navbar}>
      <NavBrand />
      <NavSearch />
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

function NavSearch() {
  return (
    <div className={styles.navbar__search}>
      <span className={styles.navbar__searchIcon}>
        <Search size={18} />
      </span>

      <Input
        className={styles.navbar__searchInput}
        type="search"
        name="search"
        id="searchInput"
        placeholder="Search tasks..."
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
