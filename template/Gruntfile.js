module.exports = function (grunt) {
  require('grunt-task-loader')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      dist: {
        files: {
          'scripts/main.min.js': 'scripts/main.min.js'
        },
        output: {
          comments: false
        }
      }
    },
    browserify: {
      dev: {
        files: {
          'scripts/main.min.js': ['source/**/*.js']
        },
        options: {
          transform: [
            ['babelify', {
              presets: "env"
            }]
          ],
          browserifyOptions: {
            debug: true
          }
        }
      },
      dist: {
        files: {
          'scripts/main.min.js': ['source/**/*.js']
        },
        options: {
          transform: [
            ['babelify', {
              presets: "env"
            }]
          ],
          browserifyOptions: {
            debug: false
          }
        }
      }
    },
    sass: {
      dist: {
        options: {
          outputStyle: 'compressed',
          lineNumbers: false,
          sourceMap: false
        },
        files: [{
          expand: true,
          cwd: 'source',
          src: ['*.sass'],
          dest: 'css',
          ext: '.css'
        }]
      },
      dev: {
        options: {
          outputStyle: 'expanded',
          lineNumbers: true,
          sourceMap: true
        },
        files: [{
          expand: true,
          cwd: 'source',
          src: ['*.sass'],
          dest: 'css',
          ext: '.css'
        }]
      },
    },
    postcss: {
      dev: {
        options: {
          map: true,
          processors: [
            require('autoprefixer')({
              browsers: ['last 2 version']
            })
          ]
        },
        dist: {
          src: 'css/main.min.css',
          dest: 'css/main.min.css'
        }
      },
      dist: {
        options: {
          map: false,
          processors: [
            require('autoprefixer')({
              browsers: ['last 2 version']
            })
          ]
        },
        dist: {
          src: 'css/main.min.css',
          dest: 'css/main.min.css'
        }
      }
    },

    pug: {
      compile: {
        options: {
          pretty: true,
          data: {
            debug: false
          }
        },
        files: [{
          expand: true,
          cwd: 'source',
          src: ['*.pug', '!_*.pug'],
          dest: '',
          ext: '.html'
        }]
      }
    },

    connect: {
      all: {
        options: {
          port: 9000,
          hostname: "0.0.0.0",
          keepalive: true,
          livereload: true
        }
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'source/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'source/'
        }]
      }
    },

    watch: {
      scripts: {
        files: ['source/**/*.js'],
        tasks: ['browserify:dev']
      },
      sass: {
        files: ['source/*.sass', 'source/**/*.sass'],
        tasks: ['sass:dev', 'postcss:dev'],
        options: {
          spawn: false
        }
      },
      pug: {
        files: ['source/*.pug', 'source/**/*.pug'],
        tasks: ['pug:compile'],
        options: {
          spawn: false,
          pretty: true
        }
      },
      reload: {
        files: ['source/**/src/*', '*.html', 'scripts/*', 'css/*'],
        options: {
          livereload: true
        }
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      dev: {
        tasks: ['watch:scripts', 'watch:sass', 'watch:pug', 'watch:reload', 'connect']
      },
      prod: {
        tasks: ['watch:scripts', 'watch:sass']
      },
      build: {
        tasks: ['browserify:dist', 'uglify:dist', 'sass:dist', 'postcss:dist', 'concurrent:optimal']
      },
      optimal: {
        tasks: ['imagemin']
      }
    }
  });

  grunt.registerTask('dev', ['concurrent:dev']);
  grunt.registerTask('prod', ['concurrent:prod']);
  grunt.registerTask('build', ['concurrent:build']);
  grunt.registerTask('optimal', ['concurrent:optimal']);
};