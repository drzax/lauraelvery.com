import gulp from "gulp";
import {spawn} from "child_process";
import hugoBin from "hugo-bin";
import log from "fancy-log";
import pluginError from "plugin-error";
import flatten from "gulp-flatten";
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssnext from "postcss-cssnext";
import responsive from "gulp-responsive";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// Development tasks
function buildPreview(cb) {
  buildSite(cb, hugoArgsPreview);
}

// Run server tasks
gulp.task("server", gulp.series(buildSite, css, js, fonts, img, (cb) => runServer(cb)));
gulp.task("server-preview", gulp.series(buildPreview, css, js, fonts, img, (cb) => runServer(cb)));

// Build/production tasks
gulp.task("build", gulp.series(css, js, fonts, img, (cb) => buildSite(cb, [], "production")));
gulp.task("build-preview", gulp.series(css, js, fonts, img, (cb) => buildSite(cb, hugoArgsPreview, "production")));

// Compile CSS with PostCSS
function css() {
  return gulp
    .src("./src/css/*.css")
    .pipe(postcss([cssImport({from: "./src/css/main.css"}), cssnext()]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
}

// Compile Javascript
function js(cb) {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new pluginError("webpack", err);
    log(
      `[webpack] ${stats.toString({
        colors: true,
        progress: true
      })}`
    );
    browserSync.reload();
    cb();
  });
}

function img() {
  return gulp
    .src("./src/images/*.*")
    .pipe(
      responsive(
        {
          "*": [
            {
              width: 480,
              rename: {prefix: "small/"}
            },
            {
              width: 675,
              rename: {prefix: "medium/"}
            }
          ]
        },
        {
          silent: true // Don't spam the console
        }
      )
    )
    .pipe(gulp.dest("./dist/images"));
}

// Move all fonts in a flattened directory
function fonts() {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(flatten())
    .pipe(gulp.dest("./dist/fonts"))
    .pipe(browserSync.stream());
}

// Development server with browsersync
function runServer() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./src/js/**/*.js", js);
  gulp.watch("./src/css/**/*.css", css);
  gulp.watch("./src/fonts/**/*", fonts);
  gulp.watch("./src/images/**/*", img);
  gulp.watch("./site/**/*", buildSite);
}

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = "development") {
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

  process.env.NODE_ENV = environment;

  return spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
