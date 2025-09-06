import { Pool } from "pg";
import { config } from "../config";

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const pool = new Pool(config.postgres);

export const incidentRepo = {
  async create(incident: Omit<Incident, "id" | "createdAt" | "updatedAt">): Promise<Incident> {
    const res = await pool.query(
      `INSERT INTO incidents (title, description, status) VALUES ($1,$2,$3) RETURNING *`,
      [incident.title, incident.description, incident.status]
    );
    return res.rows[0];
  },

  async update(id: string, data: Partial<Incident>): Promise<Incident | null> {
    const fields = Object.keys(data)
      .map((k, i) => `${k} = $${i + 1}`)
      .join(", ");
    const values = Object.values(data);
    values.push(id);
    const res = await pool.query(
      `UPDATE incidents SET ${fields}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );
    return res.rows[0] ?? null;
  },

  async findById(id: string): Promise<Incident | null> {
    const res = await pool.query(`SELECT * FROM incidents WHERE id = $1`, [id]);
    return res.rows[0] ?? null;
  },

  async list(): Promise<Incident[]> {
    const res = await pool.query(`SELECT * FROM incidents ORDER BY created_at DESC`);
    return res.rows;
  },
};