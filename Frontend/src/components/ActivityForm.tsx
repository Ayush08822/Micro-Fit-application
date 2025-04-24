import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Modal,
  Fade,
  Alert,
  Backdrop,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import CloseIcon from "@mui/icons-material/Close"; // Import Close icon
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { Typography } from "@mui/material";
import { Activity } from "../models/ActivityRequestDTO";
import { useDispatch } from "react-redux";
import { setValueFlag } from "../store/authReducer";
export const ActivityForm = ({}) => {
  const dispatch = useDispatch();
  const [activityType, setActivityType] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");

  const [metricKey, setMetricKey] = useState("");
  const [metricValue, setMetricValue] = useState("");
  const [additionalMetrics, setAdditionalMetrics] = useState<{
    [key: string]: any;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle loading
  const [error, setError] = useState<string | null>(null); // State to handle error
  const [openSnackbar, setOpenSnackbar] = useState(false); // State to control Snackbar

  // Modal state
  const [openModal, setOpenModal] = useState(false);

  const handleAddMetric = () => {
    if (metricKey.trim() !== "" && metricValue.trim() !== "") {
      setAdditionalMetrics((prev) => ({
        ...prev,
        [metricKey]: metricValue,
      }));
      setMetricKey("");
      setMetricValue("");
    }
  };

  const handleRemoveMetric = (key: string) => {
    const updated = { ...additionalMetrics };
    delete updated[key];
    setAdditionalMetrics(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Start the loading state
    setOpenModal(true); // Show the modal during submission

    const activityRequestDTO = new Activity(
      activityType,
      Number(duration),
      Number(calories),
      additionalMetrics
    );

    // Step 2: Get token and userId from localStorage
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("User not authenticated.");
      setIsSubmitting(false);
      setOpenModal(false);
      return;
    }

    try {
      //Step 3: Call the API
      const response = await fetch(
        "http://localhost:8072/ACTIVITYSERVICE/api/activities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-User-Id": userId,
          },
          body: JSON.stringify(activityRequestDTO),
        }
      );

      if (response.ok) {
        console.log("Activity submitted successfully");
      } else {
        const errorData = await response.json();
        console.error("Submission failed:", errorData);
        setError("Failed to submit activity. Please try again.");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("Error during API call:", err);
      setError("Something went wrong! Please try again later.");
      setOpenSnackbar(true);
    }
    console.log("Submitted Activity:", activityRequestDTO);
    dispatch(setValueFlag({ flag: true }));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}
    >
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <DirectionsRunIcon sx={{ fontSize: 40, color: "primary.main" }} />
        <Typography variant="h4" component="h1" color="primary">
          Activity Tracker
        </Typography>
      </Box>
      <TextField
        select
        label="Activity Type"
        value={activityType}
        onChange={(e) => setActivityType(e.target.value)}
        required
      >
        <MenuItem value="RUNNING">RUNNING</MenuItem>
        <MenuItem value="CYCLING">CYCLING</MenuItem>
        <MenuItem value="SWIMMING">SWIMMING</MenuItem>
        <MenuItem value="WALKING">WALKING</MenuItem>
        <MenuItem value="YOGA">GYM</MenuItem>
      </TextField>

      <TextField
        label="Duration (minutes)"
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        required
      />

      <TextField
        label="Calories Burned"
        type="number"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        required
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="subtitle1">Additional Metrics</Typography>
        <Tooltip
          title={
            <Box>
              <Typography variant="body2">
                Add custom metrics for your activity:
              </Typography>
              <Typography variant="body2">
                • Example 1: pace = 30km/h
              </Typography>
              <Typography variant="body2">
                • Example 2: heartRate = 140bpm
              </Typography>
            </Box>
          }
          arrow
        >
          <InfoIcon color="primary" sx={{ cursor: "pointer" }} />
        </Tooltip>
      </Box>

      {/* Additional Metrics Inputs */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          label="Metric Key"
          value={metricKey}
          onChange={(e) => setMetricKey(e.target.value)}
          placeholder="e.g., pace, heartRate"
        />
        <TextField
          label="Metric Value"
          value={metricValue}
          onChange={(e) => setMetricValue(e.target.value)}
          placeholder="e.g., 30km/h, 40bpm"
        />
        <IconButton onClick={handleAddMetric} color="primary">
          <AddIcon />
        </IconButton>
      </Box>

      {/* List of Added Metrics */}
      {Object.entries(additionalMetrics).map(([key, value]) => (
        <Box key={key} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField value={key} disabled label="Key" />
          <TextField value={value} disabled label="Value" />
          <IconButton onClick={() => handleRemoveMetric(key)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Button type="submit" variant="contained" color="primary">
        Log Activity
      </Button>

      {/* Logout Button */}
      {/* Snackbar for error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
          {error}
        </Alert>
      </Snackbar>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
              boxShadow: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton
              onClick={() => setOpenModal(false)} // Close the modal manually
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "primary.main",
              }}
            >
              <CloseIcon />
            </IconButton>
            <CircularProgress />
            <Typography variant="h6">
              Please wait for few seconds in order to generate recommendations.
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};
