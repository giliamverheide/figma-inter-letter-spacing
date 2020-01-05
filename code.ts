function setLetterSpacing(fontSize): LetterSpacing {

  const a = -0.0223, b = 0.185, c = -0.1745;

  return {
    'value': parseFloat((fontSize * (a + b * Math.pow(Math.E, c * fontSize))).toFixed(2)),
    'unit': 'PIXELS'
  }

}


for (const node of figma.currentPage.selection) {
  if (node.type === 'TEXT') {
    
    const font = node.fontName as FontName;

    if (font.family === 'Inter') {
      figma.loadFontAsync(font)
      .then(() => {
        node.letterSpacing = setLetterSpacing(node.fontSize)
      })
    }

  }
}


figma.closePlugin();