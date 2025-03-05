package com.mine.application.avatar.command.domain.question;

import com.mine.application.avatar.command.application.ModifyQuestionResDto;
import com.mine.application.avatar.command.application.ModifyQuestionResRequest;
import com.mine.application.avatar.command.domain.Avatar;
import com.mine.application.avatar.query.application.QuestionResDto;
import jakarta.persistence.*;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table
@Entity
public class QuestionRes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_res_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avatar_id")
    private Avatar avatar;

    @OneToOne
    @JoinColumn(name = "question_choice_id")
    private QuestionChoice questionChoice;

    @Column(name = "subjective_ans")
    private String subjectiveAns;

    @Convert(converter = QuestionTypeConverter.class)
    @Column(name = "question_type")
    private QuestionType questionType;


    @Transient
    private boolean isModify;

    public ModifyQuestionResDto updateRes(ModifyQuestionResRequest resRequest, QuestionChoice questionChoice) {
        ModifyQuestionResDto dto = new ModifyQuestionResDto();
        if(questionType.equals(QuestionType.CHOICE)) {
            if(!this.questionChoice.equals(questionChoice)) {
                isModify = true;
                this.questionChoice = questionChoice;
                dto.setQuestion(question.getDescription());
                dto.setAnswer(questionChoice.getDescription());
            }
        }else {
            if(!subjectiveAns.equals(resRequest.getSubjectiveAns())){
                isModify = true;
                this.subjectiveAns = resRequest.getSubjectiveAns();
                dto.setQuestion(question.getDescription());
                dto.setAnswer(resRequest.getSubjectiveAns());
            }
        }

        return dto;
    }


}
