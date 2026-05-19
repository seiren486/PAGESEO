/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface": "#f3fcef",
        "primary-container": "#03c75a",
        "primary": "#006e2e",
        "surface-bright": "#f3fcef",
        "inverse-primary": "#3ee271",
        "tertiary-fixed": "#ffdad5",
        "on-background": "#151e16",
        "surface-dim": "#d3ddd0",
        "inverse-on-surface": "#eaf3e6",
        "on-tertiary-container": "#76241b",
        "primary-fixed": "#67ff8d",
        "on-primary-fixed": "#002109",
        "secondary": "#545f73",
        "surface-container": "#e7f1e3",
        "surface-variant": "#dce5d8",
        "surface-container-highest": "#dce5d8",
        "on-secondary-fixed": "#111c2d",
        "secondary-fixed": "#d8e3fb",
        "background": "#f3fcef",
        "tertiary-fixed-dim": "#ffb4a9",
        "on-tertiary": "#ffffff",
        "surface-container-low": "#edf6e9",
        "primary-fixed-dim": "#3ee271",
        "on-surface": "#151e16",
        "secondary-container": "#d5e0f8",
        "outline-variant": "#bbcbb9",
        "inverse-surface": "#2a332a",
        "surface-tint": "#006e2e",
        "on-error": "#ffffff",
        "on-secondary-container": "#586377",
        "on-primary-container": "#004c1e",
        "on-primary": "#ffffff",
        "tertiary-container": "#ff8c7c",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#e2ebde",
        "on-secondary-fixed-variant": "#3c475a",
        "on-primary-fixed-variant": "#005321",
        "on-error-container": "#93000a",
        "on-tertiary-fixed-variant": "#7e2a20",
        "on-secondary": "#ffffff",
        "outline": "#6c7b6b",
        "error-container": "#ffdad6",
        "tertiary": "#9e4135",
        "on-surface-variant": "#3c4a3c",
        "secondary-fixed-dim": "#bcc7de",
        "error": "#ba1a1a",
        "on-tertiary-fixed": "#410000"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "card-padding": "24px",
        "gutter": "24px",
        "container-margin": "32px",
        "base": "8px",
        "input-padding": "12px"
      },
      fontFamily: {
        "headline-lg": ["Noto Sans KR", "sans-serif"],
        "label-bold": ["Noto Sans KR", "sans-serif"],
        "body-lg": ["Noto Sans KR", "sans-serif"],
        "body-md": ["Noto Sans KR", "sans-serif"],
        "label-md": ["Noto Sans KR", "sans-serif"],
        "body-sm": ["Noto Sans KR", "sans-serif"],
        "headline-sm": ["Noto Sans KR", "sans-serif"],
        "headline-md": ["Noto Sans KR", "sans-serif"]
      },
      fontSize: {
        "headline-lg": ["30px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "label-bold": ["12px", {"lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "700"}],
        "body-lg": ["16px", {"lineHeight": "24px", "letterSpacing": "0em", "fontWeight": "400"}],
        "body-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0em", "fontWeight": "400"}],
        "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.01em", "fontWeight": "500"}],
        "body-sm": ["13px", {"lineHeight": "18px", "letterSpacing": "0em", "fontWeight": "400"}],
        "headline-sm": ["18px", {"lineHeight": "26px", "letterSpacing": "0em", "fontWeight": "600"}],
        "headline-md": ["22px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries')
  ],
}
