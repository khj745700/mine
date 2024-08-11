package com.mine.application.user.command.application;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class LoginRequest {
    private String email;
    private String password;
}
