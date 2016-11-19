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
                src: ['./index.html']
            }
        },

        postcss: {
            init: {
                options: {
                    processors: [
                        require('postcss-import')(),
                        require('autoprefixer')(),
                        require('cssnext')(),
                        require('postcss-url')({
                            url: 'copy',
                            from: 'src/css/lib/init.css',
                            to: './init.css'
                        })
                    ]
                },
                src: 'src/css/init.css',
                dest: 'init.css'
            },
            rest: {
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
                src: ['public/style.css', 'init.css']
            }
        },

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: [
                    {'public/style.css': 'public/style.css'},
                    {'init.css': 'init.css'}
                ]
            }
        },

        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'include_css_style_tag',
                            replacement: '<%= grunt.file.read("init.css") %>'
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['index.html'], dest: ''}
                ]
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
                files: ['src/css/*.css', 'src/css/**/*.css'],
                tasks: ['postcss', 'csslint', 'replace'],
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
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-replace');

    // Default task(s).
    grunt.registerTask('default', ['dev', 'connect', 'watch']);

    // Init dev task(s).
    grunt.registerTask('dev', ['jade:dev', 'validation', 'postcss', 'csslint', 'replace']);

    // Prod task(s).
    grunt.registerTask('prod', ['jade:prod', 'validation', 'postcss', 'csslint', 'cssmin', 'replace']);

};