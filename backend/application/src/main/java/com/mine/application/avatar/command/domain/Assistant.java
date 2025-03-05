package com.mine.application.avatar.command.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor
@Builder
public class Assistant {

    @Column(name = "avatar_thread_id")
    private String threadId;

    @Column(name = "avatar_assistant_id")
    private String assistantId;

}
