const FONT_FAMILY = 'Inter';

function setLetterSpacing(fontSize): LetterSpacing {
  const a = -0.0223,
    b = 0.185,
    c = -0.1745;

  return {
    value: parseFloat(
      (fontSize * (a + b * Math.pow(Math.E, c * fontSize))).toFixed(2)
    ),
    unit: 'PIXELS'
  };
}

function run() {
  let count = 0;
  let message = '';

  for (const node of figma.currentPage.selection) {
    if (node.type === 'TEXT') {
      const font = node.fontName as FontName;

      if (font.family === FONT_FAMILY) {
        count++;
        figma.loadFontAsync(font).then(() => {
          node.letterSpacing = setLetterSpacing(node.fontSize);
        });
      }
    }
  }

  if (count === 1) {
    message = `✅ Updated ${count} layer.`;
  } else if (count > 1) {
    message = `✅ Updated ${count} layers.`;
  } else {
    message = `Please select layers that use the 'Inter' font family.`;
  }

  figma.closePlugin(message);
}

run();
