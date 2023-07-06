import winston from "winston";

const customLevelsOption = {
  levels: {
    debug: 1,
    http: 2,
    info: 3,
    warning: 4,
    error: 5,
    fatal: 6,
  }
};

export const logger = winston.createLogger({
  levels: customLevelsOption.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "errors.log", level: "error" }),
  ],
});
