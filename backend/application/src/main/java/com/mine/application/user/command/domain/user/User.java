package com.mine.application.user.command.domain.user;


import com.mine.application.common.domain.BaseEntity;
import com.mine.application.common.erros.exception.RestApiException;
import com.mine.application.user.command.application.ModifyPasswordRequest;
import com.mine.application.user.command.application.ModifyUserInfoRequest;
import com.mine.application.user.error.UserErrorCode;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.SQLRestriction;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PUBLIC)
@Table(name = "user")
@Entity
@SuperBuilder
@DynamicUpdate
@SQLRestriction("is_deleted = false")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;

    @Convert(converter = PasswordConverter.class)
    @Column(name = "user_password", nullable = false)
    private Password password;

//    @Convert(converter = MBTIConverter.class)
//    @Column(name = "mbti")
//    private MBTI mbti;

    @Column(name = "user_nickname")
    private String nickname;

    @Convert(converter = GenderConverter.class)
    @Column(name = "user_gender")
    private Gender gender;

    @Column(name = "user_email")
    private String email;

    public User(Password password, String nickname, Gender gender, String email) {

        this.password = password;
//        this.mbti = mbti;
        this.nickname = nickname;
        this.gender = gender;
        this.email = email;
    }

    public void updateUserInfo(ModifyUserInfoRequest request) {
        if (request.getNickname() == null) {
            throw new IllegalArgumentException("Nickname is required");
        }

        if (request.getNickname().equals(nickname)) {
            throw new IllegalArgumentException("Input nickname is the same");
        }

        this.nickname = request.getNickname();
    }

    public void updateUserPassword(ModifyPasswordRequest request) {
        Password newPassword = Password.of(request.getPassword(), false);
        if (password.equals(newPassword)) {
            throw new RestApiException(UserErrorCode.PASSWORD_IS_SAME);
        }
        this.password = newPassword;
    }

    public void withdraw() {
        super.delete();
    }
}
