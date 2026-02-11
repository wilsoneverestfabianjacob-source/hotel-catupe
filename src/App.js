import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Quartos from "./pages/Quartos";
import RestauranteBar from "./pages/RestauranteBar";
import ReunioesEventos from "./pages/ReunioesEventos";
import ServicosFacilidades from "./pages/ServicosFacilidades";
import Galeria from "./pages/Galeria";
import Contactos from "./pages/Contactos";

import Privacidade from "./pages/Privacidade";
import Cookies from "./pages/Cookies";
import Termos from "./pages/Termos";

import { LanguageProvider } from "./context/LanguageContext";
import { CurrencyProvider } from "./context/CurrencyContext";

function App() {

  useEffect(() => {
    const blockContext = (e) => e.preventDefault();
    document.addEventListener("contextmenu", blockContext);
    return () => document.removeEventListener("contextmenu", blockContext);
  }, []);

  useEffect(() => {
    const blockClipboard = (e) => e.preventDefault();

    document.addEventListener("copy", blockClipboard);
    document.addEventListener("cut", blockClipboard);
    document.addEventListener("paste", blockClipboard);

    return () => {
      document.removeEventListener("copy", blockClipboard);
      document.removeEventListener("cut", blockClipboard);
      document.removeEventListener("paste", blockClipboard);
    };
  }, []);

  useEffect(() => {
    const blockDragOver = (e) => e.preventDefault();
    const blockDrop = (e) => e.preventDefault();

    document.addEventListener("dragover", blockDragOver);
    document.addEventListener("drop", blockDrop);

    return () => {
      document.removeEventListener("dragover", blockDragOver);
      document.removeEventListener("drop", blockDrop);
    };
  }, []);

  useEffect(() => {
    const showScreenshotOverlay = () => {
      if (document.getElementById("screenshot-overlay")) return;

      const overlay = document.createElement("div");
      overlay.id = "screenshot-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.backgroundColor = "#000000";
      overlay.style.opacity = "1";
      overlay.style.zIndex = "999999";
      overlay.style.pointerEvents = "none";
      overlay.style.transition = "opacity 0.3s ease";

      document.body.appendChild(overlay);

      setTimeout(() => {
        overlay.style.opacity = "0";
        setTimeout(() => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 300);
      }, 300);
    };

    window.__hotelCatupeShowScreenshotOverlay = showScreenshotOverlay;
  }, []);

  useEffect(() => {
    const blockKeys = (e) => {
      const key = e.key?.toLowerCase();
      if (!key) return;

      const ctrl = e.ctrlKey;
      const shift = e.shiftKey;

      if (key === "f5" || (ctrl && key === "f5")) return;

      if (key === "printscreen" || e.code === "PrintScreen" || e.keyCode === 44) {
        if (typeof window.__hotelCatupeShowScreenshotOverlay === "function") {
          window.__hotelCatupeShowScreenshotOverlay();
        }
      }

      const devtoolsCombos = [
        key === "f12",
        (ctrl && shift && key === "i"),
        (ctrl && shift && e.code === "KeyI"),
        (ctrl && shift && key === "j"),
        (ctrl && shift && key === "c"),
      ];

      const dangerousCombos = [
        ctrl && key === "u",
        ctrl && key === "p",
        ctrl && key === "s",
        ctrl && key === "h",
        ctrl && key === "w",
        ctrl && key === "f4",
        ctrl && shift && key === "r",
        ctrl && key === "c",
        ctrl && key === "x",
        ctrl && key === "v",
        ctrl && key === "a",
        ctrl && key === "=",
        ctrl && key === "-",
        ctrl && key === "0",
      ];

      if (devtoolsCombos.some(Boolean) || dangerousCombos.some(Boolean)) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", blockKeys);
    return () => document.removeEventListener("keydown", blockKeys);
  }, []);

  return (
    <LanguageProvider>
      <CurrencyProvider>
        <Router>
          <Header />

          <main>
            <Routes>

              <Route path="/" element={<Navigate to="/pt/home" replace />} />

              <Route path="/pt/home" element={<Home />} />
              <Route path="/pt/quartos" element={<Quartos />} />
              <Route path="/pt/restaurante" element={<RestauranteBar />} />
              <Route path="/pt/eventos" element={<ReunioesEventos />} />
              <Route path="/pt/servicos" element={<ServicosFacilidades />} />
              <Route path="/pt/galeria" element={<Galeria />} />
              <Route path="/pt/contactos" element={<Contactos />} />

              <Route path="/en/home" element={<Home />} />
              <Route path="/en/rooms" element={<Quartos />} />
              <Route path="/en/restaurant" element={<RestauranteBar />} />
              <Route path="/en/events" element={<ReunioesEventos />} />
              <Route path="/en/services" element={<ServicosFacilidades />} />
              <Route path="/en/gallery" element={<Galeria />} />
              <Route path="/en/contact" element={<Contactos />} />

              <Route path="/pt/privacidade" element={<Privacidade />} />
              <Route path="/pt/cookies" element={<Cookies />} />
              <Route path="/pt/termos" element={<Termos />} />

              <Route path="/en/privacy" element={<Privacidade />} />
              <Route path="/en/cookies" element={<Cookies />} />
              <Route path="/en/terms" element={<Termos />} />

            </Routes>
          </main>

          <Footer />
        </Router>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;
