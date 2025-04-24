package com.AyushToCode.ActivityService.controller;

import com.AyushToCode.ActivityService.DTO.ActivityRequestDTO;
import com.AyushToCode.ActivityService.DTO.ActivityResponseDTO;
import com.AyushToCode.ActivityService.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
@Tag(name = "Activity Service", description = "Operations related to fetching of user's activities, fetching activity by Id and adding activity data to the database.")
public class ActivityController {
    private final ActivityService activityService;

    @PostMapping
    @Operation(summary = "Accepts activityDetails and keycloakId from the request body and headers respectively.", description = "Returns a single activity")
    public ResponseEntity<ActivityResponseDTO> trackActivity(@RequestBody ActivityRequestDTO activityRequest , @RequestHeader("X-User-Id") String keycloakId){
        if(keycloakId != null) activityRequest.setUserId(keycloakId);
        return new ResponseEntity<>(activityService.trackActivity(activityRequest) , HttpStatus.OK);
    }

    @GetMapping
    @Operation(summary = "Accepts keycloakId from the request headers.", description = "Returns a list of activities")
    public ResponseEntity<List<ActivityResponseDTO>> getUserActivities(@RequestHeader("X-User-Id") String keycloakId){
        return new ResponseEntity<>(activityService.getUserActivities(keycloakId) , HttpStatus.OK);
    }

    @GetMapping("/{activityId}")
    @Operation(summary = "Accepts activity Id.", description = "Returns a single activity")
    public ResponseEntity<ActivityResponseDTO> getActivities(@PathVariable String activityId){
        return new ResponseEntity<>(activityService.getActivityById(activityId) , HttpStatus.OK);
    }


}
