package com.AyushToCode.AIService.controller;

import com.AyushToCode.AIService.entity.Recommendation;
import com.AyushToCode.AIService.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendation")
@Tag(name = "AIService Service", description = "Operations related to fetching of user's recommendation, fetching recommendation by activityId and adding recommendation data to the database.")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
    @Operation(summary = "Accepts userId.", description = "Returns a list of recommendations for a particular user.")
    public ResponseEntity<List<Recommendation>> getUserRecommendation(@Parameter(description = "Accepting user ID")@PathVariable String userId){
        return new ResponseEntity<>(recommendationService.getUserRecommendation(userId) , HttpStatus.OK);
    }
    @GetMapping("/activity/{activityId}")
    @Operation(summary = "Accepts activityId as a path variable.", description = "Returns a single recommendation.")
    public ResponseEntity<Recommendation> getActivityRecommendation(@Parameter(description = "Accepting the activity ID")@PathVariable String activityId){
        return new ResponseEntity<>(recommendationService.getActivityRecommendation(activityId) , HttpStatus.OK);
    }
}
