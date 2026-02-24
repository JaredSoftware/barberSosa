import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { BarberService } from './barber.service';
import { UpdateBarberoDto } from './dto/update-barbero.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('barberos')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  /** Listado público: solo barberos activos (para reservas) */
  @Get()
  findActivos() {
    return this.barberService.findActivos();
  }

  /** Listado completo para admin (requiere JWT). Debe ir antes que admin/:id */
  @Get('admin/list')
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.barberService.findAll();
  }

  /** Detalle de un barbero (admin) */
  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.barberService.findOne(id);
  }

  /** Actualizar datos de ficha (nombre artista, imagen, descripción, etc.) */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateBarberoDto: UpdateBarberoDto) {
    return this.barberService.update(id, updateBarberoDto);
  }
}
