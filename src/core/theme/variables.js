/**
 * @file src/core/theme/variables.js
 * @description 基于颜色主题生成 CSS 变量的通用方法
 */

/**
 * 将十六进制颜色转换为RGB对象
 * @param {string} hex - 十六进制颜色值 (如 #00A86B)
 * @returns {{r:number,g:number,b:number}|null}
 */
export function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return null;
  const cleanHex = hex.replace('#', '');
  const shorthand = /^([a-f\d])([a-f\d])([a-f\d])$/i;
  const full = cleanHex.replace(shorthand, (m, r, g, b) => r + r + g + g + b + b);
  const m = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

/**
 * 获取黑暗模式下的颜色配置
 * @param {Object} originalTheme - 原始主题
 * @returns {Object} 黑暗模式主题配置
 */
function getDarkModeColors(originalTheme) {
  // 创建一个新的主题对象，使用黑暗模式的颜色
  let adjustedTheme = {
    ...originalTheme,
    // 背景颜色 - 深色
    bgPrimary: '#1a1a1a',
    bgSecondary: '#2d2d2d',
    bgTertiary: '#3a3a3a',
    
    // 文本颜色 - 浅色
    textPrimary: '#e6e6e6',
    textSecondary: '#b3b3b3',
    textTertiary: '#888888',
    
    // 边框颜色 - 深色
    borderLight: '#404040',
    borderMedium: '#555555',
    
    // 内联代码样式
    inlineCodeBg: 'rgba(255, 255, 255, 0.1)',
    inlineCodeText: '#f8f8f2',
    inlineCodeBorder: 'rgba(255, 255, 255, 0.15)',
    
    // 引用块样式
    blockquoteBackground: 'rgba(255, 255, 255, 0.05)',
    blockquoteBorder: originalTheme.primary, // 保持主色调
    
    // 表格样式
    tableHeaderBg: '#2d2d2d',
    tableBorder: '#404040',
    
    // 其他元素
    hrColor: originalTheme.primary, // 保持主色调
  };
  
  // 如果主色调太暗，在黑暗模式下调亮它
  if (originalTheme.primary) {
    const rgb = hexToRgb(originalTheme.primary);
    if (rgb) {
      const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
      if (brightness < 128) {
        // 颜色太暗，需要调亮
        const lighterR = Math.min(255, rgb.r + 80);
        const lighterG = Math.min(255, rgb.g + 80);
        const lighterB = Math.min(255, rgb.b + 80);
        
        adjustedTheme.primary = `rgb(${lighterR}, ${lighterG}, ${lighterB})`;
        adjustedTheme.primaryHover = `rgb(${Math.min(255, lighterR + 20)}, ${Math.min(255, lighterG + 20)}, ${Math.min(255, lighterB + 20)})`;
        adjustedTheme.primaryDark = `rgb(${Math.min(255, lighterR - 20)}, ${Math.min(255, lighterG - 20)}, ${Math.min(255, lighterB - 20)})`;
      }
    }
  }
  
  return adjustedTheme;
}

/**
 * 基于颜色主题生成 CSS 变量（包含新老命名兼容）
 * @param {Object} colorTheme - 颜色主题对象
 * @param {boolean} isDarkMode - 是否为黑暗模式
 * @returns {Record<string, string>} CSS 变量映射
 */
export function computeThemeVariables(colorTheme, isDarkMode = false) {
  if (!colorTheme) return {};

  // 如果是黑暗模式，使用黑暗模式的颜色
  const theme = isDarkMode ? getDarkModeColors(colorTheme) : colorTheme;

  const variables = {
    '--theme-primary': theme.primary,
    '--theme-primary-hover': theme.primaryHover,
    '--theme-primary-light': theme.primaryLight,
    '--theme-primary-dark': theme.primaryDark,
    '--theme-text-primary': theme.textPrimary,
    '--theme-text-secondary': theme.textSecondary,
    '--theme-text-tertiary': theme.textTertiary,
    '--theme-bg-primary': theme.bgPrimary,
    '--theme-bg-secondary': theme.bgSecondary,
    '--theme-bg-tertiary': theme.bgTertiary,
    '--theme-border-light': theme.borderLight,
    '--theme-border-medium': theme.borderMedium,
    '--theme-inline-code-bg': theme.inlineCodeBg,
    '--theme-inline-code-text': theme.inlineCodeText,
    '--theme-inline-code-border': theme.inlineCodeBorder,
    '--theme-blockquote-border': theme.blockquoteBorder,
    '--theme-blockquote-bg': theme.blockquoteBackground,
    '--theme-hr-color': theme.hrColor,
    '--theme-table-header-bg': theme.tableHeaderBg,
    '--theme-table-border': theme.tableBorder,
  };

  // 列表色（如果存在）
  if (colorTheme.listColors && Array.isArray(colorTheme.listColors)) {
    colorTheme.listColors.forEach((color, index) => {
      variables[`--theme-list-color-${index + 1}`] = color;
    });
  }

  // 透明度变体与 rgb 值
  if (colorTheme.primary) {
    const rgb = hexToRgb(colorTheme.primary);
    if (rgb) {
      variables['--theme-primary-rgb'] = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
      variables['--theme-primary-15'] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
      variables['--theme-primary-20'] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.20)`;
      variables['--theme-primary-25'] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`;
      variables['--theme-primary-40'] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.40)`;
      variables['--theme-primary-60'] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.60)`;
    }
  }

  return variables;
}


