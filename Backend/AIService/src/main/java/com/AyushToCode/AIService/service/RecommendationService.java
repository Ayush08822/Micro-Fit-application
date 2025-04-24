package com.AyushToCode.AIService.service;

import com.AyushToCode.AIService.entity.Recommendation;
import com.AyushToCode.AIService.repo.RecommendationRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class RecommendationService {
    private final RecommendationRepo recommendationRepo;

    public List<Recommendation> getUserRecommendation(String userId) {
        return recommendationRepo.findByUserId(userId);
    }

    public Recommendation getActivityRecommendation(String activityId) {
        return recommendationRepo.findByActivityId(activityId).orElseThrow(() -> new RuntimeException("No recommendatio n found for this activity: " + activityId));
    }

    public Boolean ActivityExistsOrNot(String activityId) {
        return recommendationRepo.findByActivityId(activityId).isPresent();
    }
}
