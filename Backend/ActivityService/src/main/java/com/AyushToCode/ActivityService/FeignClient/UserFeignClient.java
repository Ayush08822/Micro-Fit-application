package com.AyushToCode.ActivityService.FeignClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "UserService")
public interface UserFeignClient {
    @GetMapping("/api/user/{userId}/validate")
    public ResponseEntity<Boolean> getUserId(@PathVariable String userId);
}
