package com.AyushToCode.AIService.functions;

import com.AyushToCode.AIService.DTO.ActivityDTO;
import com.AyushToCode.AIService.entity.Recommendation;
import com.AyushToCode.AIService.repo.RecommendationRepo;
import com.AyushToCode.AIService.service.ActivityAIService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
@AllArgsConstructor
public class AIFunctions {
    private static final Logger log = LoggerFactory.getLogger(AIFunctions.class);
    private final ActivityAIService aiService;
    private final RecommendationRepo recommendationRepo;

    @Bean
    public Consumer<ActivityDTO> fitnessDetails(){
       return activityDTO -> {
           log.info("Data received from the queue: {} " , activityDTO);
           Recommendation recommendation = aiService.generateRecommendations(activityDTO);
           recommendationRepo.save(recommendation);
       };
    }
}
