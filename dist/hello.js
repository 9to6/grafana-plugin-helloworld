'use strict';

System.register(['app/plugins/sdk'], function (_export, _context) {
	"use strict";

	var PanelCtrl, _createClass, panelDefaults, HelloCtrl;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	return {
		setters: [function (_appPluginsSdk) {
			PanelCtrl = _appPluginsSdk.PanelCtrl;
		}],
		execute: function () {
			_createClass = function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(target, descriptor.key, descriptor);
					}
				}

				return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			}();

			panelDefaults = {
				method: 'GET',
				baseUrl: 'http://localhost:8080',
				url: 'http://localhost:8080/v1/apps',
				errorMode: 'show',
				appName: 'DVR_FG1',
				appId: ''
			};

			_export('HelloCtrl', HelloCtrl = function (_PanelCtrl) {
				_inherits(HelloCtrl, _PanelCtrl);

				function HelloCtrl($scope, $injector, $http) {
					_classCallCheck(this, HelloCtrl);

					var _this = _possibleConstructorReturn(this, (HelloCtrl.__proto__ || Object.getPrototypeOf(HelloCtrl)).call(this, $scope, $injector));

					_this.$http = $http;
					_.defaults(_this.panel, panelDefaults);

					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('panel-teardown', _this.onPanelTeardown.bind(_this));
					_this.events.on('panel-initialized', _this.render.bind(_this));
					_this.initData();
					return _this;
				}

				_createClass(HelloCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						console.log('entering edit mode');
						this.addEditorTab('Options', 'public/plugins/' + this.pluginId + '/editor.html', 2);
					}
				}, {
					key: 'onPanelTeardown',
					value: function onPanelTeardown() {
						console.log('teared down');
					}
				}, {
					key: 'initData',
					value: function initData() {
						this.panelTabIndex = 0;
					}
				}, {
					key: 'link',
					value: function link(scope, elem) {
						var _this2 = this;

						console.log('link');
						console.log(scope);
						console.log(elem);

						var ret = this.getStackInfo();
						ret.then(function () {
							_this2.getApps().then(function () {
								console.log(_this2.ondemandApps);
							});
						});
					}
				}, {
					key: 'getStackInfo',
					value: function getStackInfo() {
						var _this3 = this;

						return this.$http({
							method: 'GET',
							url: this.panel.baseUrl + '/v1/stacks'
						}).then(function (response) {
							_this3.stack = response.data[0];
						}).then(function () {
							return _this3.$http({
								method: 'GET',
								url: _this3.panel.baseUrl + '/v1/stacks/' + _this3.stack.stack_id + '/zones'
							});
						}).then(function (response) {
							_this3.stackZones = response.data;
						}).catch(function (err) {
							console.log(err);
						});
					}
				}, {
					key: 'getApps',
					value: function getApps() {
						var _this4 = this;

						return this.$http({
							method: 'GET',
							url: this.panel.baseUrl + '/v1/apps'
						}).then(function (response) {
							var data = response.data;
							var _iteratorNormalCompletion = true;
							var _didIteratorError = false;
							var _iteratorError = undefined;

							try {
								for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
									var app = _step.value;

									if (_this4.panel.appName == app.name) {
										console.log(app.name);
										_this4.app = app;
									}
								}
							} catch (err) {
								_didIteratorError = true;
								_iteratorError = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion && _iterator.return) {
										_iterator.return();
									}
								} finally {
									if (_didIteratorError) {
										throw _iteratorError;
									}
								}
							}

							console.log(data.length);
						}).then(function () {
							return _this4.$http({
								method: 'GET',
								url: _this4.panel.baseUrl + '/v1/apps/' + _this4.app.app_id + '/groups'
							});
						}).then(function (response) {
							var data = response.data;
							var ondemandApps = new Array();
							var _iteratorNormalCompletion2 = true;
							var _didIteratorError2 = false;
							var _iteratorError2 = undefined;

							try {
								for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
									var appGroup = _step2.value;

									if (appGroup.type == 'ondemand') {
										ondemandApps.push(appGroup);
									}
								}
							} catch (err) {
								_didIteratorError2 = true;
								_iteratorError2 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion2 && _iterator2.return) {
										_iterator2.return();
									}
								} finally {
									if (_didIteratorError2) {
										throw _iteratorError2;
									}
								}
							}

							_this4.ondemandApps = ondemandApps;
						}).catch(function (err) {
							_this4.error = err; //.data.error + " ["+err.status+"]";
							console.warn('error', err);
						});
					}
				}, {
					key: 'changePanelTab',
					value: function changePanelTab(index) {
						console.log("index: " + index);
						console.log("ctrl.panelTabIndex:" + this.panelTabIndex);
						this.panelTabIndex = index;
					}
				}, {
					key: 'updatePanel',
					value: function updatePanel(app) {
						var _this5 = this;

						this.app = app;
						this.appID = app.app_id;
						console.log(app.app_id);

						this.$http({
							method: this.panel.method,
							url: this.panel.baseUrl + '/v1/apps/' + this.appID + '/groups'
						}).then(function (response) {
							var data = response.data;
							var ondemandApps = new Array();
							var _iteratorNormalCompletion3 = true;
							var _didIteratorError3 = false;
							var _iteratorError3 = undefined;

							try {
								for (var _iterator3 = data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
									var appGroup = _step3.value;

									if (appGroup.type == 'ondemand') {
										ondemandApps.push(appGroup);
									}
								}
							} catch (err) {
								_didIteratorError3 = true;
								_iteratorError3 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion3 && _iterator3.return) {
										_iterator3.return();
									}
								} finally {
									if (_didIteratorError3) {
										throw _iteratorError3;
									}
								}
							}

							console.log(ondemandApps);
						}, function (err) {
							_this5.error = err; //.data.error + " ["+err.status+"]";

							console.warn('error', err);
							var body = '<h1>Error</h1><pre>' + JSON.stringify(err, null, " ") + "</pre>";
						});
					}
				}]);

				return HelloCtrl;
			}(PanelCtrl));

			_export('HelloCtrl', HelloCtrl);

			HelloCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=hello.js.map
