package com.AyushToCode.AIService.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                title = "My AI Microservice API",
                version = "1.0",
                description = "API documentation for my AI microservice"
        )
)
@Configuration
public class OpenAPIUserConfig {
}
