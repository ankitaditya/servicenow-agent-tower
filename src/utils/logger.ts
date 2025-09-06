// src/utils/logger.ts
import winston from "winston";

const { combine, timestamp, printf, colorize, json } = winston.format;

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
});

export const Logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), json()), // structured JSON logs
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
    // Optionally add file transport
    // new winston.transports.File({ filename: 'logs/app.log' })
  ],
});

// Example usage:
// Logger.info("Service started", { port: 3000 });
// Logger.error("Failed to process alert", { alertId: "evt-42", stack: err.stack });
