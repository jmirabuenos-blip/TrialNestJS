// PositionsController – handles CRUD for positions with clean, user-friendly API responses.
import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Delete, 
    Body, 
    Param, 
    ParseIntPipe, 
    UseGuards, 
    Req, 
    HttpCode, 
    HttpStatus, 
    NotFoundException // ⬅️ NEW: Use NestJS exceptions for 404
} from '@nestjs/common';
import { Request } from 'express';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming path is correct

// DTOs (Data Transfer Objects)
interface CreatePositionBody {
    code: string;
    name: string;
}

interface UpdatePositionBody {
    code?: string;
    name?: string;
}
// -----------------------------------------------------------------------------------

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}

    // --- GET /positions (READ ALL) ---
    @Get()
    async getAll() {
        const positions = await this.positionsService.findAll();
        return {
            message: 'All positions retrieved successfully!',
            data: positions,
        };
    }

    // --- GET /positions/:id (READ ONE) ---
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        const position = await this.positionsService.findOne(id);
        
        if (!position) {
            throw new NotFoundException(`Position with ID ${id} not found.`);
        }

        return {
            message: 'Position retrieved successfully!',
            data: position,
        };
    }

    // --- POST /positions (CREATE) ---
    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED) // Returns 201 Created
    async create(
        @Body() position: CreatePositionBody,
        @Req() req: Request,
    ) {
        const userId = (req.user as any).id; 
        
        const servicePayload = {
            ...position,
            id: userId,
        };

        const created = await this.positionsService.create(servicePayload);
        
        return {
            message: 'Position created successfully!',
            data: created,
        };
    }

    // --- PUT /positions/:id (UPDATE) ---
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() position: UpdatePositionBody,
        @Req() req: Request,
    ) {
        const userId = (req.user as any).id;

        const servicePayload = {
            ...position,
            id: userId, // Modifying User ID
        };
        
        const updated = await this.positionsService.update(id, servicePayload);
        
        if (!updated) {
             throw new NotFoundException(`Position with ID ${id} not found and cannot be updated.`);
        }
        
        return {
            message: 'Position updated successfully!',
            data: updated,
        };
    }


    // --- DELETE /positions/:id (DELETE) ---
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // Use 204 No Content for successful deletion (API best practice)
    async remove(@Param('id', ParseIntPipe) id: number) {
        const deleted = await this.positionsService.delete(id); 
        
        if (!deleted) {
            throw new NotFoundException(`Position with ID ${id} not found and cannot be deleted.`);
        }
        
        // When using 204, the response body is typically empty.
        // If the client needs the ID, a 200 OK with a body is better.
        // STICKING TO 200/204: Let's use 200 OK to keep the consistent response body structure.
        return {
            message: `Position ID ${id} deleted successfully!`,
            data: { position_id: id }, // ⬅️ FIX: Return the ID in the data object for consistency
        };
    }
}