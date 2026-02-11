import "../styles/header.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCurrency } from "../context/CurrencyContext";
import { useState, useEffect, useMemo } from "react";

const HC_STROKE_WIDTH = 10;
const EXT = 12;

function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  const [menuOpen, setMenuOpen] = useState(false);

  // ============================
  // CORES QUE DEVEM CICLAR (CONGELADAS)
  // ============================
  const colors = useMemo(
    () => [
      "#B2915F",
      "#000000",
      "#0000FF",
      "#808080",
      "#FFA500",
      "#800080",
      "#00FF00",
      "#FF0000",
    ],
    []
  );

  const [colorIndex, setColorIndex] = useState(0);

  // ============================
  // INTERVALO DE 1 SEGUNDO
  // ============================
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [colors.length]);

  const currentColor = colors[colorIndex];

  const navigate = useNavigate();

  const toggleLanguage = () => {
    if (language === "pt-MZ") {
      setLanguage("en-US");
      setCurrency("USD");
      navigate("/en/home");
    } else {
      setLanguage("pt-MZ");
      setCurrency("MZN");
      navigate("/pt/home");
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header
      className="header"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="header-top">

        {/* LOGO + MONOGRAMA */}
        <div className="logo-wrapper">
          <NavLink to="/pt/home" className="logo-click">
            <div className="logo-circle">
              <svg className="hc-mask" viewBox="0 0 100 100">
                <defs>
                  <mask id="hc-cutout-ret">
                    <circle cx="50" cy="50" r="50" fill="white" />

                    {/* H */}
                    <path
                      d={`
                        M30 ${10 - EXT}
                        V${90 + EXT}

                        M30 50
                        H70

                        M70 ${10 - EXT}
                        V${90 + EXT}
                      `}
                      stroke="black"
                      strokeWidth={HC_STROKE_WIDTH}
                      fill="none"
                      strokeLinecap="butt"
                    />

                    {/* C */}
                    <path
                      d={`
                        M${88 + EXT} 32
                        Q60 15 44 32
                        Q34 50 44 68
                        Q60 85 ${88 + EXT} 68
                      `}
                      stroke="black"
                      strokeWidth={HC_STROKE_WIDTH}
                      fill="none"
                      strokeLinecap="butt"
                    />
                  </mask>
                </defs>

                {/* CÍRCULO DO LOGO COM COR ANIMADA */}
                <circle
                  cx="50"
                  cy="50"
                  r="50"
                  fill={currentColor}
                  mask="url(#hc-cutout-ret)"
                />
              </svg>
            </div>

            {/* TEXTO HOTEL CATUPE COM COR ANIMADA */}
            <h1 className="logo" style={{ color: currentColor }}>
              HOTEL CATUPE
            </h1>
          </NavLink>
        </div>

        {/* HAMBURGUER */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* MENU + BANDEIRAS */}
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <ul>

            <li>
              <NavLink to={language === "pt-MZ" ? "/pt/quartos" : "/en/rooms"}>
                {t("quartos")}
              </NavLink>
            </li>

            <li>
              <NavLink to={language === "pt-MZ" ? "/pt/restaurante" : "/en/restaurant"}>
                {t("restaurante")}
              </NavLink>
            </li>

            <li>
              <NavLink to={language === "pt-MZ" ? "/pt/eventos" : "/en/events"}>
                {t("eventos")}
              </NavLink>
            </li>

            <li>
              <NavLink to={language === "pt-MZ" ? "/pt/servicos" : "/en/services"}>
                {t("servicos")}
              </NavLink>
            </li>

            <li>
              <NavLink to={language === "pt-MZ" ? "/pt/galeria" : "/en/gallery"}>
                {t("galeria")}
              </NavLink>
            </li>

            <li>
              <NavLink to={language === "pt-MZ" ? "/pt/contactos" : "/en/contact"}>
                {t("contactos")}
              </NavLink>
            </li>

            <li className="flag-selector" onClick={toggleLanguage}>
              <div
                className="flag"
                style={{
                  backgroundImage:
                    language === "pt-MZ"
                      ? "url('/flags/mz.png')"
                      : "url('/flags/us.png')",
                }}
              />
              <span className="currency-label">{currency}</span>
            </li>

          </ul>
        </nav>

      </div>
    </header>
  );
}

export default Header;
