module.exports = {
    purge: {
        enabled: true,
        content: [
            './public/**/*.html',
            './src/**/*.html',
            './src/**/*.vue'
        ]
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}