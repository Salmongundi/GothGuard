
export const PALETTES = {
    purple: {
        name: "Gothic Purple",
        background: "#100817",
        foreground: "#D5A5F5"
    },
    cemetery: {
        name: "Cemetery",
        background: "#080808",
        foreground: "#B8B8B8"
    },
    blood: {
        name: "Razor McBlood",
        background: "#170609",
        foreground: "#E85D75"
    },
    amber: {
        name: "Amber",
        background: "#080604",
        foreground: "#ffb000"
    },
    lame: {
        name: "Lame",
        background: "#ffffff",
        foreground: "#000000"
    }
};

export function applyPalette(name) {
    const palette = PALETTES[name] ?? PALETTES.default;
    const root = document.documentElement;

    root.style.setProperty("--background", palette.background);
    root.style.setProperty("--foreground", palette.foreground);
    root.style.setProperty("--accent", palette.foreground);

    return palette;
}
