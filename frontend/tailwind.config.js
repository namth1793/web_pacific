/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C8102E',
          dark: '#A00D24',
          light: '#E8304A'
        },
        japanese: {
          red: '#BC002D',
          white: '#FFFFFF',
          gray: '#F5F5F0',
          dark: '#1a1a1a',
          muted: '#6B7280'
        }
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'Inter', 'sans-serif'],
        serif: ['Noto Serif JP', 'serif'],
        jp: ['Noto Sans JP', 'sans-serif'],
        'jp-serif': ['Noto Serif JP', 'serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease-in-out',
        'slide-up':   'slideUp 0.6s ease-out',
        'sakura':     'sakuraFall 8s linear infinite',
        'float':      'float 4s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn:     { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp:    { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        sakuraFall: { '0%': { transform: 'translateY(-5vh) rotate(0deg)', opacity: 1 }, '100%': { transform: 'translateY(105vh) rotate(540deg)', opacity: 0 } },
        float:      { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer:    { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
