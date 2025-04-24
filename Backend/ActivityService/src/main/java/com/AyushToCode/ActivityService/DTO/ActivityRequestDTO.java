package com.AyushToCode.ActivityService.DTO;

import com.AyushToCode.ActivityService.entity.ActivityType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityRequestDTO {
    //This userId is actually the keycloakId.
    private String userId;

    private ActivityType type;

    private Integer duration;

    private Integer caloriesBurned;

    private LocalDateTime startTime;

    private Map<String , Object> additionalMetrics;
}
