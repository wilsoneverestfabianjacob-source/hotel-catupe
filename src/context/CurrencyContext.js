import { createContext, useState, useEffect, useContext } from "react";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const storedCurrency = localStorage.getItem("currency");
  const [currency, setCurrency] = useState(storedCurrency || "MZN");
  const [rate, setRate] = useState(1);

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch(
          "https://api.exchangerate.host/latest?base=MZN&symbols=USD"
        );
        const data = await res.json();
        setRate(data.rates.USD);
      } catch (err) {
        console.error("Erro ao obter câmbio:", err);
      }
    }
    fetchRate();
  }, []);

  // Guardar moeda sempre que mudar
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const convert = (value) => {
    if (currency === "MZN") return value;
    return value * rate;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
