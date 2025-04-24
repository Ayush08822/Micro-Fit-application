package com.AyushToCode.gatewayserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;

import java.time.Duration;
import java.time.LocalDateTime;

@SpringBootApplication
public class GatewayserverApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayserverApplication.class, args);
	}
	@Bean
	public HttpMessageConverters messageConverters() {
		return new HttpMessageConverters();
	}

	@Bean
	public RouteLocator RouteConfig(RouteLocatorBuilder routeLocatorBuilder) {
		return routeLocatorBuilder.routes()
				.route(p -> p
						.path("/fitness/user/**")
						.filters(f -> f.rewritePath("/fitness/user/(?<segment>.*)", "/${segment}")
								.circuitBreaker(config -> config.setName("userCircuitBreaker")))
						.uri("lb://USERSERVICE"))
				.route(p -> p
						.path("/fitness/activity/**")
						.filters(f -> f.rewritePath("/fitness/activity/(?<segment>.*)", "/${segment}")
								.circuitBreaker(config -> config.setName("activityCircuitBreaker")))
						.uri("lb://ACTIVITYSERVICE"))
				.route(p -> p
						.path("/fitness/ai/**")
						.filters(f -> f.rewritePath("/fitness/ai/(?<segment>.*)", "/${segment}")
								.circuitBreaker(config -> config.setName("aiCircuitBreaker")))
						.uri("lb://AISERVICE"))
				.build();
	}

}
