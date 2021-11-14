/**
 * Figma Inter Letter Spacing Plugin
 * This plugin will update the letter spacing for all selected text nodes that use the 'Inter' font family.
 */

const FONT_FAMILY = 'Inter';

/**
 * Calculate the letter spacing for the given font size.
 * @param fontSize The font size.
 * @returns The letter spacing.
 * @see {@link https://rsms.me/inter/dynmetrics Inter Dynamic Metrics}
 */
function calculateLetterSpacing(fontSize): LetterSpacing {
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


async function run() {
  let count = 0;
  let message = '';

  const selection = figma.currentPage.selection

  if (!selection) {
    figma.closePlugin('No layers selected.')
    return
  }

  // Get all text nodes
  const textNodes = selection.filter((node) => node.type === 'TEXT')

  // If no text nodes are selected, close the plugin.
  if (textNodes.length === 0) {
    figma.closePlugin('No text layers selected.')
    return
  }

  for (const node of textNodes) {
    const textNode = node as TextNode

    // If the text is mixed, go over each character inside textNode
    if (textNode.fontName === figma.mixed || textNode.fontSize === figma.mixed) {
      // Get and load all fonts
      const fonts = textNode.getRangeAllFontNames(0, textNode.characters.length)
      for (const font of fonts) {
        await figma.loadFontAsync(font)
      }

      // Keep track of whether the node has been changed
      let hasChanged = false

      // Go over each character and modify the letter spacing
      for (let i = 0; i < textNode.characters.length; i ++) {
        const fontName = textNode.getRangeFontName(i, i + 1)
        const fontSize = textNode.getRangeFontSize(i, i + 1)
        const letterSpacing = textNode.getRangeLetterSpacing(i, i + 1)

        if (fontName === figma.mixed || fontSize === figma.mixed || letterSpacing === figma.mixed) {
          return
        }

        const { family: fontFamily } = fontName

        // Change letter spacing for each character where the font family matches the defined font
        if (fontFamily === FONT_FAMILY) {
          const newLetterSpacing = calculateLetterSpacing(fontSize)
          textNode.setRangeLetterSpacing(i, i + 1, newLetterSpacing)
          hasChanged = true
        }
      }

      if (hasChanged) count++
    }
    // When the text is not mixed, check the entire text
    else {
      const fontName = textNode.fontName

      if (fontName.family === FONT_FAMILY) {
        await figma.loadFontAsync(fontName)
        textNode.letterSpacing = calculateLetterSpacing(textNode.fontSize)
        count++
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

  figma.closePlugin(message)
}

run()
