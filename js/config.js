/* ══════════════════════════════════════════
   App-wide constants
══════════════════════════════════════════ */

export const DAYS     = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
export const DAY_ABBR = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

/* Timetable grid — adjust if your school day changes */
export const GRID_START = 7 * 60 + 55;             // 07:55 in minutes
export const GRID_END   = 23 * 60 + 55;            // 23:55 in minutes
export const GRID_RANGE = GRID_END - GRID_START;   // total minutes spanned
export const PPM        = 1.7;                     // pixels per minute
export const GRID_H     = GRID_RANGE * PPM;        // total grid height in px
