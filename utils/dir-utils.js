var fs = require('fs'),
    path = require('path');
/**
 * Синхронно загружает список файлов из директории.
 * Пример:
 *
 * dir/
 * ├── file1.js
 * └── dir2/
 *     ├── file2.js
 *     └── .file3.js
 *
 *  dirUtils.loadDirSync('/dir', true); ->
 *
 *  [
 *      {
 *          fullname: '/dir1/file1.js',
 *          name: 'file1.js',
 *          suffix: 'js',
 *          mtime: 12345678900
 *      },
 *      {
 *          fullname: '/dir1/dir2/file2.js',
 *          name: 'file2.js',
 *          suffix: 'js',
 *          mtime: 12345678900
 *      }
 *  ]
 *
 * @param String dirname absolute path to directory.
 * @param {Object} opts lookup options
 * @param {Boolean} opts.recursive look for files in subdirectories.
 * @returns {Array}
 */
function loadDirSync(dirname, opts) {
    if (!dirname || !fs.existsSync(dirname)) {
        throw new Error('No such directory ' + dirname);
    }

    opts = opts || {};

    var files = [];
    filterFiles(fs.readdirSync(dirname)).forEach(function (filename) {
        var fullname = path.join(dirname, filename),
            stat = fs.statSync(fullname);
        if (stat.isFile()) {
            files.push({
                name: filename,
                fullname: fullname,
                suffix: getSuffix(filename),
                mtime: stat.mtime.getTime()
            });
        } else if (stat.isDirectory()) {
            if (opts.recursive) {
                files = files.concat(loadDirSync(fullname, opts));
            }
        }
    });
    return files;
}

// filtering hidden files, .. and ., .bem dirs, etc
function filterFiles(filenames) {
    return filenames.filter(function (filename) {
        return filename.charAt(0) !== '.';
    });
}

function getSuffix(filename) {
    return filename.split('.').slice(1).join('.');
}

exports.loadDirSync = loadDirSync;
