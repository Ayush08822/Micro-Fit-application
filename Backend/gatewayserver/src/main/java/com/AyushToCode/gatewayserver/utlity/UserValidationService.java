package com.AyushToCode.gatewayserver.utlity;

import com.AyushToCode.gatewayserver.DTO.RegisterRequest;
import com.AyushToCode.gatewayserver.DTO.UserResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserValidationService {
    private final WebClient webClient;

    public Mono<Boolean> validateUser(String userId) {
        log.info("Calling User Validation Service {} :", userId);
        return webClient.get()
                .uri("/api/user/{userId}/validate", userId)
                .retrieve()
                .bodyToMono(Boolean.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.NOT_FOUND)
                        return Mono.error(new RuntimeException("User not found" + userId));
                    else if (e.getStatusCode() == HttpStatus.BAD_REQUEST)
                        return Mono.error(new RuntimeException("Invalid Request" + userId));
                    return Mono.error(new RuntimeException("Unexpected Error"));
                });
    }

    public Mono<UserResponseDTO> registerUser(RegisterRequest finalRequest) {
        log.info("Calling User Registration Service {} :", finalRequest.getEmail());
        return webClient.post()
                .uri("/api/user/register")
                .bodyValue(finalRequest)
                .retrieve()
                .bodyToMono(UserResponseDTO.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.BAD_REQUEST)
                        return Mono.error(new RuntimeException("Bad Request" + e.getMessage()));
                    else if (e.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR)
                        return Mono.error(new RuntimeException("Interval Server Error" + e.getMessage()));
                    return Mono.error(new RuntimeException("Unexpected Error" + e.getMessage()));
                });
    }
}
