import React, { useEffect } from "react";
import { CryptoState } from "../../CryptoContext";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const Carousel = () => {
  const { coins, currency, symbol } = CryptoState();

  const items = coins.slice(0, 10).map((coin) => {
    const profit = coin?.price_change_percentage_24h >= 0;

    return (
      <Link
        key={coin.id}
        to={`/coins/${coin.id}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          textTransform: "uppercase",
          color: "white",
          textDecoration: "none",
        }}
      >
        <img
          src={coin?.image}
          alt={coin?.name}
          height="80"
          style={{ marginBottom: 10, marginTop: 50 }}
        />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {coin?.symbol} &nbsp;
          <span style={{ color: profit ? "green" : "red", fontWeight: "bold" }}>
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </Typography>
        <Typography variant="h6" sx={{ fontSize: 22, fontWeight: 500 }}>
          {symbol} {coin?.current_price.toLocaleString()}
        </Typography>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <Box sx={{ height: "50%", display: "flex", alignItems: "center" }}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        responsive={responsive}
        items={items}
        autoPlay
      />
    </Box>
  );
};

export default Carousel;
