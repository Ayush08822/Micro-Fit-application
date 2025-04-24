package com.AyushToCode.gatewayserver;

import com.AyushToCode.gatewayserver.DTO.RegisterRequest;
import com.AyushToCode.gatewayserver.utlity.UserValidationService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.text.ParseException;

@Component
@RequiredArgsConstructor
@Slf4j
public class KeycloakUserSyncFilter implements WebFilter {
    private final UserValidationService userService;

    private RegisterRequest getUserDetails(String token) {
        try {
            String tokenWithoutBearer = token.replace("Bearer", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            log.info("Parsed Token is {} : " , tokenWithoutBearer);

            RegisterRequest request = new RegisterRequest();
            log.info("Details are {} : " , claims.getStringClaim("email"));
            request.setEmail(claims.getStringClaim("email"));
            request.setKeycloakId(claims.getStringClaim("sub"));
            request.setPassword("dummy@123123");
            request.setFirstName(claims.getStringClaim("given_name"));
            request.setLastName(claims.getStringClaim("family_name"));
            return request;
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String keycloakID = exchange.getRequest().getHeaders().getFirst("X-User-ID");
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        log.info("Token received is {} : " , token);
        RegisterRequest request = new RegisterRequest();
        log.info("Request Details are {} : " , request);
        if(token != null)  request = getUserDetails(token);

        if (keycloakID == null) keycloakID = request.getKeycloakId();

        log.info("User Id is {} : " , keycloakID);

        if (keycloakID != null) {
            String finalUserId = keycloakID;
            RegisterRequest finalRequest = request;
            return userService.validateUser(finalUserId)
                    .flatMap(exist -> {
                        if (!exist) {
                            //Register user
                            return userService.registerUser(finalRequest);
                        } else {
                            log.info("User already exist, Skipping sync");
                            return Mono.empty();
                        }
                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-User-ID", finalUserId).build();
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));
        }
        return chain.filter(exchange);
    }
}
