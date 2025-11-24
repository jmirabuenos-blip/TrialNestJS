// PositionsController – handles CRUD for positions with clean, user-friendly API responses.
import { Controller,Get,Post,Put,Delete,Body,Param,ParseIntPipe,UseGuards,Req,} from '@nestjs/common';
import { Request } from 'express';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  async getAll() {
    const positions = await this.positionsService.findAll();
    return {
      message: 'All positions retrieved successfully!',
      data: positions,
    };
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const position = await this.positionsService.findOne(id);
    return {
      message: 'Position retrieved successfully!',
      data: position,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() position: { position_code: string; position_name: string },
    @Req() req: Request,
  ) {
    const userId = (req.user as any).id; 
    const created = await this.positionsService.create({
      ...position,
      id: userId,
    });
    return {
      message: 'Position created successfully!',
      data: created,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() position: { position_code?: string; position_name?: string },
    @Req() req: Request,
  ) {
    const userId = (req.user as any).id;
    const updated = await this.positionsService.update(id, {
      ...position,
      id: userId,
    });
    if (!updated) return { message: 'Position not found', data: null };
    return {
      message: 'Position updated successfully!',
      data: updated,
    };
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req.user as any).id;
    const deleted = await this.positionsService.delete(id,); 
    if (!deleted) return { message: 'Position not found', data: null };
    return {
      message: 'Position deleted successfully!',
      data: deleted,
    };
  }
}
