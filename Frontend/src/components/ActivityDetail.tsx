import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Container,
  Chip,
  Paper,
  styled,
  BoxProps,
} from "@mui/material";
import {
  CheckCircle,
  Lightbulb,
  AlertTriangle,
  Clock,
  Calendar,
  Activity as ActivityIcon,
} from "lucide-react";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  },
}));

const MetricBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: "rgba(0, 0, 0, 0.02)",
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

interface IconBoxProps extends BoxProps {
  bgcolor?: string; // Use 'bgcolor' instead of 'color' to avoid conflicts
}
const IconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "bgcolor",
})<IconBoxProps>(({ theme, bgcolor }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: bgcolor || theme.palette.primary.main,
  color: "#fff",
  marginRight: theme.spacing(2),
}));

export const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") ?? "";
        const userId = localStorage.getItem("userId") ?? "";
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-User-Id": userId,
        };

        const [activityResponse, recommendationResponse] = await Promise.all([
          fetch(`http://localhost:8072/ACTIVITYSERVICE/api/activities/${id}`, {
            headers,
          }),
          fetch(
            `http://localhost:8072/AISERVICE/api/recommendation/activity/${id}`,
            { headers }
          ),
        ]);

        const [activityData, recommendationData] = await Promise.all([
          activityResponse.json(),
          recommendationResponse.json(),
        ]);

        setActivity(activityData);
        setRecommendation(recommendationData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress size={40} thickness={4} />
        </Box>
      </Container>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StyledCard>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Typography variant="h5" fontWeight="bold">
              Activity Overview
            </Typography>
            <Chip
              label={activity.type}
              color="primary"
              sx={{ fontWeight: 500 }}
            />
          </Box>

          <MetricBox>
            <IconBox>
              <Clock size={24} />
            </IconBox>
            <Box>
              <Typography variant="h6">{activity.duration} minutes</Typography>
              <Typography variant="body2" color="text.secondary">
                Duration
              </Typography>
            </Box>
          </MetricBox>

          <MetricBox>
            <IconBox color="#f59e0b">
              <ActivityIcon size={24} />
            </IconBox>
            <Box>
              <Typography variant="h6">
                {activity.caloriesBurned} calories
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calories Burned
              </Typography>
            </Box>
          </MetricBox>

          <MetricBox>
            <IconBox color="#10b981">
              <Calendar size={24} />
            </IconBox>
            <Box>
              <Typography variant="h6">
                {formatDate(activity.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date & Time
              </Typography>
            </Box>
          </MetricBox>

          {activity.additionalMetrics && (
            <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Additional Metrics
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 2,
                }}
              >
                {Object.entries(activity.additionalMetrics).map(
                  ([key, value]) => (
                    <Box
                      key={key}
                      sx={{
                        p: 1.5,
                        bgcolor: "rgba(0, 0, 0, 0.02)",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {String(value)}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            </Paper>
          )}
        </CardContent>
      </StyledCard>

      {recommendation && (
        <StyledCard>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Overall Analysis
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 4,
                bgcolor: "rgba(25, 118, 210, 0.04)",
                borderLeft: "4px solid #1976d2",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
                {recommendation.recommendation}
              </Typography>
            </Paper>

            <Box>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <CheckCircle
                  size={20}
                  color="#16a34a"
                  style={{ marginRight: 8 }}
                />
                Improvements
              </Typography>
              <List>
                {recommendation.improvements.map(
                  (item: string, index: number) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: "background.paper",
                        mb: 1,
                        borderRadius: 1,
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateX(8px)",
                          bgcolor: "rgba(0, 0, 0, 0.02)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <CheckCircle size={20} color="#16a34a" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  )
                )}
              </List>
            </Box>

            <Box mt={4}>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <Lightbulb
                  size={20}
                  color="#2563eb"
                  style={{ marginRight: 8 }}
                />
                Suggestions
              </Typography>
              <List>
                {recommendation.suggestions.map(
                  (item: string, index: number) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: "background.paper",
                        mb: 1,
                        borderRadius: 1,
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateX(8px)",
                          bgcolor: "rgba(0, 0, 0, 0.02)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Lightbulb size={20} color="#2563eb" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  )
                )}
              </List>
            </Box>

            <Box mt={4}>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <AlertTriangle
                  size={20}
                  color="#ea580c"
                  style={{ marginRight: 8 }}
                />
                Safety Tips
              </Typography>
              <List>
                {recommendation.safety.map((item: string, index: number) => (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: "background.paper",
                      mb: 1,
                      borderRadius: 1,
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateX(8px)",
                        bgcolor: "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <AlertTriangle size={20} color="#ea580c" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </CardContent>
        </StyledCard>
      )}
    </Container>
  );
};

export default ActivityDetail;
