import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/auth.guards';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getAllNotifications() {
    return this.notificationsService.getAllNotifications();
  }

  @Get('pending')
  getPendingNotifications() {
    return this.notificationsService.getPendingNotifications();
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch(':id/dismiss')
  markAsDismissed(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsDismissed(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteNotification(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.deleteNotification(id);
  }

  @Delete('cleanup')
  @HttpCode(HttpStatus.NO_CONTENT)
  clearOldNotifications() {
    return this.notificationsService.clearOldNotifications();
  }
}