import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { Activity, LogOut } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { logout, setCredentials } from "../store/authReducer";
import { ActivityDetail } from "./ActivityDetail";
import { ActivityForm } from "./ActivityForm";
import { ActivityList } from "./ActivityList";
import { ProtectedRoute } from "./ProtectedRoute";
import running from "../assets/running.jpg";
import swimming from "../assets/swimming.jpg";
import cycling from "../assets/cycling.jpg";

const ActivityPage = ({ onLogout }: { onLogout: () => void }) => (
  <Paper
    elevation={3}
    sx={{
      p: 4,
      borderRadius: 2,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    }}
  >
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
    >
      <Typography variant="h5" fontWeight="bold">
        Activities Dashboard
      </Typography>
      <Button
        variant="outlined"
        color="secondary"
        onClick={onLogout}
        startIcon={<LogOut size={20} />}
      >
        Logout
      </Button>
    </Stack>
    <ActivityForm />
    <ActivityList />
  </Paper>
);

export const Homepage = () => {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const showButtons = location.pathname === "/";

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
    } else {
      setAuthReady(false);
    }
  }, [token, tokenData]);

  const handleLogout = async () => {
    dispatch(logout());
    logOut();
    navigate("/");
  };

  const handleGoToActivities = () => navigate("/activities");

  return (
    <Box sx={{ position: "relative", width: "100%", minHeight: "97vh" }}>
      {showButtons && (
        <Box
          component="img"
          src="/src/assets/fitness.jpg"
          alt="Background"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            filter: "blur(10px)",
            zIndex: -1,
          }}
        />
      )}

      <Container
        maxWidth="lg"
        sx={{ position: "relative", overflow: "hidden", py: 4 }}
      >
        {showButtons && (
          <Typography
            variant="h1"
            align="center"
            sx={{
              mb: 4,
              fontSize: { xs: "2rem", md: "3rem" },
              color: "white",
              fontWeight: "bold",
            }}
          >
            Let's be FIT
          </Typography>
        )}

        {showButtons && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              mb: 4,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              onClick={() => logIn()} // ✅ This fixes the error
              disabled={authReady}
              size="large"
              startIcon={<Activity size={20} />}
              sx={{
                minWidth: 200,
                py: 1.5,
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.9),
                "&:hover": {
                  backgroundColor: "primary.main",
                },
              }}
            >
              Login
            </Button>

            {authReady && (
              <Button
                variant="outlined"
                onClick={handleGoToActivities}
                size="large"
                sx={{ minWidth: 200, py: 1.5, color: "white" }}
              >
                View Activities
              </Button>
            )}
          </Stack>
        )}

        <Routes>
          <Route
            path="/activities"
            element={
              <ProtectedRoute>
                <ActivityPage onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activities/:id"
            element={
              <ProtectedRoute>
                <ActivityDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <Box
                sx={{
                  textAlign: "center",
                  mt: 4,
                  display: showButtons ? "block" : "none",
                }}
              >
                <Typography
                  variant="h6"
                  color="white"
                  sx={{ maxWidth: 600, mx: "auto" }}
                >
                  Get <b>FIT</b> and manage your activities with our modern,
                  intuitive platform. Sign in to get started or register for a
                  new account.
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                  mt={4}
                  flexWrap="wrap"
                >
                  {[running, cycling, swimming].map((img, i) => (
                    <Box
                      key={i}
                      component="img"
                      src={img}
                      alt={`Workout ${i}`}
                      sx={{
                        width: { xs: "100%", sm: "30%" },
                        height: 200,
                        objectFit: "cover",
                        borderRadius: 2,
                        boxShadow: 3,
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: 6,
                        },
                      }}
                    />
                  ))}
                </Stack>
                <Typography
                  variant="h6"
                  align="center"
                  mt={4}
                  color="white"
                  sx={{ fontStyle: "italic" }}
                >
                  "Take care of your body. It's the only place you have to
                  live." – Jim Rohn
                </Typography>
              </Box>
            }
          />
        </Routes>
      </Container>
    </Box>
  );
};

