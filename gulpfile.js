"use strict";

// dependencies
var gulp        = require("gulp"),
    nodemon     = require("gulp-nodemon"),
    jshint      = require("gulp-jshint");


// paths
var paths = {};

paths.backEnd = {
  scriptSource:   "app/**/*.js",
  scriptMain:     "app/server.js"
};

gulp.task("lint", function () {

  return gulp.src( paths.backEnd.scriptSource )
    .pipe( jshint() );
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

gulp.task("default", ["server"]);
