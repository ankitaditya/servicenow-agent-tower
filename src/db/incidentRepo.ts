import { Pool } from "pg";
import { config } from "../config";

export interface Incident {
  id: string;
  title: string;
  description: string;
  rootCause?: string;
  status: "open" | "in_progress" | "resolved" | "investigated" | "synced";
  severity?: "LOW" | "HIGH" | "SEVERE";
  serviceNowTicket?: string;
  created_at: Date;
  updated_at: Date;
}

const pool = new Pool(config.postgres);

export const incidentRepo = {
  async create(incident: Omit<Incident, "id" | "created_at" | "updated_at">): Promise<Incident> {
    const res = await pool.query(
      `INSERT INTO incidents (title, description, status)
       VALUES ($1,$2,$3)
       RETURNING *`,
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
      `UPDATE incidents
       SET ${fields}, updated_at = NOW()
       WHERE id = $${values.length}
       RETURNING *`,
      values
    );
    return res.rows[0] ?? null;
  },

  async findById(id: string): Promise<Incident | null> {
    const res = await pool.query(`SELECT * FROM incidents WHERE id = $1`, [id]);
    return res.rows[0] ?? null;
  },

  async findByStatus(status: Incident["status"]): Promise<Incident[]> {
    const res = await pool.query(
      `SELECT * FROM incidents WHERE status = $1 ORDER BY created_at DESC`,
      [status]
    );
    return res.rows;
  },

  async list(): Promise<Incident[]> {
    const res = await pool.query(`SELECT * FROM incidents ORDER BY created_at DESC`);
    return res.rows;
  },

  async delete(id: string): Promise<boolean> {
    const res = await pool.query(`DELETE FROM incidents WHERE id = $1`, [id]);
    return res.rowCount ? res.rowCount > 0: false;
  },
};
