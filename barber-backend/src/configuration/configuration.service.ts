import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShopConfig, ShopConfigDocument } from './schemas/shop-config.schema';

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name);

  constructor(
    @InjectModel(ShopConfig.name)
    private shopConfigModel: Model<ShopConfigDocument>,
  ) {}

  async getShopConfig(): Promise<ShopConfigDocument> {
    let config = await this.shopConfigModel.findOne();
    if (!config) {
      this.logger.log('No shop config found, creating default');
      config = await this.shopConfigModel.create({});
    }
    return config;
  }

  async updateShopConfig(
    updateDto: Partial<ShopConfig>,
  ): Promise<ShopConfigDocument> {
    const config = await this.getShopConfig();
    Object.assign(config, updateDto);
    return config.save();
  }

  async isWorkingDay(date: Date): Promise<boolean> {
    const config = await this.getShopConfig();
    const day = date.getDay();
    const dateStr = date.toISOString().split('T')[0];

    // Check if it's a holiday
    const isHoliday = config.holidays.some(
      (h) => h.toISOString().split('T')[0] === dateStr,
    );
    if (isHoliday) return false;

    // Check if it's a working day
    return config.workingDays.includes(day);
  }

  async getWorkingHours(date: Date): Promise<{ start: string; end: string }> {
    const config = await this.getShopConfig();
    return { start: config.openTime, end: config.closeTime };
  }
}
