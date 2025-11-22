/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'black-bean': '#0D0C0A',
                'coffee-charcoal': '#1C1A17',
                'deep-roast': '#3B2F2F',
                'mocha-brown': '#5C4438',
                'soft-cream': '#EDE6D6',
                'warm-linen': '#D6CBB8',
            },
        },
    },
    plugins: [],
}
