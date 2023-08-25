const gulp = require('gulp');

// Tasks
require('./gulp/dev.js');
require('./gulp/docs.js');

gulp.task(
    'dev',
    gulp.series(
        'clean:dev',
        gulp.parallel('html:dev', 'sass:dev', 'images:dev', 'fonts:dev', 'js:dev'),
        gulp.parallel('server:dev', 'watch:dev')
    )
);

gulp.task(
    'build',
    gulp.series(
        'clean:docs',
        gulp.parallel('html:docs', 'sass:docs', 'images:docs', 'fonts:docs', 'js:docs'),
    )
);
