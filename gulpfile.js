var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var tsify = require("tsify");
var fancy_log = require("fancy-log");
var paths = {
  pages: ["src/*.html", "src/*.css", "src/*.png"]
};

var watchedBrowserify = watchify(
  browserify({
    basedir: ".",
    debug: true,
    entries: ["src/scripts.ts"],
    cache: {},
    packageCache: {}
  }).plugin(tsify)
);

gulp.task("copy-html", function() {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

gulp.task(
  "default",
  gulp.series(gulp.parallel("copy-html"), function() {
    return browserify({
      basedir: ".",
      debug: true,
      entries: ["src/scripts.ts"],
      cache: {},
      packageCache: {}
    })
      .plugin(tsify)
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(gulp.dest("dist"));
  })
);

function bundle() {
  return watchedBrowserify
    .bundle()
    .on("error", fancy_log)
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist"));
}
function htmlwatch() {
  return gulp.watch("src/*.html").on('change', gulp.series("copy-html"))
}
function csswatch() {
  return gulp.watch("src/*.css").on('change', gulp.series("copy-html"))
}
gulp.task("dev", gulp.series(gulp.parallel("copy-html"), bundle, gulp.parallel(htmlwatch, csswatch)));
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);

