// PositionsService – handles all database operations for the "positions" table.
// Each CRUD method interacts with the database and includes user linking logic.
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

interface Position {
  position_id: number;
  position_code: string;
  position_name: string;
  id: number; 
}

@Injectable()
export class PositionsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<Position[]> {
    const rows = await this.db.query(
      'SELECT position_id, position_code, position_name, id FROM positions'
    ) as Position[];
    return rows;
  }

  async findOne(position_id: number): Promise<Position | null> {
    const rows = await this.db.query(
      'SELECT position_id, position_code, position_name, id FROM positions WHERE position_id = ?', 
      [position_id]
    ) as Position[];
    return rows.length ? rows[0] : null;
  }

  async create(data: { position_code: string; position_name: string; id: number }): Promise<Position | null> {
    const { position_code, position_name, id } = data;

    const result: any = await this.db.query(
      'INSERT INTO positions (position_code, position_name, id) VALUES (?, ?, ?)', // ✅ changed
      [position_code, position_name, id]
    );

    const insertedId = result.insertId;
    return this.findOne(insertedId);
  }

  async update(
    position_id: number,
    data: { position_code?: string; position_name?: string; id?: number }
  ): Promise<Position | null> {
    const existing = await this.findOne(position_id);
    if (!existing) return null;

    const fields: string[] = [];
    const values: any[] = [];

    if (data.position_code) {
      fields.push('position_code = ?');
      values.push(data.position_code);
    }

    if (data.position_name) {
      fields.push('position_name = ?');
      values.push(data.position_name);
    }

    if (data.id) {
      fields.push('id = ?');
      values.push(data.id);
    }

    if (!fields.length) return existing;

    values.push(position_id);
    const query = `UPDATE positions SET ${fields.join(', ')} WHERE position_id = ?`;
    await this.db.query(query, values);

    return this.findOne(position_id);
  }

  async delete(position_id: number): Promise<Position | null> {
    const existing = await this.findOne(position_id);
    if (!existing) return null;

    await this.db.query('DELETE FROM positions WHERE position_id = ?', [position_id]);
    return existing;
  }
}
