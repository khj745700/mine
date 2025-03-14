package com.mine.application.user.command.application;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;


@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserVerificationEmailDto implements Serializable {
    private static final long serialVersionUID = -2003632380209941855L;
    private String email;
    private String verificationNumber;
    private boolean isValid;

    public boolean verify(String verificationNumber, String email) {
        isValid = Objects.equals(verificationNumber, this.verificationNumber) && Objects.equals(email, this.email);
        return isValid;
    }

    public boolean canUse() {
        return isValid;
    }

    public String getEmail() {
        return email;
    }
}
