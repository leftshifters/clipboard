import cp from 'child_process';
import gulp from 'gulp';
import fs from 'fs';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import path from 'path';
import runSequence from 'run-sequence';
import webpack from 'webpack';
import minimist from 'minimist';

const $ = gulpLoadPlugins();
const argv = minimist(process.argv.slice(2));
const src = Object.create(null);
const localProxy = 'localhost:3001';
// const bootstrapLocation = 'node_modules/bootstrap/';

let watch = false;
let browserSync;

// The default task
gulp.task('default', ['sync']);

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'build/*', '!build/.git'], {
  dot: true
}));

// Helper task to get bootstrap fonts from node_modules into src
// NOTE: Not part of build process
gulp.task('vendor-fonts', () => {
  return gulp
    .src([bootstrapLocation + 'dist/fonts/**/*'])
    .pipe(gulp.dest('src/fonts'));
});

// Helper task to get bootstap less from node_modules into src
// NOTE: Not part of build process
gulp.task('vendor-less', () => {
  return gulp
    .src([bootstrapLocation + 'less/**/*'])
    .pipe(gulp.dest('src/styles/bootstrap'));
});

// Static files
gulp.task('assets', () => {
  src.assets = [
    'package.json',
    'src/assets/**',
    'src/fonts*/**/*.*',
    'src/templates*/**/*.*'
  ];
  return gulp.src(src.assets)
    .pipe($.changed('build'))
    .pipe(gulp.dest('build'))
    .pipe($.size({
      title: 'assets'
    }));
});

// Bundle
gulp.task('bundle', cb => {
  let config = require('./webpack.config.js');
  const bundler = webpack(config);
  const verbose = !!argv.verbose;
  let bundlerRunCount = 0;

  function bundle(err, stats) {
    if (err) {
      throw new $.util.PluginError('webpack', err);
    }

    console.log(stats.toString({
      colors: $.util.colors.supportsColor,
      hash: verbose,
      version: verbose,
      timings: verbose,
      chunks: verbose,
      chunkModules: verbose,
      cached: verbose,
      cachedAssets: verbose
    }));

    if (++bundlerRunCount === config.length) {
      return cb();
    }
  }

  if (watch) {
    bundler.watch(200, bundle);
  } else {
    bundler.run(bundle);
  }
});

// Build the app from source code
gulp.task('build', ['clean'], cb => {
  runSequence(['assets', 'bundle'], cb);
});

// Build and start watching for modifications
gulp.task('build:watch', cb => {
  watch = true;
  runSequence('build', () => {
    gulp.watch(src.assets, ['assets']);
    cb();
  });
});

// Launch a Node.js/Express server
gulp.task('serve', ['build:watch'], cb => {
  src.server = [
    'build/server.js',
    'build/content/**/*',
    'build/templates/**/*'
  ];
  let started = false;
  let server = (function startup() {
    var child = cp.fork('build/server.js', {
      env: Object.assign({
        NODE_ENV: 'development'
      }, process.env)
    });
    child.once('message', message => {
      if (message.match(/^online$/)) {
        if (browserSync) {
          browserSync.reload();
        }
        if (!started) {
          started = true;
          gulp.watch(src.server, function() {
            $.util.log('Restarting development server.');
            server.kill('SIGTERM');
            server = startup();
          });
          cb();
        }
      }
    });
    return child;
  })();

  process.on('exit', () => server.kill('SIGTERM'));
});

// Launch BrowserSync development server
gulp.task('sync', ['serve'], cb => {
  browserSync = require('browser-sync');

  browserSync({
    logPrefix: 'RSK',
    notify: false,
    // Run as an https by setting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    https: false,
    // Informs browser-sync to proxy our Express app which would run
    // at the following location
    proxy: localProxy
  }, cb);

  process.on('exit', () => browserSync.exit());

  gulp.watch(['build/**/*.*'].concat(
    src.server.map(file => '!' + file)
  ), file => {
    browserSync.reload(path.relative(__dirname, file.path));
  });
});