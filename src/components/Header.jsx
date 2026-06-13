import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logoagenceynav.png";
import "../styles/header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <NavLink
        to="/"
        className="brand"
        onClick={closeMenu}
        aria-label="Design Agency home"
      >
        <img src={logo} alt="Design Agency" />
      </NavLink>

      <button
        className="menu-button"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div className={`nav-overlay ${menuOpen ? "is-open" : ""}`}>
        <div className="nav-glow"></div>

        <div className="nav-content">
          <p className="nav-small-title">DESIGN PIT</p>

          <nav className="nav-menu" aria-label="Main navigation">
            <NavLink to="/about" onClick={closeMenu} className="nav-card">
              <span className="nav-text" data-text="ABOUT">
                ABOUT
              </span>
              <span className="nav-image-space"></span>
            </NavLink>

            <NavLink to="/services" onClick={closeMenu} className="nav-card">
              <span className="nav-text" data-text="SERVICES">
                SERVICES
              </span>
              <span className="nav-image-space"></span>
            </NavLink>

            <NavLink to="/contact" onClick={closeMenu} className="nav-card">
              <span className="nav-text" data-text="CONTACT">
                CONTACT
              </span>
              <span className="nav-image-space"></span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
