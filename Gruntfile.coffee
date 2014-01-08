module.exports = (grunt) ->

    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-watch'

    grunt.registerTask 'default', [ 'coffee', 'watch' ]

    grunt.initConfig

        coffee:
            dist:
                expand: true
                flatten: true
                src: [ 'src/*.coffee' ]
                dest: 'dist/'
                ext: '.js'
            test:
                expand: true
                flatten: true
                src: 'test/coffee/*.coffee'
                dest: 'test/js-built/'
                ext: '.js'

        watch:
            dist:
                files: [ 'src/*.coffee' ]
                tasks: [ 'coffee' ]
            test:
                files: [ 'test/coffee/*.coffee' ]
                tasks: [ 'coffee' ]
