/**
 * Resolves once the display face is actually usable (or after `timeout`),
 * so headline animations never start in a fallback font and re-wrap halfway.
 *
 * The font stylesheet is loaded without blocking render (see index.html), so
 * we first wait for that sheet, then for the faces the headlines need.
 */
export function whenFontsReady(timeout = 1200): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    window.setTimeout(finish, timeout);

    const loadFaces = () => {
      if (!document.fonts?.load) return finish();
      Promise.all([
        document.fonts.load('italic 1em "Cormorant Garamond"'),
        document.fonts.load('1em "Cormorant Garamond"'),
        document.fonts.load('italic 1em "Libre Caslon Text"'),
        document.fonts.load('1em "Libre Caslon Text"'),
      ]).then(finish, finish);
    };

    const sheet = document.querySelector<HTMLLinkElement>(
      'link[rel="stylesheet"][href*="fonts.googleapis.com"]',
    );
    if (!sheet || sheet.sheet) {
      loadFaces();
    } else {
      sheet.addEventListener("load", () => requestAnimationFrame(loadFaces), { once: true });
      sheet.addEventListener("error", finish, { once: true });
    }
  });
}
