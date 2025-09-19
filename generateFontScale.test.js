import generateFontScale from './generateFontScale.js'; // Adjust path as needed

describe('generateFontScale', () => {
  // Musical interval ratios
  const musicalRatios = {
    minorThird: 1.2, // 6:5
    majorThird: 1.25, // 5:4
    perfectFourth: 1.333, // 4:3
    tritone: 1.414, // √2
    perfectFifth: 1.5, // 3:2
    minorSixth: 1.6, // 8:5
    goldenRatio: 1.618, // φ (phi)
    majorSixth: 1.667, // 5:3
    minorSeventh: 1.778, // 16:9
    majorSeventh: 1.875, // 15:8
    octave: 2.0 // 2:1
  };

  const baseFontSizes = [16, 18];
  const rootFontSize = 16;

  // Test structure and basic functionality
  describe('Basic functionality', () => {
    test('returns object with fontSizes property', () => {
      const result = generateFontScale();
      expect(result).toHaveProperty('fontSizes');
      expect(typeof result.fontSizes).toBe('object');
    });

    test('generates all expected size labels', () => {
      const result = generateFontScale();
      const expectedLabels = ['xs', 'sm', 'base', 'lg', 'xl'];
      expectedLabels.forEach(label => {
        expect(result.fontSizes).toHaveProperty(label);
      });
    });

    test('each font size is array with rem value and line-height object', () => {
      const result = generateFontScale();
      Object.values(result.fontSizes).forEach(fontSize => {
        expect(Array.isArray(fontSize)).toBe(true);
        expect(fontSize).toHaveLength(2);
        expect(typeof fontSize[0]).toBe('string');
        expect(fontSize[0]).toMatch(/^\d+(\.\d+)?rem$/);
        expect(fontSize[1]).toHaveProperty('lineHeight');
        expect(typeof fontSize[1].lineHeight).toBe('number');
      });
    });
  });

  // Test all musical intervals with both base font sizes
  describe('Musical interval scales', () => {
    baseFontSizes.forEach(baseSize => {
      describe(`Base font size: ${baseSize}px`, () => {
        Object.entries(musicalRatios).forEach(([intervalName, ratio]) => {
          test(`${intervalName} (ratio: ${ratio}) with base ${baseSize}px`, () => {
            const result = generateFontScale(baseSize, ratio, rootFontSize);
            
            // Test calculated sizes match expected mathematical progression
            const steps = { xs: -2, sm: -1, base: 0, lg: 1, xl: 2 };
            
            Object.entries(steps).forEach(([label, step]) => {
              const expectedSizePx = baseSize * Math.pow(ratio, step);
              const expectedRem = baseSize === 16 
                ? expectedSizePx / rootFontSize 
                : expectedSizePx / baseSize;
              
              const actualRemValue = parseFloat(result.fontSizes[label][0]);
              const expectedRemValue = parseFloat(expectedRem.toFixed(3));
              
              expect(actualRemValue).toBeCloseTo(expectedRemValue, 3);
              
              // Test line-height rules
              const expectedLineHeight = expectedSizePx <= 12 ? 1.6 :
                                      expectedSizePx <= 16 ? 1.5 :
                                      expectedSizePx <= 20 ? 1.4 : 1.2;
              
              expect(result.fontSizes[label][1].lineHeight).toBe(expectedLineHeight);
            });
          });
          
          // Test specific interval characteristics
          test(`${intervalName} progression maintains correct ratios`, () => {
            const result = generateFontScale(baseSize, ratio, rootFontSize);
            
            // Convert rem values back to px for ratio testing
            const pxValues = {};
            Object.entries(result.fontSizes).forEach(([label, [remValue]]) => {
              const rem = parseFloat(remValue);
              pxValues[label] = baseSize === 16 ? rem * rootFontSize : rem * baseSize;
            });
            
            // Test that ratios between consecutive steps are maintained
            const ratioSm = pxValues.sm / pxValues.xs;
            const ratioBase = pxValues.base / pxValues.sm;
            const ratioLg = pxValues.lg / pxValues.base;
            const ratioXl = pxValues.xl / pxValues.lg;
            
            [ratioSm, ratioBase, ratioLg, ratioXl].forEach(actualRatio => {
              expect(actualRatio).toBeCloseTo(ratio, 2);
            });
          });
        });
      });
    });
  });

  // Test edge cases and line-height rules
  describe('Line-height rules', () => {
    test('applies correct line-height based on pixel size', () => {
      // Test with a ratio that will produce sizes in all line-height ranges
      const result = generateFontScale(16, 1.5, 16);
      
      Object.entries(result.fontSizes).forEach(([label, [remValue, { lineHeight }]]) => {
        const pixelSize = parseFloat(remValue) * 16;
        
        if (pixelSize <= 12) {
          expect(lineHeight).toBe(1.6);
        } else if (pixelSize <= 16) {
          expect(lineHeight).toBe(1.5);
        } else if (pixelSize <= 20) {
          expect(lineHeight).toBe(1.4);
        } else {
          expect(lineHeight).toBe(1.2);
        }
      });
    });
  });

  // Test rem calculation logic
  describe('Rem calculation', () => {
    test('uses root-relative rem when baseSize is 16px', () => {
      const result = generateFontScale(16, 1.2, 16);
      // Base should be 1rem when baseSize equals rootFontSize
      expect(result.fontSizes.base[0]).toBe('1rem');
    });

    test('uses base-relative rem when baseSize is not 16px', () => {
      const result = generateFontScale(18, 1.2, 16);
      // Base should be 1rem relative to the baseSize
      expect(result.fontSizes.base[0]).toBe('1rem');
    });

    test('maintains precision with 3 decimal places', () => {
      const result = generateFontScale(16, 1.618, 16); // Golden ratio
      
      Object.values(result.fontSizes).forEach(([remValue]) => {
        const decimalPart = remValue.split('.')[1];
        if (decimalPart) {
          expect(decimalPart.replace('rem', '').length).toBeLessThanOrEqual(3);
        }
      });
    });
  });

  // Snapshot tests for specific musical intervals
  describe('Snapshot tests', () => {
    test('minor third scale (1.2) with 16px base', () => {
      const result = generateFontScale(16, 1.2, 16);
      expect(result).toMatchSnapshot();
    });

    test('golden ratio scale (1.618) with 18px base', () => {
      const result = generateFontScale(18, 1.618, 16);
      expect(result).toMatchSnapshot();
    });

    test('perfect fifth scale (1.5) with 16px base', () => {
      const result = generateFontScale(16, 1.5, 16);
      expect(result).toMatchSnapshot();
    });
  });

  // Performance and boundary tests
  describe('Boundary conditions', () => {
    test('handles very small ratios', () => {
      const result = generateFontScale(16, 1.01, 16);
      expect(result.fontSizes).toBeDefined();
      expect(Object.keys(result.fontSizes)).toHaveLength(5);
    });

    test('handles large ratios', () => {
      const result = generateFontScale(16, 3.0, 16);
      expect(result.fontSizes).toBeDefined();
      expect(Object.keys(result.fontSizes)).toHaveLength(5);
    });
  });
});