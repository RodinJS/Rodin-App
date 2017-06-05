/*
 Copyright (C) 2016 Grigor Khachatryan <grig@rodin.io>
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

const _ = require('lodash');
const es = require('event-stream');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const sequence = require('run-sequence');
const del = require('del');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const size = require('gulp-size');
const connect = require('gulp-connect');
const templateCache = require('gulp-angular-templatecache');
const VERSION = require('./package.json').version;
const VENDOR = require('./package.json').dependencies;
const VENDORMAP = require('./vendor.json');


const JSOTHERS = ['src/scripts/**/**/*.js', '!src/scripts/app/**', '!src/scripts/init/**', '!src/scripts/systemjs-module/**', '!src/scripts/{vendor,vendor/**}'];
const JSAPP = ['src/scripts/app/**/*.js'];
const SYSTEMINIT = ['src/scripts/init/**/*.js'];
const HTML = ['src/scripts/**/**/**/*.html'];
const SASS = ['src/styles/**/*.scss', '!src/styles/{vendor,vendor/**}'];
const FONT = ['src/fonts/**/*.{ttf,woff,woff2,eof,svg,eot,json}'];
const IMG = ['src/images/**/*'];

const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

const UGLIFY_AGRESIVE = {
  preserveComments: 'license',
  mangle: true,
  compress: true
};

const ERROR_MESSAGE = {
  errorHandler: notify.onError("Error: <%= error.message %>")
};

gulp.task('system:init', () => {
    const s = size({title: 'Sysytem Init -> ', pretty: false});
    return gulp.src(SYSTEMINIT)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(s)
        .pipe(plumber.stop())
        .pipe(gulp.dest('./build/init'))
        .pipe(notify({
            onLast: true,
            message: () => `Sysytem(init) - Total size ${s.prettySize}`
        }));
});


gulp.task('vendor', () => {
  let vendor_tasks = generate_vendor(VENDOR);

  let custom_vendor_tasks = _.map(VENDORMAP, (item, key) => {
    let src, dest;

    src = item.src;
    if (!src) {
      throw new Error(`Please provide ${key} external module src.`);
    }
    dest = `./build/scripts/vendor/${item.dest || ""}`;

    return gulp.src(src).pipe(gulp.dest(dest))
  });

  es.merge(_.concat(vendor_tasks, custom_vendor_tasks));
});

function generate_vendor(vendor) {
  let list = [];
  return _.concat(list, _.map(vendor, (item, key) => {
    let src, dest, dependencies;
    let module = key;
    if (VENDORMAP && VENDORMAP[module]) {
      let moduleMap = VENDORMAP[module];
      src = moduleMap.src;
      if (!src) {
        throw new Error(`Please provide ${key} module src.`);
      }
      dest = `./build/scripts/vendor/${moduleMap.dest || key}`;
    } else {
      dependencies = require(`./node_modules/${module}/package.json`).dependencies;
      src = `./node_modules/${module}/**/*.*`;
      dest = `./build/scripts/vendor/${module}`;
    }

    delete VENDORMAP[module];
    let task = gulp.src(src).pipe(gulp.dest(dest));

    if (dependencies) {
      _.concat(list, generate_vendor(dependencies));
    }

    return task;
  }));
}

gulp.task('jsapp', () => {
  const s = size({title: 'JSAPP -> ', pretty: true});
  return gulp.src(JSAPP)
    .pipe(plumber(ERROR_MESSAGE))
    .pipe(sourcemaps.init())
    .pipe(babel({
      "presets": [
        "es2015"
      ],
      "plugins": [
        "angularjs-annotate"
      ]
    }))
    .pipe(s)
    .pipe(plumber.stop())
    .pipe(gulp.dest('./build/app'))
    .pipe(notify({
      onLast: true,
      message: () => `JSAPP - Total size ${s.prettySize}`
    }));
});

gulp.task('jsothers', () => {
  const s = size({title: 'JSOTHERS -> ', pretty: true});
  return gulp.src(JSOTHERS)
    .pipe(plumber(ERROR_MESSAGE))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(s)
    .pipe(plumber.stop())
    .pipe(gulp.dest('./build'))
    .pipe(notify({
      onLast: true,
      message: () => `JSOTHERS - Total size ${s.prettySize}`
    }));
});

