import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
import {
  Box,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TextField,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { currency, symbol } = CryptoState();
  const navigate = useNavigate();

  const coinsPerPage = 10;

  const fetchCoins = async () => {
    setLoading(true);
    const cachedData = localStorage.getItem(`coins-${currency}`);
    if (cachedData) {
      setCoins(JSON.parse(cachedData));
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.get(
        `${CoinList(currency)}&per_page=100&page=1`
      );
      setCoins(data);
      localStorage.setItem(`coins-${currency}`, JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const filteredCoins = useMemo(() => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [coins, search]);

  const totalPages = Math.ceil(filteredCoins.length / coinsPerPage);

  const displayedCoins = useMemo(() => {
    const startIndex = (currentPage - 1) * coinsPerPage;
    return filteredCoins.slice(startIndex, startIndex + coinsPerPage);
  }, [filteredCoins, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleRowClick = (coinId) => {
    navigate(`/coins/${coinId}`);
  };

  return (
    <Box
      sx={{
        padding: "24px",
        backgroundColor: "#14161a",
        color: "white",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: "20px",
          fontFamily: "Montserrat",
          textAlign: "center",
        }}
      >
        Cryptocurrency Prices by Market Cap
      </Typography>

      <TextField
        label="Search for a Cryptocurrency..."
        variant="outlined"
        InputLabelProps={{
          style: { color: "gold" },
        }}
        sx={{
          marginBottom: 4,
          marginTop: 4,
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "transparent",
          borderRadius: "4px",
          "& .MuiOutlinedInput-root": {
            color: "gold",
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "gold",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
        }}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <TableContainer>
        {loading ? (
          <CircularProgress
            sx={{
              display: "block",
              margin: "50px auto",
              color: "gold",
            }}
          />
        ) : displayedCoins.length > 0 ? (
          <>
            <Table>
              <TableHead sx={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      key={head}
                      align={head === "Coin" ? "left" : "right"}
                      sx={{
                        color: "black",
                        fontWeight: "bold",
                        fontFamily: "Montserrat",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedCoins.map((coin) => (
                  <TableRow
                    key={coin.id}
                    onClick={() => handleRowClick(coin.id)}
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#16171a",
                        transform: "scale(1.02)",
                        boxShadow: "0px 4px 15px rgba(255, 215, 0, 0.2)",
                      },
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <img
                          src={coin.image}
                          alt={coin.name}
                          height="50"
                          style={{ marginRight: 10 }}
                        />
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ fontFamily: "Montserrat", color: "white" }}
                          >
                            {coin.symbol.toUpperCase()}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "lightgray",
                              fontFamily: "Montserrat",
                            }}
                          >
                            {coin.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "white", fontFamily: "Montserrat" }}
                    >
                      {symbol} {coin.current_price.toLocaleString()}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          coin.price_change_percentage_24h >= 0
                            ? "#00FF00"
                            : "#FF0000",
                        fontWeight: "bold",
                      }}
                    >
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "white", fontFamily: "Montserrat" }}
                    >
                      {symbol} {coin.market_cap.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              sx={{
                padding: "20px",
                display: "flex",
                justifyContent: "center",
                "& .MuiPaginationItem-root": {
                  color: "gold",
                },
              }}
            />
          </>
        ) : (
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "gray",
              marginTop: 4,
              fontFamily: "Montserrat",
            }}
          >
            No coins match your search.
          </Typography>
        )}
      </TableContainer>
    </Box>
  );
};

export default CoinsTable;
