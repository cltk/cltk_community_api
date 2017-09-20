import { spawn } from 'child_process';

const args = ['start'];
const opts = { stdio: 'inherit', cwd: 'client', shell: true };

const yarn = spawn('yarn', [], opts);

yarn.on('exit', (code) => {
	if (code === 0) {
		return spawn('npm', args, opts);
	}

	console.log(`Exit code: ${code} -- it might be a good idea to see if something went wrong.`);
});

