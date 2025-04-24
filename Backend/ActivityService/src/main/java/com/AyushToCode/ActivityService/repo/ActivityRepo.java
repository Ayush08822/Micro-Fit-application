package com.AyushToCode.ActivityService.repo;

import com.AyushToCode.ActivityService.DTO.ActivityResponseDTO;
import com.AyushToCode.ActivityService.entity.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepo extends MongoRepository<Activity , String> {
    List<Activity> findByUserId(String userId);
}
