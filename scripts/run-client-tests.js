const args = ['test'];
const opts = { stdio: 'inherit', cwd: 'client', shell: true };
require('child_process').spawn('NODE_ENV=test npm', args, opts);
