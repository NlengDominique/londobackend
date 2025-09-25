/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlantCalculationService {
  calculateNextWateringDate(lastDate: Date, frequency: number): Date {
    if (!lastDate) {
      return new Date();
    }
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + frequency);
    return nextDate;
  }
  
  needsWatering(nextWateringDate: Date | null): boolean {
    if (!nextWateringDate) {
      return true;
    }
    return new Date() >= nextWateringDate;
  }
}
