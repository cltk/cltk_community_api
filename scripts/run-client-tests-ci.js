const args = ['run', 'test-ci'];
const opts = { stdio: 'inherit', cwd: 'client', shell: true };
require('child_process').spawn('NODE_ENV=test NODE_PATH=src/ npm', args, opts);
