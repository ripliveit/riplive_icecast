module.exports = function(grunt) {
    grunt.initConfig({
        sshconfig: {
            'server': {
                host: process.env.SSH_HOST,
                username: process.env.SSH_USER,
                password: process.env.SSH_PASSWORD,
                port: process.env.SSH_PORT,
            }
        },
        sshexec: {
            deploy: {
                command: [
                    'cd /var/www/riplive_icecast',
                    'git pull origin master',
                    'npm install --dev',
                    'NODE_ENV=production forever restart app.js',
                    'forever list'
                ].join(' && '),
                options: {
                    config: 'server'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-ssh');

    grunt.registerTask('deploy', [
        'sshexec:deploy'
    ]);
};
