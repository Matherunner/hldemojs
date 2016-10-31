/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

import del from 'del';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';

const paths = {
	outputFiles: 'dist/hldemo.*',
	bundleJs: 'dist/hldemo.js',
	distDir: 'dist',
	entryPoint: 'src/hldemo.js',
	gulpFile: 'gulpfile.babel.js',
	srcJs: 'src/**/*.js',
	webpackFile: 'webpack.config.babel.js',
};

gulp.task('clean', () =>
	del([
		paths.outputFiles,
	])
);

gulp.task('lint', () =>
	gulp.src([
		paths.srcJs,
		paths.gulpFile,
		paths.webpackFile,
	])
	.pipe(eslint())
	.pipe(eslint.format())
	.pipe(eslint.failAfterError())
);

gulp.task('minify', ['main'], () =>
	gulp.src(paths.bundleJs)
		.pipe(rename({ extname: '.min.js' }))
		.pipe(uglify())
		.on('error', console.error.bind(console))
		.pipe(gulp.dest(paths.distDir))
);

gulp.task('main', ['clean', 'lint'], () =>
	gulp.src(paths.entryPoint)
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest(paths.distDir))
);

gulp.task('release', ['main', 'minify']);
gulp.task('default', ['main']);
