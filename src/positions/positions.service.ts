// PositionsService – handles all database operations for the "positions" table.
// Each CRUD method interacts with the database and includes user linking logic.
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

interface Position {
    position_id: number;
    position_code: string;
    position_name: string;
    id: number; // User ID
}

// Defines the structure for creating a position
export interface PositionInput {
    code: string;
    name: string;
    id: number; // Creating User ID
}

// Defines the structure for updating a position (data coming from controller)
export interface UpdatePositionInput {
    code?: string; // Optional
    name?: string; // Optional
    id: number; // Modifying User ID (always required for audit/authorization)
}

@Injectable()
export class PositionsService {
    constructor(private readonly db: DatabaseService) {}

    // 1. READ ALL
    async findAll(): Promise<Position[]> {
        const rows = await this.db.query(
            'SELECT position_id, position_code, position_name, id FROM positions'
        ) as Position[];
        return rows;
    }

    // 2. READ ONE
    async findOne(position_id: number): Promise<Position | null> {
        const rows = await this.db.query(
            'SELECT position_id, position_code, position_name, id FROM positions WHERE position_id = ?', 
            [position_id]
        ) as Position[];
        return rows.length ? rows[0] : null;
    }

    // 3. CREATE
    async create(data: PositionInput): Promise<Position | null> {
        const position_code = data.code; 
        const position_name = data.name;
        const id = data.id; // User ID

        const result: any = await this.db.query(
            'INSERT INTO positions (position_code, position_name, id) VALUES (?, ?, ?)',
            [position_code, position_name, id]
        );

        const insertedId = result.insertId;
        return this.findOne(insertedId);
    }

    // 4. UPDATE (FIXED: simplified update logic to use UpdatePositionInput)
    async update(
        position_id: number,
        data: UpdatePositionInput // Note: User ID (id) is inside this object
    ): Promise<Position | null> {
        
        const fields: string[] = [];
        const values: any[] = [];

        if (data.code !== undefined) { 
            fields.push('position_code = ?');
            values.push(data.code);
        }

        if (data.name !== undefined) {
            fields.push('position_name = ?');
            values.push(data.name);
        }

        // Add the modifying user ID for tracking (required)
        fields.push('id = ?');
        values.push(data.id); 

        if (!fields.length) return this.findOne(position_id);

        values.push(position_id);
        const query = `UPDATE positions SET ${fields.join(', ')} WHERE position_id = ?`;
        await this.db.query(query, values);

        return this.findOne(position_id);
    }

    // 5. DELETE (REFINEMENT: Return boolean for successful deletion)
    async delete(position_id: number): Promise<boolean> {
        const result: any = await this.db.query('DELETE FROM positions WHERE position_id = ?', [position_id]);
        // result.affectedRows is the standard way to check if a row was deleted
        return result.affectedRows > 0;
    }
}