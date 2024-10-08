package com.mine.application.schedule.ui;

import com.mine.application.common.aop.LoginCheck;
import com.mine.application.schedule.command.application.*;
import com.mine.application.schedule.query.application.ScheduleQueryService;
import com.mine.application.schedule.ui.dto.*;
import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(originPatterns = "*", allowedHeaders = "*", allowCredentials = "true")
@RequiredArgsConstructor
@RestController
public class ScheduleController {

    private final ScheduleQueryService scheduleQueryService;
    private final GetScheduleByChatService getScheduleByChatService;
    private final AddScheduleService addScheduleService;
    private final UpdateScheduleService updateScheduleService;
    private final DeleteScheduleService deleteScheduleService;
    private final GetScheduleCategoryService getScheduleCategoryService;

    @LoginCheck
    @GetMapping("/users/schedules")
    public ResponseEntity<List<GetScheduleResponse>> getSchedulesByCategory(
            @RequestParam @Nullable Integer categoryId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate
    ) {
        return ResponseEntity.ok().body(scheduleQueryService
                .getSchedulesByCategory(categoryId, startDate, endDate));
    }

    @LoginCheck
    @GetMapping("/users/schedules/calendar")
    public ResponseEntity<List<GetScheduleResponse>> searchSchedules(@RequestParam String query) {
        return ResponseEntity.ok(scheduleQueryService.searchSchedules(query));
    }

    @LoginCheck
    @GetMapping("/users/schedules/chat")
    public ResponseEntity<String> getSchedulesByChat(@RequestParam String query) {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getScheduleByChatService.getScheduleByChat(query));
    }

    @LoginCheck
    @PostMapping("/users/schedules/calendar")
    public ResponseEntity<Void> addScheduleByCalendar(@RequestBody @Valid AddScheduleByCalendarRequest addScheduleByCalendarRequest) {
        addScheduleService.addScheduleByCalendar(addScheduleByCalendarRequest);
        return ResponseEntity.ok().build();
    }

    @LoginCheck
    @PostMapping("/users/schedules/chat")
    public ResponseEntity<AddScheduleByChatResponse> addScheduleByChat(@RequestBody @Valid AddScheduleByChatRequest addScheduleByChatRequest) {
        return ResponseEntity.ok()
                .body(addScheduleService.addScheduleByChat(addScheduleByChatRequest.getQuery()));
    }

    @LoginCheck
    @PatchMapping("/users/schedule")
    public ResponseEntity<Void> updateSchedule(@RequestBody @Valid UpdateScheduleRequest updateScheduleRequest) {
        updateScheduleService.updateSchedule(updateScheduleRequest);
        return ResponseEntity.ok().build();
    }

    @LoginCheck
    @DeleteMapping("/users/schedules/{scheduleId}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable @NotNull int scheduleId) {
        deleteScheduleService.deleteSchedule(scheduleId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/schedule/schedule-category/{scheduleCategoryId}")
    public ResponseEntity<String> getScheduleCategory(@PathVariable @NotNull Integer scheduleCategoryId) {
        return ResponseEntity.ok()
                .body(getScheduleCategoryService.getScheduleCategory(scheduleCategoryId));
    }

}
