var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var paths = {
  pages: ["*.html"]
};

gulp.task("copy-html", function() {
  return gulp.src(paths.pages).pipe(gulp.dest("."));
});

gulp.task(
  "default",
  gulp.series(gulp.parallel("copy-html"), function() {
    return browserify({
      basedir: ".",
      debug: true,
      entries: ["scripts.ts"],
      cache: {},
      packageCache: {}
    })
      .plugin(tsify)
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(gulp.dest("."));
  })
);