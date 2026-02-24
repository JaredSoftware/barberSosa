import { Body, Controller, Get, Put } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ShopConfig } from './schemas/shop-config.schema';

@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  async getConfig() {
    return this.configurationService.getShopConfig();
  }

  @Put()
  async updateConfig(@Body() updateDto: Partial<ShopConfig>) {
    return this.configurationService.updateShopConfig(updateDto);
  }
}
