package com.mine.application.avatar.command.domain.voice;

import com.mine.application.avatar.command.application.Base64FileUploadRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.audio.transcription.AudioTranscriptionPrompt;
import org.springframework.ai.openai.OpenAiAudioTranscriptionModel;
import org.springframework.ai.openai.OpenAiAudioTranscriptionOptions;
import org.springframework.ai.openai.api.OpenAiAudioApi;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.File;

@RequiredArgsConstructor
@Component
public class SpeechToText {

    private final ResourceLoader resourceLoader;
    private final OpenAiAudioTranscriptionModel openAiAudioTranscriptionModel;

    public String getTextFromSpeech(Base64FileUploadRequest request) {
        File audiofile = Base64AndFileConverter.base64ToFile(request);
        Resource audioFile = resourceLoader.getResource("file:" + audiofile.getAbsolutePath());
        AudioTranscriptionPrompt transcriptionRequest =
                new AudioTranscriptionPrompt(audioFile, getTranscriptionOptions());

        return openAiAudioTranscriptionModel.call(transcriptionRequest)
                .getResults()
                .getFirst()
                .getOutput();
    }

    private OpenAiAudioTranscriptionOptions getTranscriptionOptions() {
        OpenAiAudioApi.TranscriptResponseFormat responseFormat = OpenAiAudioApi.TranscriptResponseFormat.JSON;
        return OpenAiAudioTranscriptionOptions.builder()
                .language("ko")
                .prompt("Ask not this, but ask that")
                .temperature(0f)
                .responseFormat(responseFormat)
                .build();
    }

}
