/*
 * 注：kangarooui.js每次更新需修改version
 * 运行npm run base 命令更新base文件
 */

var gulp     = require('gulp');
var concat   = require('gulp-concat');
var uglify   = require('gulp-uglify');
var rev      = require('gulp-rev');
var rename   = require('gulp-rename');
var shell    = require('gulp-shell');
var fetch    = require('node-fetch');
var fs       = require('fs');
var sequence = require('gulp-sequence');
var exec     = require('child_process').exec;

//url配置、输出目录配置
var config  = {
    baseArr: [
        'http://xs01.meituan.net/waimai_web/js/lib/jquery_fde38c53.js',
        'http://xs01.meituan.net/kui/1.0.41/js/@waimai/kangarooui.min.js',
        'http://mss.sankuai.com/v1/mss_c4375b35f5cb4e678b5b55a48c40cf9d/waimai-mfe/bundle.js'
    ],
    fileName: 'base',
    outputDir: 'base'
};

var getBaseOutputPath = function() {
    var arr = [];
    var file = '';
    config.baseArr.map(function(item, index){
        file = item.substr(item.lastIndexOf('/'));
        arr.push(config.outputDir + file);
    });
    return arr;
};

//获取相应版本的kangarooui到本地
gulp.task('base', function(){
    var dest = '';
    config.baseArr.map(function(item, index) {
        fetch(item)
        .then(function(res) {
            dest = fs.createWriteStream(getBaseOutputPath()[index]);
            res.body.pipe(dest);
        });
    });
});

gulp.task('baseCombo', function(){
  //fetch会有延迟
  var timer = setTimeout(function(){
    gulp.src(getBaseOutputPath())
    .pipe(concat(config.fileName + '.js'))
    .pipe(uglify())
    .pipe(rev())
    .pipe(shell(['rm ' + config.outputDir + '/*']))
    .pipe(gulp.dest(config.outputDir));
    clearTimeout(timer);
  },500);
});

//顺序执行gulp任务
gulp.task('default', sequence('base', 'baseCombo'));
