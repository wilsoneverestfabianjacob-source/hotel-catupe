import "../styles/home.css";

import { useLanguage } from "../context/LanguageContext";
import { useCurrency } from "../context/CurrencyContext";

import { useState, useRef, useEffect } from "react";

function Home() {
  const { t } = useLanguage();
  useCurrency();

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqelwbpj";

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
    checkbox: false,
  });

  // Agora os erros guardam KEYS de tradução (ex: "nomeObrigatorio")
  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  const [showError, setShowError] = useState(false);
  const [errorMessageKeys, setErrorMessageKeys] = useState([]);
  const [showSendButton, setShowSendButton] = useState(false);

  const [showReserveBlock, setShowReserveBlock] = useState(false);
  const reserveRef = useRef(null);

  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
        setIsMuted(true);
      });
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (reserveRef.current && !reserveRef.current.contains(e.target)) {
        setShowReserveBlock(false);
      }
    }

    if (showReserveBlock) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showReserveBlock]);

  // validateField agora devolve KEYS, não texto traduzido
  function validateField(name, value) {
    switch (name) {
      case "nome":
        return value.trim() === "" ? "nomeObrigatorio" : "";
      case "email":
        if (!value.trim()) return "emailObrigatorio";
        if (!value.includes("@")) return "emailInvalido";
        return "";
      case "telefone":
        if (!value.trim()) return "telefoneObrigatorio";
        if (!/^[0-9]+$/.test(value)) return "telefoneInvalido";
        return "";
      case "mensagem":
        return value.trim() === "" ? "mensagemObrigatoria" : "";
      default:
        return "";
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Erro só é actualizado para o campo que foi mexido
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, newValue),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {
      nome: validateField("nome", form.nome),
      email: validateField("email", form.email),
      telefone: validateField("telefone", form.telefone),
      mensagem: validateField("mensagem", form.mensagem),
    };

    setErrors(newErrors);

    const messages = [];

    if (newErrors.nome || newErrors.email || newErrors.telefone || newErrors.mensagem) {
      messages.push("erroCamposObrigatorios");
    }

    if (newErrors.email) {
      messages.push("erroEmailSimbolo");
    }

    if (newErrors.telefone) {
      messages.push("erroTelefoneNumeros");
    }

    if (!form.checkbox) {
      messages.push("politicaPrivacidadeObrigatoria");
    }

    if (messages.length > 0) {
      setErrorMessageKeys(messages);
      setShowError(true);
      return;
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          telefone: form.telefone,
          assunto: t("assuntoReserva"),
          mensagem: form.mensagem,
        }),
      });

      if (response.ok) {
        setErrorMessageKeys(["mensagemSucesso"]);
        setShowError(true);

        setForm({
          nome: "",
          email: "",
          telefone: "",
          mensagem: "",
          checkbox: false,
        });

        setErrors({
          nome: "",
          email: "",
          telefone: "",
          mensagem: "",
        });
      } else {
        setErrorMessageKeys(["mensagemErroEnvio"]);
        setShowError(true);
      }
    } catch (err) {
      setErrorMessageKeys(["mensagemErroConexao"]);
      setShowError(true);
    }
  }

  const fullPopupMessage = errorMessageKeys.map((key) => t(key)).join("\n");
  const isSuccessPopup =
    errorMessageKeys.length === 1 && errorMessageKeys[0] === "mensagemSucesso";

  return (
    <main className="home-container">
      <section className="hero-section">
        <video ref={videoRef} className="hero-video" autoPlay loop playsInline>
          <source src="/videos/hotel.mp4" type="video/mp4" />
          {t("videoNaoSuportado")}
        </video>

        <button
          className="mute-toggle"
          onClick={() => {
            const video = videoRef.current;
            if (video) {
              video.muted = !video.muted;
              setIsMuted(video.muted);
            }
          }}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

        <div className="hero-overlay">
          {showError && (
            <div className="popup-error">
              <div className="popup-box">
                <p style={{ fontSize: "40px", marginBottom: "10px" }}>
                  {isSuccessPopup ? "✔" : "🔐"}
                </p>

                <p style={{ whiteSpace: "pre-line" }}>{fullPopupMessage}</p>

                <button className="popup-close" onClick={() => setShowError(false)}>
                  OK
                </button>
              </div>
            </div>
          )}

          <div
            ref={reserveRef}
            className={`reserve-rect ${showReserveBlock ? "visible" : ""}`}
          >
            <form
              className="reserve-form-inner"
              onSubmit={handleSubmit}
              onMouseLeave={() => setShowSendButton(false)}
            >
              <div className="reserve-title">{t("preenchaFormulario")}</div>

              {/* NOME + EMAIL */}
              <div className="reserve-row">
                <div className="reserve-field small icon-nome">
                  <input
                    type="text"
                    name="nome"
                    className={`reserve-input ${errors.nome ? "input-error" : ""}`}
                    placeholder={t("nome")}
                    value={form.nome}
                    onChange={handleChange}
                    onMouseEnter={() => setShowSendButton(true)}
                  />
                  {errors.nome && (
                    <span className="reserve-error-inline">
                      {t(errors.nome)}
                    </span>
                  )}
                </div>

                <div className="reserve-field small icon-email">
                  <input
                    type="email"
                    name="email"
                    className={`reserve-input ${errors.email ? "input-error" : ""}`}
                    placeholder={t("email")}
                    value={form.email}
                    onChange={handleChange}
                    onMouseEnter={() => setShowSendButton(true)}
                  />
                  {errors.email && (
                    <span className="reserve-error-inline">
                      {t(errors.email)}
                    </span>
                  )}
                </div>
              </div>

              {/* TELEFONE + ASSUNTO */}
              <div className="reserve-row">
                <div className="reserve-field small icon-telefone">
                  <input
                    type="text"
                    name="telefone"
                    className={`reserve-input ${errors.telefone ? "input-error" : ""}`}
                    placeholder={t("telefone")}
                    value={form.telefone}
                    onChange={handleChange}
                    onMouseEnter={() => setShowSendButton(true)}
                  />
                  {errors.telefone && (
                    <span className="reserve-error-inline">
                      {t(errors.telefone)}
                    </span>
                  )}
                </div>

                <div className="reserve-field small">
                  <input
                    type="text"
                    className="reserve-input reserve-input-assunto"
                    value={t("assuntoReserva")}
                    readOnly
                    onMouseEnter={() => setShowSendButton(true)}
                  />
                </div>
              </div>

              {/* MENSAGEM */}
              <div className="reserve-row single">
                <div className="reserve-field medium">
                  <textarea
                    name="mensagem"
                    className={`reserve-textarea ${
                      errors.mensagem ? "input-error" : ""
                    }`}
                    placeholder={t("mensagem")}
                    value={form.mensagem}
                    onChange={handleChange}
                    onMouseEnter={() => setShowSendButton(true)}
                  ></textarea>

                  {errors.mensagem && (
                    <span className="reserve-error-message">
                      {t(errors.mensagem)}
                    </span>
                  )}
                </div>
              </div>

              {/* CHECKBOX */}
              <div className="reserve-checkbox-row">
                <input
                  type="checkbox"
                  id="privacy-checkbox"
                  name="checkbox"
                  className="reserve-checkbox-input"
                  checked={form.checkbox}
                  onChange={handleChange}
                  onMouseEnter={() => setShowSendButton(true)}
                />

                <label htmlFor="privacy-checkbox" className="reserve-checkbox-text">
                  {t("liAceitoPolitica")}
                </label>
              </div>

              {/* BOTÃO ENVIAR */}
              <div className="reserve-row single">
                <button
                  type="submit"
                  className={`reserve-submit ${showSendButton ? "visible" : ""}`}
                  onMouseEnter={() => setShowSendButton(true)}
                >
                  {t("enviar")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAIXA MERLIN */}
      <section className="merlin-bar">
        <div
          className="merlin-welcome-box"
          onClick={() => setShowReserveBlock(true)}
        >
          <span className="merlin-welcome-text">{t("reserveJa")}</span>
        </div>
      </section>

      {/* NOVA SECÇÃO DE APRESENTAÇÃO */}
      <section className="home-content">
        <div className="hotel-info-container">
          <h2 className="hotel-info-title">{t("bemvindoHotel")}</h2>

          <p className="hotel-info-paragraph">{t("texto1")}</p>
          <p className="hotel-info-paragraph">{t("texto2")}</p>
          <p className="hotel-info-paragraph">{t("texto3")}</p>
          <p className="hotel-info-paragraph bold">{t("texto4")}</p>

          <div className="hotel-mini-gallery">
            <img src="/images/foto1.jpg" alt="Foto 1" className="mini-img" />
            <img src="/images/foto2.jpg" alt="Foto 2" className="mini-img" />
            <img src="/images/foto3.jpg" alt="Foto 3" className="mini-img" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
