var path = require('path'),
    inherit = require('inherit'),
    TestLogger = inherit({
        __constructor: function (scope, options) {
            this._messages = [];
            this._enabled = true;
            this._scope = scope || '';
            this._options = options || {};
        },
        log: function (msg, scope, action) {
            if (this._enabled) {
                this._messages.push({
                    message: msg,
                    scope: scope,
                    action: action
                });
            }
        },
        logAction: function (action, target, additionalInfo) {
            this.log(
                additionalInfo,
                (this._scope && (this._scope + '/')) + target,
                action
            );
        },
        logWarningAction: function (action, target, msg) {
            if (!this._options.hideWarnings) {
                this.log(
                    msg,
                    (this._scope && (this._scope + path.sep)) + target,
                    '[' + action + ']'
                );
            }
        },
        logTechIsDeprecated: function (target, deprecatedTech, thisPackage, newTech, newPackage, desc) {
            this.logWarningAction('deprecated',
                target,
                'Tech ' + thisPackage + '/techs/' + deprecatedTech + ' is deprecated.' +
                (newTech && newPackage ?
                ' ' +
                (newPackage === thisPackage ?
                    'Use ' :
                'Install package ' + newPackage + ' and use '
                ) +
                'tech ' + newPackage + '/techs/' + newTech + ' instead.' :
                    ''
                ) +
                (desc || '')
            );
        },
        logOptionIsDeprecated: function (target, thisPackage, tech, thisOption, newOption, desc) {
            this.logWarningAction('deprecated',
                target,
                'Option ' + thisOption + ' of ' + thisPackage + '/techs/' + tech +
                ' is deprecated.' +
                (newOption ? ' Use option ' + newOption + ' instead.' : '') +
                (desc || '')
            );
        },
        logErrorAction: function (action, target, additionalInfo) {
            this.log(
                additionalInfo,
                (this._scope && (this._scope + '/')) + target,
                action
            );
        },
        isValid: function (target, tech) {
            this.logAction('isValid', target, tech);
        },
        logClean: function (target) {
            this.logAction('clean', target);
        },
        setEnabled: function (enabled) {
            this._enabled = enabled;
        },
        isEnabled: function () {
            return this._enabled;
        },
        hideWarnings: function () {
            this._options.hideWarnings = true;
        },
        showWarnings: function () {
            this._options.hideWarnings = false;
        },
        subLogger: function (scope) {
            var res = new TestLogger(this._scope + (scope.charAt(0) === ':' ? scope : (this._scope && '/') + scope));
            res.setEnabled(this._enabled);
            return res;
        }
    });

module.exports = TestLogger;
