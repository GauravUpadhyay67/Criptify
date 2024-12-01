import React, { useState, useEffect } from "react";
import axios from "axios";
import { HistoricalChart } from "../config/api";
import { CircularProgress, CssBaseline, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { chartDays } from "../config/data";
import SelectButton from "./SelectButton";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const CoinInfo = () => {
  const { id } = useParams();
  const [historicData, setHistoricData] = useState([]);
  const [days, setDays] = useState(365);
  const [loading, setLoading] = useState(true);

  const fetchHistoricData = async () => {
    try {
      const { data } = await axios.get(HistoricalChart(id, days, "USD"));
      setHistoricData(data.prices);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricData();
  }, [id, days]);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#fff",
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          flex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          backgroundColor: "#1e1e1e",
          padding: "20px",
          borderRadius: "10px",
          height: "80vh",
          maxHeight: "600px",
        }}
      >
        {loading ? (
          <CircularProgress color="primary" size={150} thickness={1.5} />
        ) : (
          <>
            <Line
              data={{
                labels: historicData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: historicData.map((coin) => coin[1]),
                    label: `Price (Past ${days} Days) in INR`,
                    borderColor: "#EEBC1D",
                    borderWidth: 2,
                    pointRadius: 0,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                    labels: { color: "#fff" },
                  },
                  tooltip: {
                    enabled: true,
                    backgroundColor: "#333",
                    titleColor: "#fff",
                  },
                },
                scales: {
                  x: {
                    ticks: { color: "#ccc" },
                    grid: { display: false },
                  },
                  y: {
                    ticks: { color: "#ccc", callback: (value) => `₹${value}` },
                    grid: { color: "rgba(255,255,255,0.1)" },
                  },
                },
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
            />

            {/* Button Container */}
            <Box
              sx={{
                display: "flex",
                marginTop: 2,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  selected={days === day.value}
                  onClick={() => setDays(day.value)}
                >
                  {day.label}
                </SelectButton>
              ))}
            </Box>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default CoinInfo;
