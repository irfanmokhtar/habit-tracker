// Design tokens matching the reference UI
export const Colors = {
    // Background colors
    background: {
        primary: '#1A1D23',
        secondary: '#2D3142',
        gradient: ['#1A1D23', '#2D3142'],
    },

    // Card colors
    card: {
        primary: '#F5F0E8',     // Cream/off-white
        secondary: '#FFFFFF',
        dark: '#2A2D35',
    },

    // Text colors
    text: {
        primary: '#FFFFFF',
        secondary: 'rgba(255, 255, 255, 0.7)',
        dark: '#1A1D23',
        muted: '#6B7280',
    },

    // Accent colors
    accent: {
        green: '#4ADE80',
        greenLight: '#86EFAC',
        orange: '#F97316',
        orangeLight: '#FB923C',
        coral: '#FF6B6B',
        purple: '#A855F7',
    },

    // Calendar colors
    calendar: {
        completed: '#4ADE80',
        active: '#F97316',
        future: '#9CA3AF', // Light gray, more visible than transparent white
        inactive: '#374151',
        today: '#F97316',
    },

    // UI elements
    ui: {
        border: 'rgba(255, 255, 255, 0.1)',
        shadow: 'rgba(0, 0, 0, 0.25)',
        overlay: 'rgba(0, 0, 0, 0.5)',
    },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 28,
    full: 9999,
};

export const Typography = {
    h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
    },
    h2: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
    },
    bodyBold: {
        fontSize: 16,
        fontWeight: '600' as const,
        lineHeight: 24,
    },
    caption: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
    },
    small: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
    },
};
