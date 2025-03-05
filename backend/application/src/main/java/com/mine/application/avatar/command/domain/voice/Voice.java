package com.mine.application.avatar.command.domain.voice;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.mine.application.avatar.command.application.Base64FileUploadRequest;
import com.mine.application.common.event.Events;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.File;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Voice {
    @Column(name = "avatar_voice_id")
    private String voiceId;

    // TODO : 음성 파일 -> elevenlabs -> return된 voice 저장 로직.
    public void putVoice(Base64FileUploadRequest request) {
        File file = Base64AndFileConverter.base64ToFile(request);
        Events.raise(VoiceUploadedEvent.builder()
                        .file(file)
                        .voice(this)
                .build());
    }
}
