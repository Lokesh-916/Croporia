import React from 'react';

const Icon = ({ d, size = 20, color = 'currentColor', strokeWidth = 1.6, fill = 'none', ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

// Navigation icons
export const IconHome      = p => <Icon size={p.size||20} color={p.color} d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" {...p} />;
export const IconFarm      = p => <Icon size={p.size||20} color={p.color} d={["M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z","M12 6v6l4 2"]} {...p} />;
export const IconFinance   = p => <Icon size={p.size||20} color={p.color} d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" {...p} />;

// Feature icons
export const IconField     = p => <Icon size={p.size||20} color={p.color} d={["M3 6l9-4 9 4v12l-9 4-9-4V6z","M12 2v20","M3 6l9 4 9-4"]} {...p} />;
export const IconSeed      = p => <Icon size={p.size||20} color={p.color} d="M12 22V12M12 12C12 7 7 3 3 3c0 4 3 8 9 9zM12 12c0-5 5-9 9-9-0 4-3 8-9 9" {...p} />;
export const IconHarvest   = p => <Icon size={p.size||20} color={p.color} d={["M3 17l3-9 3 4 3-7 3 5 3-3","M3 21h18"]} {...p} />;
export const IconDiary     = p => <Icon size={p.size||20} color={p.color} d={["M4 19.5A2.5 2.5 0 016.5 17H20","M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z","M8 7h8","M8 11h6"]} {...p} />;
export const IconTask      = p => <Icon size={p.size||20} color={p.color} d={["M9 11l3 3L22 4","M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"]} {...p} />;
export const IconExpense   = p => <Icon size={p.size||20} color={p.color} d={["M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z","M16 3H8a1 1 0 00-1 1v3h10V4a1 1 0 00-1-1z","M12 14a1 1 0 100-2 1 1 0 000 2z"]} {...p} />;
export const IconLoan      = p => <Icon size={p.size||20} color={p.color} d={["M3 3h18v4H3z","M3 10h18","M3 17h18","M7 7v14","M17 7v14"]} {...p} />;
export const IconReport    = p => <Icon size={p.size||20} color={p.color} d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M8 13h2v4H8z","M12 11h2v6h-2z","M16 9h2v8h-2z"]} {...p} />;
export const IconBell      = p => <Icon size={p.size||20} color={p.color} d={["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"]} {...p} />;
export const IconWeather   = p => <Icon size={p.size||20} color={p.color} d={["M12 2v2","M12 20v2","M4.93 4.93l1.41 1.41","M17.66 17.66l1.41 1.41","M2 12h2","M20 12h2","M6.34 17.66l-1.41 1.41","M19.07 4.93l-1.41 1.41","M12 6a6 6 0 100 12A6 6 0 0012 6z"]} {...p} />;
export const IconPlus      = p => <Icon size={p.size||20} color={p.color} d={["M12 5v14","M5 12h14"]} {...p} />;
export const IconX         = p => <Icon size={p.size||20} color={p.color} d={["M18 6L6 18","M6 6l12 12"]} {...p} />;
export const IconCheck     = p => <Icon size={p.size||20} color={p.color} d="M20 6L9 17l-5-5" {...p} />;
export const IconChevron   = p => <Icon size={p.size||20} color={p.color} d="M9 18l6-6-6-6" {...p} />;
export const IconLeaf      = p => <Icon size={p.size||20} color={p.color} d="M17 8C8 10 5.9 16.17 3.82 19.84 5.16 20.6 6 21 8 21c4 0 8-3 10-8.5S17 3 17 3 17 5 17 8z" {...p} />;
export const IconTractor   = p => <Icon size={p.size||20} color={p.color} d={["M3 17a2 2 0 104 0 2 2 0 00-4 0M14 17a3 3 0 106 0 3 3 0 00-6 0","M5 17V9l4-5h8l2 5v8","M9 4v5"]} {...p} />;
export const IconDroplet   = p => <Icon size={p.size||20} color={p.color} d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" {...p} />;
export const IconSpray     = p => <Icon size={p.size||20} color={p.color} d={["M3 3h4l2 9","M5 6h14","M12 3v3","M17 3v3","M19 12c0 3.31-2.69 6-6 6s-6-2.69-6-6"]} {...p} />;
export const IconTruck     = p => <Icon size={p.size||20} color={p.color} d={["M1 3h15v13H1z","M16 8h4l3 3v5h-7V8z","M5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"]} {...p} />;
export const IconWorker    = p => <Icon size={p.size||20} color={p.color} d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 3a4 4 0 100 8 4 4 0 000-8z","M8 7H4","M20 7h-4"]} {...p} />;
export const IconBox       = p => <Icon size={p.size||20} color={p.color} d={["M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z","M3.27 6.96L12 12.01l8.73-5.05","M12 22.08V12"]} {...p} />;
export const IconAlert     = p => <Icon size={p.size||20} color={p.color} d={["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"]} {...p} />;
export const IconInfo      = p => <Icon size={p.size||20} color={p.color} d={["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 8h.01","M12 12v4"]} {...p} />;
export const IconCalendar  = p => <Icon size={p.size||20} color={p.color} d={["M8 2v4","M16 2v4","M3 10h18","M3 6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6z"]} {...p} />;
export const IconEdit      = p => <Icon size={p.size||20} color={p.color} d={["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7","M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"]} {...p} />;
export const IconArrow     = p => <Icon size={p.size||20} color={p.color} d="M5 12h14M12 5l7 7-7 7" {...p} />;
export const IconCrop      = p => <Icon size={p.size||20} color={p.color} d={["M7 2v11","M17 2v11","M3 13h18","M7 17a4 4 0 008 0"]} {...p} />;

// Category icon map
export const CAT_ICON_MAP = {
  Seeds:      IconSeed,
  Fertilizer: IconDroplet,
  Pesticides: IconSpray,
  Labor:      IconWorker,
  Irrigation: IconDroplet,
  Equipment:  IconTractor,
  Transport:  IconTruck,
  Other:      IconBox,
};
