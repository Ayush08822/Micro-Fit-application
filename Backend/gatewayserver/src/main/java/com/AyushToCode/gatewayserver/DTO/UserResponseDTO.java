package com.AyushToCode.gatewayserver.DTO;

import lombok.Data;

@Data
public class UserResponseDTO {
    private String id;

    private String keycloakId;

    private String email;

    private String password;

    private String firstName;

    private String lastName;

    private String role;

    private String createdAt;

    private String updatedAt;
}
