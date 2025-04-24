package com.AyushToCode.AIService.service;

import com.AyushToCode.AIService.DTO.ActivityDTO;
import com.AyushToCode.AIService.entity.Recommendation;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
public class ActivityAIService {
    private static final Logger log = LoggerFactory.getLogger(ActivityAIService.class);

    private final GeminiService geminiService;

    public Recommendation generateRecommendations(ActivityDTO activity) {
        String prompt = createPromptForActivity(activity);
        log.info("Sending the prompt to AI: ");
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("RESPONSE FROM AI: {} ", aiResponse);
        return processAIResponse(activity, aiResponse);
    }

    private Recommendation processAIResponse(ActivityDTO activityDTO, String aiResponse) {
        try {

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(aiResponse);
            JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");

            String jsonContent = textNode.asText().replaceAll("```json\\n", "").replaceAll("\\n```", "").trim();

            log.info("PARSED RESPONSE FROM AI: {} ", jsonContent);

            JsonNode analysisJson = objectMapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");
            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall:");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart-Rate:");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories:");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety = extractSafetyGuidelines(analysisJson.path("safety"));

            return Recommendation.builder().activityId(activityDTO.getId()).userId(activityDTO.getUserId()).activityType(activityDTO.getType()).recommendation(fullAnalysis.toString().trim()).improvements(improvements).suggestions(suggestions).safety(safety).createdAt(LocalDateTime.now()).build();
        } catch (Exception e) {
            e.printStackTrace();
            return createDefaultResponse(activityDTO);
        }
    }

    private Recommendation createDefaultResponse(ActivityDTO activityDTO) {
        return Recommendation.builder().activityId(activityDTO.getId()).userId(activityDTO.getUserId()).activityType(activityDTO.getType()).recommendation("Unable to generate detailed analysis.").improvements(Collections.singletonList("Continue with your current routine.")).suggestions(Collections.singletonList("Consider consulting a fitness coach.")).safety(Arrays.asList("Always warm up before exercise", "Stay hydrated", "Listen to your body")).createdAt(LocalDateTime.now()).build();
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> safety.add(item.asText()));
        }
        return safety.isEmpty() ? Collections.singletonList("No specific safety guidelines provided") : safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if (suggestionsNode.isArray()) {
            suggestionsNode.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s", workout, description));
            });
        }
        return suggestions.isEmpty() ? Collections.singletonList("No specific suggestions provided") : suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if (improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));
            });
        }
        return improvements.isEmpty() ? Collections.singletonList("No specific improvements provided") : improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if (!analysisNode.path(key).isMissingNode()) {
            fullAnalysis.append(prefix).append(analysisNode.path(key).asText()).append("\n\n");
        }
    }

    private String createPromptForActivity(ActivityDTO activity) {
        return String.format("""
                Analyze this fitness activity and provide detailed recommendations in the following JSON format.
                {
                   "analysis":
                   {
                      "overall": "Overall analysis here",
                      "pace": "Pace and analysis here",
                      "heartRate": "Heart rate analysis here",
                      "caloriesBurned": "Calories analysis here"
                   },
                "improvements":[
                 {
                    "area": "Area name",
                    "recommendation": "Detailed recommendation"
                 }
                ],
                "suggestions": [
                 {
                    "workout": "Workout name",
                    "description": "Detailed workout description"
                 }
                ],
                "safety": [
                    "Safety point 1",
                    "Safety point 2"
                  ]
                }
                
                Analyze this activity:
                Activity Type: %s
                Duration: %d minutes
                Calories Burned: %d
                Additional Metrics: %s
                
                Provide detailed analysis focusing on performance, improvements, next workout suggestions and safety measures.
                Ensure the response follows the EXACT JSON format shown above.
                """, activity.getType(), activity.getDuration(), activity.getCaloriesBurned(), activity.getAdditionalMetrics());
    }
}
