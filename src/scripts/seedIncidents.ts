// scripts/seedIncidents.ts
import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool(config.postgres);

async function seed() {
  await pool.query(`
    INSERT INTO incidents (title, description, status)
    VALUES
      ('CPU Spike in HRMS', 'CPU usage exceeded 90% on HRMS server hrms-01', 'open'),
      ('Solar Panel Disconnect', 'Lost connection to solar panel array node-7', 'in_progress'),
      ('Database Latency', 'Postgres DB response time > 2s on prod-db-3', 'resolved'),
      ('API Gateway Timeout', 'API Gateway failed requests > 5% threshold', 'open'),
      ('Memory Leak Detected', 'High memory growth trend in SaaS worker node-12', 'in_progress'),
      ('Disk Space Critical', 'Less than 5% disk space remaining on /var in server hrms-04', 'open'),
      ('SSL Certificate Expiring', 'SSL certificate for api.kalkinso.com expires in 2 days', 'open'),
      ('Network Partition', 'Packet loss detected between region-us-east and region-eu-west', 'in_progress'),
      ('Authentication Failure Spike', 'Login failures exceeded 500 attempts in 10 minutes', 'open'),
      ('Slow Solar Data Feed', 'Telemetry from solar field node-22 delayed > 10 seconds', 'resolved'),
      ('Worker Crash Loop', 'SaaS container worker-node-33 restarting repeatedly', 'in_progress'),
      ('Power Supply Fault', 'Inverter reported fault code 0xF3 in solar system node-14', 'open'),
      ('Data Pipeline Error', 'ETL job failed during nightly batch load at step-5', 'resolved'),
      ('Unresponsive API', 'Payments microservice not responding to health check', 'open'),
      ('ServiceNow Sync Issue', 'Ticket sync from ServiceNow to internal DB failed', 'in_progress'),
      ('Cache Eviction Storm', 'Redis cache eviction > 10k keys/min in analytics cluster', 'resolved'),
      ('High Latency Alert', 'Average response time > 1s across SaaS frontend nodes', 'open'),
      ('Unauthorized Access Attempt', 'Multiple SSH brute force attempts detected', 'in_progress'),
      ('Temperature Threshold Breach', 'Solar node-19 exceeded safe operating temp of 75°C', 'open')
  `);

  console.log("✅ Seeded 19 dummy incidents.");
  await pool.end();
}

seed().catch((err) => {
  console.error("❌ Error seeding incidents", err);
  process.exit(1);
});
