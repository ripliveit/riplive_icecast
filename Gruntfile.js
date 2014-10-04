module.exports = function(grunt) {
  grunt.initConfig({
    sshconfig: {
      'onair.riplive.it': {
      	host: 'onair.riplive.it',
        username: process.env.SSH_USER,
        password: process.env.SSH_PASSWORD,
        port : 5430
      }
    },
    sshexec: {
      deploy: {
        command: [
          'cd /var/www/riplive_icecast',
          'git pull origin master',
          'npm install',
          'forever restart app.js',
          'forever list'
        ].join(' && '),
        options: {
          config: 'onair.riplive.it'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-ssh');

  grunt.registerTask('deploy', [
    'sshexec:deploy'
  ]);
};