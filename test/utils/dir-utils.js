var path = require('path'),
    mockFs = require('mock-fs'),
    dirUtils = require('../../utils/dir-utils');

describe('loadDirSync', function () {
    afterEach(function () {
        mockFs.restore();
    });

    it('should throw if no path to directory provided', function () {
        expect(function () { dirUtils.loadDirSync(); })
            .to.throw('No such directory undefined');
    });

    it('should throw if no directory exist for provided path', function () {
        expect(function () { dirUtils.loadDirSync('/random/dir/path'); })
            .to.throw('No such directory /random/dir/path');
    });

    it('should return array', function () {
        mockFs({
            '/testDir': {}
        });

        expect(dirUtils.loadDirSync('/testDir')).to.be.instanceOf(Array);
    });

    it('should return files for provided dir', function () {
        mockFs({
            '/testDir': {
                'file1.js': mockFs.file({ mtime: new Date(1) }),
                'file2.js': mockFs.file({ mtime: new Date(2) })
            }
        });

        var result = dirUtils.loadDirSync('/testDir');

        expect(result).to.have.length(2)
            .and.to.contain({
                fullname: path.normalize('/testDir/file1.js'),
                name: 'file1.js',
                suffix: 'js',
                mtime: 1
            })
            .and.to.contain({
                fullname: path.normalize('/testDir/file2.js'),
                name: 'file2.js',
                suffix: 'js',
                mtime: 2
            });
    });

    it('should ignore files beginning with .', function () {
        mockFs({
            '/testDir': {
                'file1.js': mockFs.file({ mtime: new Date(1) }),
                '.file2.js': mockFs.file({ mtime: new Date(2) })
            }
        });

        var result = dirUtils.loadDirSync('/testDir');

        expect(result).to.not.contain({
                fullname: path.normalize('/testDir/.file2.js'),
                name: '.file2.js',
                suffix: 'js',
                mtime: 2
            });
    });

    it('should ignore subdirectories if opts.recursive is not set', function () {
        mockFs({
            '/testDir': {
                'file1.js': mockFs.file({ mtime: new Date(1) }),
                anotherDir: {
                    'file2.js': mockFs.file({ mtime: new Date(2) })
                }
            }
        });

        var result = dirUtils.loadDirSync('/testDir', {});

        expect(result).to.not.contain({
                fullname: path.normalize('/testDir/anotherDir/file2.js'),
                name: 'file2.js',
                suffix: 'js',
                mtime: 2
            });
    });

    it('should include files from subdirectories if opts.recursive is true', function () {
        mockFs({
            '/testDir': {
                'file1.js': mockFs.file({ mtime: new Date(1) }),
                anotherDir: {
                    'file2.js': mockFs.file({ mtime: new Date(2) })
                }
            }
        });

        var result = dirUtils.loadDirSync('/testDir', { recursive: true });

        expect(result).to.contain({
                fullname: path.normalize('/testDir/anotherDir/file2.js'),
                name: 'file2.js',
                suffix: 'js',
                mtime: 2
            });
    });

    it('should ignore subdirectories starting with .', function () {
        mockFs({
            '/testDir': {
                'file1.js': mockFs.file({ mtime: new Date(1) }),
                '.anotherDir': {
                    'file2.js': mockFs.file({ mtime: new Date(2) })
                }
            }
        });

        var result = dirUtils.loadDirSync('/testDir', { recursive: true });

        expect(result).to.not.contain({
                fullname: path.normalize('/testDir/.anotherDir/file2.js'),
                name: 'file2.js',
                suffix: 'js',
                mtime: 2
            });
    });
});
