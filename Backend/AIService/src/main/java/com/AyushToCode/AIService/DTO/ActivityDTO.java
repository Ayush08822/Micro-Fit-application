package com.AyushToCode.AIService.DTO;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityDTO {
    private String id;
    private String userId;
    private String type;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private Map<String , Object> additionalMetrics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
