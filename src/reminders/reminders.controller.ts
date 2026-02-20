import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { RemindersService } from "./reminders.service";
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { CreateReminderDto } from "./dto/create-reminder.dto";
import { UpdateReminderDto } from "./dto/update-reminder.dto";
import { Reminder } from "./reminders.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("Напоминания")
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

  @ApiOperation({ summary: "Получить все напоминания пользователя" })
  @ApiResponse({ status: 200, type: [Reminder] })
  @UseGuards(JwtAuthGuard)
  @Get("/all")
  getAllReminders(@Req() req: any) {
    return this.reminderService.findAllReminders(Number(req.user.id));
  }

  @ApiOperation({ summary: "Получить напоминание по ID" })
  @ApiResponse({ status: 200, type: Reminder })
  @ApiParam({ name: "id", type: Number, description: "ID напоминания" })
  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  getReminderById(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    return this.reminderService.findOneReminder(id, Number(req.user.id));
  }

  @ApiOperation({ summary: "Обновить напоминание" })
  @ApiResponse({ status: 200, type: Reminder })
  @ApiParam({ name: "id", type: Number, description: "ID напоминания" })
  @UseGuards(JwtAuthGuard)
  @Put("/:id")
  updateReminder(
    @Param("id", ParseIntPipe) id: number,
    @Body() reminderDto: UpdateReminderDto,
    @Req() req: any,
  ) {
    return this.reminderService.updateReminder(
      id,
      reminderDto,
      Number(req.user.id),
    );
  }

  @ApiOperation({ summary: "Удалить напоминание" })
  @ApiResponse({ status: 200 })
  @ApiParam({ name: "id", type: Number, description: "ID напоминания" })
  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  deleteReminder(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    return this.reminderService.deleteReminder(id, Number(req.user.id));
  }
}
