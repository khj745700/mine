package com.mine.application.avatar.command.application;


import com.mine.application.avatar.command.domain.Assistant;
import com.mine.application.avatar.command.domain.Avatar;
import com.mine.application.avatar.command.domain.AvatarModel;
import com.mine.application.avatar.command.domain.AvatarRepository;
import com.mine.application.avatar.command.domain.question.QuestionRes;
import com.mine.application.avatar.command.domain.voice.UploadVoiceService;
import com.mine.application.common.domain.SessionConstants;
import com.mine.application.common.domain.SessionDao;
import com.mine.application.common.erros.errorcode.CommonErrorCode;
import com.mine.application.common.erros.exception.RestApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Slf4j
public class RegisterAvatarService {
    private final AvatarRepository avatarRepository;
    private final QuestionResFactory questionResFactory;
    private final UploadVoiceService uploadVoiceService;
    private final AssistantService assistantService;
    private final SessionDao sessionDao;

    @Transactional
    public void generateAvatar(RegisterAvatarRequest request) {
        Integer userId = (Integer) sessionDao.get(SessionConstants.USER_ID).get();
        if (avatarRepository.countAvatarByUserId(userId) >= 2) {
            throw new RestApiException(CommonErrorCode.INTERNAL_SERVER_ERROR);
        }

        Avatar avatar = createAvatar(request);
        for (RegisterQuestionResRequest resRequest : request.getQuestionResList()) {
            log.error(resRequest.toString());
        }


        List<QuestionRes> questionResList = request.getQuestionResList().stream()
                .map(questionResFactory::createEntity).toList();

        avatar.setQuestionResList(questionResList);

        avatarRepository.save(avatar);

        Assistant assistant = assistantService.generateAssistant(avatar);
        avatar.enrollAssistant(assistant);


        Optional<Avatar> avatarByUserIdAndNotAvatarId = avatarRepository.findAvatarByUserIdAndNotAvatarId(userId, avatar.getId());
        avatarByUserIdAndNotAvatarId.ifPresent(avatarByUserId -> {avatarByUserId.modifyAvatarInfo(ModifyAvatarRequest.builder().isMain(false).build());});

    }

    private Avatar createAvatar(RegisterAvatarRequest request) {
        Integer userId = (Integer) sessionDao.get(SessionConstants.USER_ID).get();
        return Avatar.builder()
                .userId(userId)
                .name(request.getAvatarName())
                .job(request.getJob())
                .residence(request.getResidence())
                .voice(uploadVoiceService.generateVoice(request.getVoiceFileList()))
                .model(AvatarModel.valueOf(request.getAvatarModel().toLowerCase()))
                .isMain(true)
                .build();
    }
}
