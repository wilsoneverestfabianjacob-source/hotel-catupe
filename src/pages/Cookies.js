import "../styles/legal.css";
import { useTranslation } from "../hooks/useTranslation";

function Cookies() {
  const { t } = useTranslation();
  const secoes = t("cookiesSecoes");

  return (
    <div className="legal-container">
      <h1 className="legal-title">{t("cookiesTitulo")}</h1>

      {secoes.map((secao, index) => {
        if (secao.tipo === "paragrafo") {
          return (
            <p key={index} className="legal-text">
              {secao.conteudo}
            </p>
          );
        }

        if (secao.tipo === "titulo") {
          return (
            <h2 key={index} className="legal-subtitle">
              {secao.conteudo}
            </h2>
          );
        }

        if (secao.tipo === "lista") {
          return (
            <ul key={index} className="legal-text">
              {secao.itens.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        }

        return null;
      })}
    </div>
  );
}

export default Cookies;
