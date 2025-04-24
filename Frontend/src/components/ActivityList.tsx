import { Box, Card, CardActionArea, CardContent , Chip, Grid, Typography } from "@mui/material";
import  { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ActivityResponseDTO } from "../models/ActivityResponseDTO.ts";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../store/store.ts'; // adjust path as needed
import { setValueFlag } from "../store/authReducer.ts";

export const ActivityList = () => {
  const [activities, setActivities] = useState<ActivityResponseDTO[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const flag = useSelector((state: RootState) => state.auth.flag);
  console.log(flag);
  useEffect(() =>{
    fetchActivities();
  },[flag])

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token") ?? "";
      const userId = localStorage.getItem("userId") ?? "";

      const response = await fetch(
        "http://localhost:8072/ACTIVITYSERVICE/api/activities",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-User-Id": userId,
          },
        }
      );
      console.log(response);

      if (!response.ok) {
        const error = await response.text();
        console.error("Failed to fetch activities:", error);
        return;
      }
      const responseJson = await response.json();
      setActivities(responseJson);
      console.log("Fetched activities:", responseJson);
      dispatch(setValueFlag({ flag: false }));
    } catch (err) {
      console.error("Error while fetching activities:", err);
    }
  };
  return (
    <Grid container spacing={3}>
      {activities.map((activity) => (
        <Grid      
          key={activity.id}
        >
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 12,
                opacity: 0.95,
              },
              backgroundColor: "#f8f9fa", // Light background for cards
            }}
          >
            <CardActionArea onClick={() => navigate(`/activities/${activity.id}`)}>
              <CardContent sx={{ padding: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: "#0D47A1", // Dark blue for titles
                  }}
                >
                  {activity.type}
                </Typography>
  
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                  Duration: <strong>{activity.duration} mins</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                  Calories: <strong>{activity.caloriesBurned}</strong>
                </Typography>
  
                <Box mt={1}>
                  <Typography variant="caption" color="text.secondary">
                    Created at: {new Date(activity.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
  
                {/* Additional Metrics */}
                {activity.additionalMetrics && Object.keys(activity.additionalMetrics).length > 0 && (
                  <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                    {Object.entries(activity.additionalMetrics).map(([key, value]) => (
                      <Chip
                        key={key}
                        label={`${key}: ${value}`}
                        variant="outlined"
                        size="small"
                        sx={{
                          fontSize: "0.75rem",
                          backgroundColor: "#e3f2fd", // Light blue background for tags
                          color: "#0D47A1", // Text color to match header
                          borderColor: "#0D47A1", // Border color
                        }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};


