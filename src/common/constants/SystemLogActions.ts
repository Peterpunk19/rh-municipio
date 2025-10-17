export const SYSTEM_LOG_ACTIONS = {
  PASSWORD_RESET: "PASSWORD_RESET",
} as const;

export type SystemLogAction = (typeof SYSTEM_LOG_ACTIONS)[keyof typeof SYSTEM_LOG_ACTIONS];
