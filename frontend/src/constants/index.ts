export const POLL_INTERVAL_MS = 3000;
export const AVATAR_SIZE_PX = 48;

export const PROFILE_IMAGE_MAX_WIDTH = 400;
export const PROFILE_IMAGE_MAX_HEIGHT = 400;
export const PROFILE_IMAGE_QUALITY = 0.85;

export const POTION_ORDER_STATUSES = ['To Do', 'Brewing', 'Quality Control', 'Ready for Pickup'] as const;

export const getStatusEmoji = (status: string): string => {
  switch (status) {
    case 'To Do': return '\u{1F4DD}';
    case 'Brewing': return '\u{1F9EA}';
    case 'Quality Control': return '\u{1F52C}';
    case 'Ready for Pickup': return '\u{2728}';
    default: return '\u{1F9F4}';
  }
};