gulp.task('jsapp-prod', () => {
  const s = size({title: 'JSAPP production -> ', pretty: false});
  return gulp.src(JSAPP)
    .pipe(plumber(ERROR_MESSAGE))
    .pipe(babel({
      "presets": [
        "es2015"
      ],
      "plugins": [
        "angularjs-annotate"
      ]
    }))
    .pipe(uglify(UGLIFY_AGRESIVE))
    .pipe(s)
    .pipe(plumber.stop())
    .pipe(gulp.dest('./build/app'))
    .pipe(notify({
      onLast: true,
      message: () => `JSAPP(prod) - Total size ${s.prettySize}`
    }));
});

gulp.task('jsothers-prod', () => {
  const s = size({title: 'JSOTHERS production -> ', pretty: false});
  return gulp.src(JSOTHERS)
    .pipe(plumber(ERROR_MESSAGE))
    .pipe(babel())
    // .pipe(uglify(UGLIFY_AGRESIVE))
    .pipe(s)
    .pipe(plumber.stop())
    .pipe(gulp.dest('./build'))
    .pipe(notify({
      onLast: true,
      message: () => `JSOTHERS(prod) - Total size ${s.prettySize}`
    }));
});

gulp.task('template', () => {
  const s = size({title: 'template -> ', pretty: false});
  return gulp.src(HTML)
    .pipe(plumber(ERROR_MESSAGE))
    .pipe(templateCache({
      standalone: true
    }))
    .pipe(rename("app.templates.js"))
    .pipe(s)
    .pipe(plumber.stop())
    .pipe(gulp.dest('./src/scripts/app/config/'))
    .pipe(notify({
      onLast: true,
      message: () => `template - Total size ${s.prettySize}`
    }));
});

gulp.task('generate-index', () => {
  const s = size({title: 'generate-index -> ', pretty: false});
  return gulp.src('./src/index.html')
    .pipe(plumber(ERROR_MESSAGE))
    .pipe(s)
    .pipe(plumber.stop())
    .pipe(gulp.dest('./build/'))
    .pipe(notify({
      onLast: true,
      message: () => `generate-index - Total size ${s.prettySize}`
    }));
});


gulp.task('sass', () => {
  const s = size({
    onLast: true,
    title: 'SASS -> ',
    pretty: true
  });
  return gulp.src(SASS)
    .pipe(plumber(ERROR_MESSAGE))
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(sourcemaps.write())
    .pipe(s)
    .pipe(plumber.stop())
    .pipe(gulp.dest('./build/styles'))
    .pipe(notify({
      onLast: true,
      message: () => `SASS - Total size ${s.prettySize}`
    }));
});

gulp.task('sass-prod', () => {
  const s = size({
    onLast: true,
    title: 'SASS -> ',
    pretty: false
  });
  return gulp.src(SASS)
    .pipe(plumber(ERROR_MESSAGE))
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    // .pipe(sourcemaps.init())
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(cleanCSS())
    // .pipe(sourcemaps.write())
    .pipe(s)
    .pipe(gulp.dest('./build/styles'))
    .pipe(notify({
      onLast: true,
      message: () => `SASS(prod) - Total size ${s.prettySize}`
    }));
});


gulp.task('font', () => {
  gulp.src(FONT)
    .pipe(plumber(ERROR_MESSAGE))
    .pipe(gulp.dest('./build/fonts'));
});

gulp.task('img', () => {
  gulp.src(IMG)
    .pipe(plumber(ERROR_MESSAGE))
    .pipe(gulp.dest('./build/images'));
});


gulp.task('watch', () => {
  gulp.watch(SASS, ['sass']);
  gulp.watch(JSOTHERS, ['jsothers']);
  gulp.watch(JSAPP, ['jsapp']);
  gulp.watch(HTML, ['build-template']);
  gulp.watch(FONT, ['font']);
  gulp.watch(IMG, ['img']);
  gulp.watch("src/index.html", ['generate-index']);
});

gulp.task('clean', () => {
  return del(['./build/**']);
});


gulp.task('connect', () => {
  connect.server({
    root: './build/',
    port: 4000,
    livereload: true
  });
});


gulp.task('build-template', (done) => {
  sequence('template', 'js', done);
});

gulp.task('prod', (done) => {
  sequence('clean', 'vendor', 'system:init', ['generate-index', 'template', 'jsapp-prod', 'jsothers-prod', 'sass-prod', 'font', 'img'], done);
});

gulp.task('default', (done) => {
  sequence('clean', 'vendor', 'system:init', ['generate-index', 'template', 'jsapp', 'jsothers', 'sass', 'font', 'img', 'connect', 'watch'], done);
});