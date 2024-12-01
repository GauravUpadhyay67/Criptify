import { LinearProgress, Typography, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import CoinInfo from "../components/CoinInfo";

const formatNumberWithCommas = (number) => {
  return number?.toLocaleString("en-US");
};

const CoinPage = () => {
  const { id } = useParams();
  const { coins, currency, symbol } = CryptoState();

  const coin = coins.find((coin) => coin.id === id);

  if (!coin) return <LinearProgress sx={{ backgroundColor: "gold" }} />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        p: 3,
      }}
    >
      {/* Sidebar for coin details */}
      <Box
        sx={{
          width: { xs: "100%", md: "30%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRight: { md: "2px solid grey" },
          pr: { md: 3 },
          mb: { xs: 3, md: 0 },
        }}
      >
        <img
          src={coin.image}
          alt={coin.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 2,
            fontFamily: "Montserrat",
          }}
        >
          {coin.name}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: "Montserrat",
            textAlign: "justify",
          }}
          dangerouslySetInnerHTML={{
            __html: coin.description?.split(". ")[0],
          }}
        />
        <Box
          sx={{
            alignSelf: "start",
            width: "100%",
            mt: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Rank */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontFamily: "Montserrat" }}
            >
              Rank:
            </Typography>
            <Typography variant="h5" sx={{ fontFamily: "Montserrat" }}>
              {coin.market_cap_rank}
            </Typography>
          </Box>

          {/* Current Price */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontFamily: "Montserrat" }}
            >
              Current Price:
            </Typography>
            <Typography variant="h5" sx={{ fontFamily: "Montserrat" }}>
              {symbol} {formatNumberWithCommas(coin.current_price)}
            </Typography>
          </Box>

          {/* Market Cap */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontFamily: "Montserrat" }}
            >
              Market Cap:
            </Typography>
            <Typography variant="h5" sx={{ fontFamily: "Montserrat" }}>
              {symbol} {formatNumberWithCommas(coin.market_cap)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* CoinInfo Component */}
      <CoinInfo coin={coin} />
    </Box>
  );
};

export default CoinPage;
