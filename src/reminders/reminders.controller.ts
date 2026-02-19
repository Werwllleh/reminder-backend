import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { RemindersService } from "./reminders.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateReminderDto } from "./dto/create-reminder.dto";
import { Reminder } from "./reminders.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("reminder")
export class RemindersController {
  constructor(private readonly reminderService: RemindersService) {}

  @ApiOperation({ summary: "Создание напоминания" })
  @ApiResponse({ status: 200, type: Reminder })
  @UseGuards(JwtAuthGuard)
  @Post("/add")
  addReminder(@Body() reminderDto: CreateReminderDto, @Req() req: any) {
    return this.reminderService.createReminder(reminderDto, Number(req.user.id));
  }
}
