var gulp = require('gulp');  
var concat = require('gulp-concat');  
var rename = require('gulp-rename');  
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify'); 

var jsFiles = ['js/vendor/*.js', 'data/more_info.js', 'data/savings_text.js','data/top_text.js', 'data/textData.js', 'js/urban-selects.js', 'js/bja.js'],  
    jsDest = '';

gulp.task('scripts', function() {  
    return gulp.src(jsFiles)
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

gulp.task('styles', function() {  

	return gulp.src(['css/chart.css','css/bja.css', 'css/vendor/*.css'])
	    .pipe(minifyCSS())
	    .pipe(concat('bja.min.css'))
	    .pipe(gulp.dest(''))
});