/**
 * Cleans image URLs by removing query parameters.
 * Useful for Unsplash URLs to prevent double-encoding by next/image.
 */
export function cleanImageUrl(url: string | undefined | null): string {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('unsplash.com')) {
            return `${urlObj.origin}${urlObj.pathname}`;
        }
        return url;
    } catch (e) {
        return url;
    }
}
