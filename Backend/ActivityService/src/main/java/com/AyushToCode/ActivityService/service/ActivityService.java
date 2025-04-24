package com.AyushToCode.ActivityService.service;

import com.AyushToCode.ActivityService.DTO.ActivityRequestDTO;
import com.AyushToCode.ActivityService.DTO.ActivityResponseDTO;
import com.AyushToCode.ActivityService.FeignClient.UserFeignClient;
import com.AyushToCode.ActivityService.entity.Activity;
import com.AyushToCode.ActivityService.repo.ActivityRepo;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class ActivityService {
    private static final Logger log = LoggerFactory.getLogger(ActivityService.class);
    private final ActivityRepo activityRepo;
    private final ModelMapper modelMapper;
    private final UserFeignClient userFeignClient;
    private final StreamBridge streamBridge;

    public ActivityResponseDTO trackActivity(ActivityRequestDTO activityRequest) {

        Boolean isValidUser= userFeignClient.getUserId(activityRequest.getUserId()).getBody();
        if(Boolean.FALSE.equals(isValidUser)){
            throw new RuntimeException("Invalid User: " + activityRequest.getUserId());
        }
        Activity activity = new Activity();
        activity.setUserId(activityRequest.getUserId());
        activity.setType(activityRequest.getType());
        activity.setDuration(activityRequest.getDuration());
        activity.setCaloriesBurned(activityRequest.getCaloriesBurned());
        activity.setStartTime(activityRequest.getStartTime());
        activity.setAdditionalMetrics(activityRequest.getAdditionalMetrics());

        Activity savedActivity = activityRepo.save(activity);
        var result = streamBridge.send("sendFitnessDetails-out-0" , savedActivity);
        log.info("Is the Communication request successfully triggered ? : {}", result);
        return modelMapper.map(savedActivity , ActivityResponseDTO.class);
    }

    public List<ActivityResponseDTO> getUserActivities(String keycloakId) {
        List<Activity> activities = activityRepo.findByUserId(keycloakId);
        return activities.stream().map((activity) -> modelMapper.map(activity , ActivityResponseDTO.class)).toList();
    }

    public ActivityResponseDTO getActivityById(String activityId) {
        return activityRepo.findById(activityId).map((activity) -> modelMapper.map(activity , ActivityResponseDTO.class)).orElseThrow(()-> new RuntimeException("No activity found"));
    }
}
