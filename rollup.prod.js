import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';


export default [
	{
		input: 'src/sharer.js',
		external: [
			'angular'
		],
		output: {
			name: 'ngSharerjs',
			file: 'dist/ng-sharer.js',
			format: 'cjs',
		},
		plugins: [
			resolve(),
			commonjs(),
			babel()
		]
	}
];
