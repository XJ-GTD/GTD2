module.exports = {
  copyCustomFonts: {
    src: ['{{ROOT}}/node_modules/weather-icons/font/*'],
    dest: '{{WWW}}/assets/font'
  },
  copyCustomStyles: {
    src: ['{{ROOT}}/node_modules/weather-icons/css/*.min.css'],
    dest: '{{WWW}}/assets/css'
  }
}
