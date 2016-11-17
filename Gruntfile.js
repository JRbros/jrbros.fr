module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        connect: {
            server: {
                options: {
                    hostname: '0.0.0.0',
                    port: 9021,
                    open: true,
                    livereload: 35736,
                    base: './'
                }
            }
        },

        jade: {
            dev: {
                options: {
                    data: {
                        debug: true
                    },
                    pretty: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/jade/',
                    src: '*.jade',
                    dest: './',
                    ext: '.html'
                }]
            },
            prod: {
                options: {
                    data: {
                        debug: false
                    },
                    pretty: false
                },
                files: [{
                    expand: true,
                    cwd: 'src/jade/',
                    src: '*.jade',
                    dest: './',
                    ext: '.html'
                }]
            }
        },

        validation: {
            options: {
                reset: grunt.option('reset') || false,
                stoponerror: false,
                relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.'], //ignores these errors
                generateReport: true,
                errorHTMLRootDir: "./w3cErrorFolder",
                useTimeStamp: true
            },
            files: {
                src: ['./*.html']
            }
        },

        postcss: {
            options: {
                processors: [
                    require('postcss-import')(),
                    require('autoprefixer')(),
                    require('cssnext')(),
                    require('postcss-url')({
                        url: 'copy',
                        from: 'src/css/lib/style.css',
                        to: 'public/style.css'
                    })
                ]
            },
            files: {
                src: 'src/css/style.css',
                dest: 'public/style.css'
            }
        },

        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            strict: {
                options: {
                    import: 2
                },
                src: ['public/style.css']
            }
        },

        cssnano: {
            options: {
                sourcemap: false
            },
            dist: {
                files: {
                    'public/style.min.css': 'public/style.css'
                }
            }
        },

        uncss: {
            dist: {
                files: {
                    'public/style.css': ['./*.html']
                }
            }
        },

        watch: {
            options: {
                livereload: 35736
            },
            jade: {
                files: ['src/jade/**/*.jade'],
                tasks: ['jade', 'validation'],
                options: {
                    spawn: false
                }
            },
            css: {
                files: ['src/css/style.css', 'src/css/**/*.css'],
                tasks: ['postcss', 'csslint'],
                options: {
                    spawn: false
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-w3c-html-validation');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-cssnano');
    grunt.loadNpmTasks('grunt-uncss');

    // Default task(s).
    grunt.registerTask('default', ['dev', 'connect', 'watch']);

    // Init dev task(s).
    grunt.registerTask('dev', ['jade:dev', 'validation', 'postcss', 'csslint']);

    // Prod task(s).
    grunt.registerTask('prod', ['jade:prod', 'validation', 'postcss', 'uncss', 'csslint', 'cssnano']);

};