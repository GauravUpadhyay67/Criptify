import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { CoinList } from "./config/api";

const Crypto = createContext();

export const CryptoContext = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");

  const fetchCoins = async () => {
    setLoading(true);
    const cachedData = localStorage.getItem(`coins-${currency}`);
    if (cachedData) {
      setCoins(JSON.parse(cachedData));
    } else {
      try {
        const { data } = await axios.get(
          `${CoinList(currency)}&per_page=100&page=1`
        );
        setCoins(data);
        localStorage.setItem(`coins-${currency}`, JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
  }, [currency]);

  useEffect(() => {
    fetchCoins();

    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, [currency]);

  return (
    <Crypto.Provider
      value={{ coins, loading, currency, symbol, setCurrency, setSymbol }}
    >
      {children}
    </Crypto.Provider>
  );
};

export const CryptoState = () => {
  return useContext(Crypto);
};
