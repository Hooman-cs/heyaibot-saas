export const PLAN_LIMITS = {
  starter: {
    maxBots: 1,
    allowedRoles: ['basic'], // Features allowed on chatbot side
    canRemoveBranding: false,
  },
  growth: {
    maxBots: 3,
    allowedRoles: ['basic', 'analytics', 'smart_actions'],
    canRemoveBranding: false,
  },
  agency: {
    maxBots: 9999, // Unlimited
    allowedRoles: ['basic', 'analytics', 'smart_actions', 'white_label'],
    canRemoveBranding: true,
  }
};