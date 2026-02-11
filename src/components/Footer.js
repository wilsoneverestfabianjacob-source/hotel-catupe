import "../styles/footer.css";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";

function Footer() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const langPrefix = language.startsWith("en") ? "/en" : "/pt";

  return (
    <>
      <div className="footer-teak">
        <div className="footer-wrapper">
          <div className="footer-block">

            <div className="footer-line">
              <span className="footer-icon footer-icon-location" />
              <a
                href="https://maps.app.goo.gl/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-text-link"
              >
                {t("contactosEndereco")}
              </a>
            </div>

            <div className="footer-gap" />

            <div className="footer-line">
              <span className="footer-icon footer-icon-phone" />
              <a href="tel:+258847381617" className="footer-text-link">
                {t("contactosTelefoneReservas")}
              </a>
            </div>

            <div className="footer-phone-row">
              <div className="footer-line footer-line-inline">
                <span className="footer-icon-placeholder" />
                <a href="tel:+258871381617" className="footer-text-link">
                  {t("contactosTelefoneInfo")}
                </a>
              </div>

              <div className="footer-social">
                <a
                  href="https://facebook.com/hotelcatupe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon social-icon-fb"
                  aria-label="Facebook"
                />

                <a
                  href="https://instagram.com/hotelcatupe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon social-icon-ig"
                  aria-label="Instagram"
                />

                <a
                  href="https://wa.me/258847381617"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon social-icon-wa"
                  aria-label="WhatsApp"
                />
              </div>
            </div>

            <div className="footer-gap" />

            <div className="footer-line">
              <span className="footer-icon footer-icon-mail" />
              <a
                href="mailto:reservas@hotelcatupe.co.mz"
                className="footer-text-link"
              >
                {t("contactosEmailReservas")}
              </a>
            </div>

            <div className="footer-line">
              <span className="footer-icon-placeholder" />
              <a
                href="mailto:info@hotelcatupe.co.mz"
                className="footer-text-link"
              >
                {t("contactosEmailInfo")}
              </a>
            </div>

          </div>
        </div>
      </div>

      <footer className="footer-merlin">
        <div className="footer-inner">
          <div className="footer-legal">
            <span>© 2020–2026 HOTEL CATUPE. {t("footerDireitos")}</span>

            <span className="footer-spacer" />

            <span className="footer-links">
              <Link
                to={`${langPrefix}/${language.startsWith("en") ? "privacy" : "privacidade"}`}
                className="footer-legal-link"
              >
                {t("footerPrivacidade")}
              </Link>

              {" | "}

              <Link
                to={`${langPrefix}/cookies`}
                className="footer-legal-link"
              >
                {t("footerCookies")}
              </Link>

              {" | "}

              <Link
                to={`${langPrefix}/${language.startsWith("en") ? "terms" : "termos"}`}
                className="footer-legal-link"
              >
                {t("footerTermos")}
              </Link>
            </span>

            <span className="footer-spacer" />

            <a href="tel:+258847381617" className="footer-legal-link">
              {t("footerDesenvolvido")}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
