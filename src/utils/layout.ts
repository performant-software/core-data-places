/**
 * 
 * @param primary a color in hex format
 * @returns true if black text should be used on a background of color primary for contrast, false otherwise
 * 
 * (source for formula: https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color)
 */

export const useBlackText = (primary: string) => {
    if (primary?.length !== 7) {
        return false;
    }

    const r_ratio = parseInt(primary.slice(1,3), 16)/255.0;
    const g_ratio = parseInt(primary.slice(3,5), 16)/255.0;
    const b_ratio = parseInt(primary.slice(5,7), 16)/255.0;
    const r = r_ratio <= 0.04045 ? r_ratio/12.92 : ((r_ratio + 0.055)/1.055)**2.4;
    const g = g_ratio <= 0.04045 ? g_ratio/12.92 : ((g_ratio + 0.055)/1.055)**2.4;
    const b = b_ratio <= 0.04045 ? b_ratio/12.92 : ((b_ratio + 0.055)/1.055)**2.4;
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return l > 0.179;
};