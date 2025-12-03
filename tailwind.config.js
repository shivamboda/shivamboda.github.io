/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'black-bean': 'var(--bg-primary)', // Mapped to primary bg
                'coffee-charcoal': 'var(--bg-secondary)',
                'deep-roast': 'var(--accent-secondary)',
                'mocha-brown': 'var(--accent-primary)',
                'soft-cream': 'var(--text-primary)', // Mapped to primary text
                'warm-linen': 'var(--text-secondary)',
                // Semantic names
                'bg-primary': 'var(--bg-primary)',
                'bg-secondary': 'var(--bg-secondary)',
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'accent-primary': 'var(--accent-primary)',
                'accent-secondary': 'var(--accent-secondary)',
                'border-color': 'var(--border-color)',
                'card-bg': 'var(--card-bg)',
            },
            fontFamily: {
                'heading': ['"Playfair Display"', 'serif'],
                'body': ['Lato', 'sans-serif'],
                'name': ['Righteous', 'cursive'],
            },
        },
    },
    plugins: [],
}
