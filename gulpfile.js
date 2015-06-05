"use strict";

// dependencies
var gulp        = require("gulp"),
    nodemon     = require("gulp-nodemon"),
    jshint      = require("gulp-jshint"),
    sass        = require("gulp-ruby-sass"),
    autoprefix  = require("gulp-autoprefixer"),
    browserify  = require("gulp-browserify"),
    templates   = require("gulp-template-compile"),
    concat      = require("gulp-concat"),
    browserSync = require("browser-sync"),
    reload      = browserSync.reload;


// paths
var paths = {};
paths.frontEnd = {
  styleSource:    "public/source/style/scss/**/*.scss",
  styleMain:      "public/source/style/scss/main.scss",
  styleBuild:     "public/build/css/",

  scriptSource:   "public/source/scripts/**/*.js",
  scriptMain:     "public/source/scripts/main.js",
  scriptBuild:    "public/build/scripts/",

  templateSource: "public/source/templates/*.ejs",
  templateBuild:  "public/source/templates",

  imageSource:    "public/source/style/images/**/*",
  imageBuild:     "public/build/images",

  htmlSource:     "public/source/**/*.html",
  htmlBuild:      "public/build"
};
paths.backEnd = {
  scriptSource:   "app/**/*.js",
  scriptMain:     "app/server.js"
};

gulp.task("lint", function () {

  gulp.src( paths.backEnd.scriptSource )
    .pipe( jshint() );

  gulp.src( paths.frontEnd.scriptSource )
    .pipe( jshint() );
});

gulp.task("style", function () {

  return gulp.src( paths.frontEnd.styleMain )
    .pipe( sass() )
    .pipe( autoprefix() )
    .pipe( gulp.dest(paths.frontEnd.styleBuild) )
    .pipe(reload({stream:true}));
});

gulp.task("scripts", function () {

  return gulp.src( paths.frontEnd.scriptMain )
    .pipe( browserify())
    .pipe( gulp.dest(paths.frontEnd.scriptBuild) );
});

gulp.task("html", function () {

  return gulp.src( paths.frontEnd.htmlSource )
    .pipe( gulp.dest(paths.frontEnd.htmlBuild) );
});

gulp.task("js-dependencies", function () {

  return gulp.src( "public/bower_components/modernizr/modernizr.js" )
    .pipe( gulp.dest(paths.frontEnd.scriptBuild) );
});

gulp.task("templates", function () {

  gulp.src( paths.frontEnd.templateSource )
    .pipe(templates())
    .pipe(concat("templates.js"))
    .pipe(gulp.dest( paths.frontEnd.templateBuild ));
});

gulp.task("images", function () {

  return gulp.src( paths.frontEnd.imageSource )
    .pipe( gulp.dest(paths.frontEnd.imageBuild) );
});

/* LOCAL SERVER */
gulp.task("browser-sync", function() {

  browserSync({
    server: {
      baseDir: "./public/build/"
    },
    port: 8080,
    open: false
  });
});

/* NODE SERVER */
gulp.task("server", function () {

  nodemon({
    script: paths.backEnd.scriptMain,
    ext: "js",
    env: {
      "NODE_ENV": "development"
    }
  })
  .on("change", ["lint"])
  .on("restart", function () {
    console.log("Nodemon: restarting");
  });
});

gulp.task("watch", ["server", "browser-sync"], function () {

  gulp.watch( paths.frontEnd.styleSource, ["style"] );
  gulp.watch( paths.frontEnd.scriptSource, ["scripts", reload] );
  gulp.watch( paths.frontEnd.imageSource, ["images"] );
  gulp.watch( paths.frontEnd.htmlSource, ["html", reload] );
  gulp.watch( paths.frontEnd.templateSource, ["templates", "scripts", reload] );
});

gulp.task("default", ["style", "images", "js-dependencies", "scripts"]);
