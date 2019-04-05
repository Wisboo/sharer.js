import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';


export default [
	{
		input: 'src/demo.js',
		output: {
			name: 'demo.js',
			file: 'build/demo.js',
			format: 'iife',
		},
		plugins: [
			resolve(),
			commonjs(),
			babel({
				exclude: ['node_modules/**']
			}),
    	serve({
				open: true,
				openPage: '/demo.html',
				verbose: true,
				contentBase: '',
				port: 8000
			})
		]
	}
];
