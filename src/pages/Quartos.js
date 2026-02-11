import "./quartos.css";
import { useLanguage } from "../context/LanguageContext";
import { useCurrency } from "../context/CurrencyContext";
import { useState, useRef, useEffect } from "react";

function Quartos() {
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

  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSendButton, setShowSendButton] = useState(false);

  /* ============================
     NOVO: CONTROLO DO BLOCO RESERVA
     ============================ */
  const [showReserveBlock, setShowReserveBlock] = useState(false);
  const reserveRef = useRef(null);

  /* ============================
     NOVO: REFERÊNCIA DO VÍDEO
     ============================ */
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  /* ============================
     NOVO: AUTOPLAY COM ÁUDIO + FALLBACK
     ============================ */
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

  /* ============================
     NOVO: FECHAR AO CLICAR FORA
     ============================ */
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

  /* ============================
     VALIDAÇÃO EM TEMPO REAL
     ============================ */
  function validateField(name, value) {
    switch (name) {
      case "nome":
        return value.trim() === "" ? t("nomeObrigatorio") : "";
      case "email":
        if (!value.trim()) return t("emailObrigatorio");
        if (!value.includes("@")) return t("emailInvalido");
        return "";
      case "telefone":
        if (!value.trim()) return t("telefoneObrigatorio");
        if (!/^[0-9]+$/.test(value)) return t("telefoneInvalido");
        return "";
      case "mensagem":
        return value.trim() === "" ? t("mensagemObrigatoria") : "";
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

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, newValue),
    }));
  }

  /* ============================
     SUBMISSÃO FINAL
     ============================ */
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
    if (
      newErrors.nome ||
      newErrors.email ||
      newErrors.telefone ||
      newErrors.mensagem
    ) {
      messages.push(`${t("erroCamposObrigatorios")}`);
    }

    if (newErrors.email) {
      messages.push(`${t("erroEmailSimbolo")}`);
    }

    if (newErrors.telefone) {
      messages.push(`${t("erroTelefoneNumeros")}`);
    }

    if (!form.checkbox) {
      messages.push(`${t("politicaPrivacidadeObrigatoria")}`);
    }

    if (messages.length > 0) {
      setErrorMessage(messages.join("\n"));
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
          assunto: "Reserva", // Mantido como string fixa para o back-end, ou pode usar t("assuntoReserva")
          mensagem: form.mensagem,
        }),
      });

      if (response.ok) {
        setErrorMessage(t("mensagemSucesso"));
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
        setErrorMessage(t("mensagemErroEnvio"));
        setShowError(true);
      }
    } catch (err) {
      setErrorMessage(t("mensagemErroConexao"));
      setShowError(true);
    }
  }

  return (
    <main className="home-container">
      <section className="hero-section">
        {/* ============================
            VÍDEO DE FUNDO
            ============================ */}
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          loop
          playsInline
        >
          <source src="/videos/hotel.mp4" type="video/mp4" />
          {t("videoNaoSuportado")}
        </video>

        {/* ============================
            BOTÃO MUTE/UNMUTE
            ============================ */}
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
          {isMuted ? " 🔇 " : " 🔊 "}
        </button>

        <div className="hero-overlay">
          {/* POP-UP */}
          {showError && (
            <div className="popup-error">
              <div className="popup-box">
                <p style={{ fontSize: "40px", marginBottom: "10px" }}>
                  {errorMessage === t("mensagemSucesso") ? "✔" : "🔐"}
                </p>
                <p style={{ whiteSpace: "pre-line" }}>{errorMessage}</p>
                <button
                  className="popup-close"
                  onClick={() => setShowError(false)}
                >
                  OK
                </button>
              </div>
            </div>
          )}

          {/* FORMULÁRIO */}
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
                    className={`reserve-input ${
                      errors.nome ? "input-error" : ""
                    }`}
                    placeholder={t("nome")}
                    value={form.nome}
                    onChange={handleChange}
                    onMouseEnter={() => setShowSendButton(true)}
                  />
                  {errors.nome && (
                    <span className="reserve-error-inline">{errors.nome}</span>
                  )}
                </div>

                <div className="reserve-field small icon-email">
                  <input
                    type="email"
                    name="email"
                    className={`reserve-input ${
                      errors.email ? "input-error" : ""
                    }`}
                    placeholder={t("email")}
                    value={form.email}
                    onChange={handleChange}
                    onMouseEnter={() => setShowSendButton(true)}
                  />
                  {errors.email && (
                    <span className="reserve-error-inline">{errors.email}</span>
                  )}
                </div>
              </div>

              {/* TELEFONE + ASSUNTO */}
              <div className="reserve-row">
                <div className="reserve-field small icon-telefone">
                  <input
                    type="text"
                    name="telefone"
                    className={`reserve-input ${
                      errors.telefone ? "input-error" : ""
                    }`}
                    placeholder={t("telefone")}
                    value={form.telefone}
                    onChange={handleChange}
                    onMouseEnter={() => setShowSendButton(true)}
                  />
                  {errors.telefone && (
                    <span className="reserve-error-inline">
                      {errors.telefone}
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
                      {errors.mensagem}
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
                <label
                  htmlFor="privacy-checkbox"
                  className="reserve-checkbox-text"
                >
                  {t("liAceitoPolitica")}
                </label>
              </div>

              {/* BOTÃO ENVIAR */}
              <div className="reserve-row single">
                <button
                  type="submit"
                  className={`reserve-submit ${
                    showSendButton ? "visible" : ""
                  }`}
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
          <h2 className="hotel-info-title">{t("tituloQuartos")}</h2>
          <p className="hotel-info-paragraph">{t("quartosIntro1")}</p>
          <p className="hotel-info-paragraph">{t("quartosIntro2")}</p>
          <p className="hotel-info-paragraph">{t("quartosFacilidades")}</p>
          <p className="hotel-info-paragraph bold">{t("texto4")}</p>
          
          {/* ============================
              NOVA GALERIA COM BLOCOS AZUIS
              ============================ */}
          <div className="hotel-mini-gallery">
            {/* FOTO 4 — STANDARD */}
            <div className="quarto-card">
              <img
                src="/images/foto4.jpg"
                alt="Foto 4"
                className="mini-img"
              />
              <div className="quarto-info">
                <h3 className="quarto-title">{t("quartoStandardTitulo")}</h3>
                <p className="quarto-text">{t("quartoStandardDesc")}</p>
                <p className="quarto-text">{t("quartoStandardKit")}</p>
                <p className="quarto-price">{t("quartoStandardPreco")}</p>
              </div>
            </div>

            {/* FOTO 5 — EXECUTIVOS */}
            <div className="quarto-card">
              <img
                src="/images/foto5.jpg"
                alt="Foto 5"
                className="mini-img"
              />
              <div className="quarto-info">
                <h3 className="quarto-title">{t("quartoExecutivoTitulo")}</h3>
                <p className="quarto-text">{t("quartoExecutivoDesc")}</p>
                <p className="quarto-text">{t("quartoExecutivoKit")}</p>
                <p className="quarto-price">{t("quartoExecutivoPreco")}</p>
              </div>
            </div>

            {/* FOTO 6 — SUÍTES */}
            <div className="quarto-card">
              <img
                src="/images/foto6.jpg"
                alt="Foto 6"
                className="mini-img"
              />
              <div className="quarto-info">
                <h3 className="quarto-title">{t("quartoSuiteTitulo")}</h3>
                <p className="quarto-text">{t("quartoSuiteDesc")}</p>
                <p className="quarto-text">{t("quartoSuiteKit")}</p>
                <p className="quarto-price">{t("quartoSuitePreco")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Quartos;