/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
 "./src/pages/*.html",
 "./src/scripts/*.js",
 "./**/*.html" 
  ],
 theme: {
    extend: {
      colors: {
        // Tonos LIMA (LIME)
        limeNeon: '#CFFF04',    // lima neón vibrante
        limeStrong: '#BFFF00',  // lima fuerte, más puro
        limeSoft: '#D4FF33',    // lima suave y brillante

        // Tonos ESMERALDA (EMERALD)
        emeraldBright: '#50C878',  // esmeralda clásica
        emeraldNeon: '#00FF9F',    // esmeralda fluorescente
        emeraldDark: '#046307',    // esmeralda profunda
      },
    },
  },
  plugins: [],
}

