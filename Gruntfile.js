module.exports = function(grunt){

  grunt.loadNpmTasks('grunt-includes');

  grunt.initConfig({
    includes: {
      files:{
        src: 'extended-mashup-api.js',
        dest: 'build',
        cwd: '.'
      }
    }
  });
};
