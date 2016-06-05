/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "b9c80094e0786220fa66"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(Object.defineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(Object.defineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = __webpack_require__(1);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi main\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_main?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("__webpack_require__(2);\n__webpack_require__(3);\n__webpack_require__(4);\nvar switcher = __webpack_require__(5);\nvar drawChart = __webpack_require__(6);\n\nswitcher.init();\ndrawChart.init();\n\n\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/index.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/index.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("// removed by extract-text-webpack-plugin\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/style/loader.styl\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/style/loader.styl?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("// removed by extract-text-webpack-plugin\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/style/switcher.styl\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/style/switcher.styl?");

/***/ },
/* 4 */
/***/ function(module, exports) {

	eval("// removed by extract-text-webpack-plugin\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/style/style.styl\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/style/style.styl?");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	eval("var globalSwitcher = document.querySelector('.containerSwitcher-global');\nvar allChartsContainer = document.querySelector('.allChartsContainer');\nvar localSwitchers = [];\nvar drawChart = __webpack_require__(6);\n\nmodule.exports = {\n\tinit: function() {\n\t\tglobalSwitcher.addEventListener('change', switchGlobalView);\n\t},\n\tcreateSwitcher: createSwitcher\n};\n\nfunction closest(element, selector) {\n\twhile (element && element.nodeType === 1) {\n\t\tif (element.matches(selector)) {\n\t\t\treturn element;\n\t\t}\n\t\telement = element.parentNode;\n\t}\n\treturn null;\n}\n\nfunction switchView(e) {\n\tswitchLocalView(e.target);\n}\n\nfunction switchLocalView(switcher, override, showIt) {\n\tvar chartContainer = closest(switcher, '.chartContainer');\n\tvar options = closest(switcher, '.containerSwitcher').querySelectorAll('input');\n\n\tvar id = chartContainer ? chartContainer.id : null;\n\tshowIt = override ? showIt : options[0].checked;\n\n\tif (showIt) {\n\t\tdrawChart.drawCommon(id);\n\t} else {\n\t\tdrawChart.drawIt(id);\n\t}\n\n\tif (override) {\n\t\toptions[0].checked = showIt;\n\t\toptions[1].checked = !showIt;\n\t}\n}\n\nfunction switchGlobalView(e) {\n\tvar options = closest(e.target, '.containerSwitcher').querySelectorAll('input');\n\tvar newState = options[0].checked;\n\tlocalSwitchers.forEach(function(switcher) {\n\t\tswitchLocalView(switcher, true, newState);\n\t})\n}\n\nfunction createSwitcher(container) {\n\tvar newSwitcher = globalSwitcher.cloneNode(true);\n\tnewSwitcher.classList.remove('containerSwitcher-global');\n\tnewSwitcher.classList.add('containerSwitcher-local');\n\n\tlocalSwitchers.push(newSwitcher);\n\n\tnewSwitcher.innerHTML = newSwitcher.innerHTML\n\t\t.replace(/\"((common)|(it)|(sphere))\"/g, '$1' + localSwitchers.length);\n\n\tcontainer.appendChild(newSwitcher);\n\n\tnewSwitcher.addEventListener('change', switchView);\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/containerSwitcher.js\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/containerSwitcher.js?");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	eval("var config = __webpack_require__(7);\nvar getAllData = __webpack_require__(8).getAllData;\nvar objectAssign = __webpack_require__(16);\nvar analyze = __webpack_require__(15);\nvar createSwitcher;\n\nvar allChartsContainer = document.querySelector('.allChartsContainer');\nvar wholeContainer = document.querySelector('.container');\nvar charts = [];\nvar chartsData = {};\n\n\nmodule.exports = {\n\tinit: function() {\n\t\tcreateSwitcher = __webpack_require__(5).createSwitcher;\n\t\tgoogle.charts.load('current', {packages: ['corechart', 'bar']});\n\n\t\tgoogle.charts.setOnLoadCallback(draw);\n\n\t\tfunction draw() {\n\t\t\tgetAllData()\n\t\t\t\t.then(prepareChartsData)\n\t\t\t\t.then(function(allData) {\n\t\t\t\t\tchartsData = allData;\n\t\t\t\t\tcharts = createChartInstances(Object.keys(chartsData.common));\n\t\t\t\t\tdrawCharts(chartsData.common);\n\t\t\t\t})\n\t\t}\n\t},\n\tdrawIt: function(id) {\n\t\tif (!id) {\n\t\t\tdrawCharts(chartsData.itOnly);\n\t\t} else {\n\t\t\tdrawOneChart(charts[id], chartsData.itOnly[id]);\n\t\t}\n\t},\n\tdrawCommon: function(id) {\n\t\tif (!id) {\n\t\t\tdrawCharts(chartsData.common);\n\n\t\t} else {\n\t\t\tdrawOneChart(charts[id], chartsData.common[id]);\n\t\t}\n\t}\n\n};\n\nfunction prepareDataViews(dataByCurrency) {\n\tvar expStats = dataByCurrency.exp;\n\tvar expData = Object.keys(expStats)\n\t\t.map(function(key) {\n\t\t\treturn [key, expStats[key].men, expStats[key].women]\n\t\t});\n\tif (config.vAxis.maxValue < dataByCurrency.maxAverage) {\n\t\tconfig.vAxis.maxValue = dataByCurrency.maxAverage;\n\t}\n\tvar cityData = [\n\t\t['Суммарно', dataByCurrency.men, dataByCurrency.women],\n\t\t['В Москве', dataByCurrency.cities.msk.men, dataByCurrency.cities.msk.women],\n\t\t['В Питере', dataByCurrency.cities.spb.men, dataByCurrency.cities.spb.women],\n\t\t['В остальных городах', dataByCurrency.cities.allOther.men, dataByCurrency.cities.allOther.women]\n\t];\n\treturn {\n\t\texp: prepareOneChartData(expData, 'Валюта', 'По стажу работы'),\n\t\tcity: prepareOneChartData(cityData, 'City', 'По городам')\n\t};\n}\n\nfunction prepareChartsData(data) {\n\tvar allData = analyze.getAllInRoubles(data);\n\tvar itData = analyze.getIT(allData);\n\n\tvar commonStats = analyze.getAllStats(allData);\n\tvar itOnlyStats = analyze.getAllStats(itData);\n\n\treturn {\n\t\tcommon: prepareDataViews(commonStats),\n\t\titOnly: prepareDataViews(itOnlyStats)\n\t};\n}\n\nfunction drawCharts(data) {\n\twholeContainer.classList.add('loaded');\n\tObject.keys(data).forEach(function(key) {\n\t\tdrawOneChart(charts[key], data[key]);\n\t});\n}\n\nfunction prepareOneChartData(data, columnName, title) {\n\tvar columns = [columnName, 'Мужчины', 'Женщины'];\n\treturn {info: [columns].concat(data), title: title};\n}\n\nfunction createChartInstance(container, id) {\n\tvar chartContainer = document.createElement('div');\n\tvar chartInstance = document.createElement('div');\n\tchartInstance.classList.add('chart');\n\tchartContainer.classList.add('chartContainer');\n\tchartContainer.id =  id;\n\tcontainer.appendChild(chartContainer);\n\tchartContainer.appendChild(chartInstance);\n\tcreateSwitcher(chartContainer);\n\treturn chartInstance;\n}\n\nfunction createChartInstances(keys) {\n\tvar chartInstances = {};\n\tvar numberOfCharts = keys.length;\n\n\twhile (numberOfCharts) {\n\t\tvar key = keys[numberOfCharts - 1];\n\t\tvar chartElement = createChartInstance(allChartsContainer, key);\n\t\tchartInstances[key] = new google.visualization.ColumnChart(chartElement);\n\t\tnumberOfCharts--;\n\t}\n\treturn chartInstances;\n}\n\n\nfunction drawOneChart(barChart, data) {\n\tvar barData = google.visualization.arrayToDataTable(data.info);\n\tvar formatter = new google.visualization.NumberFormat({fractionDigits: 0, suffix: '₽'});\n\tformatter.format(barData, 1);\n\tformatter.format(barData, 2);\n\n\tvar view = new google.visualization.DataView(barData);\n\tvar localConfig = data.title ? objectAssign({title: data.title}, config) : config;\n\tbarChart.draw(view, localConfig);\n\treturn barChart;\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/chart.js\n ** module id = 6\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/chart.js?");

/***/ },
/* 7 */
/***/ function(module, exports) {

	eval("module.exports = {\n\tfocusTarget: 'category',\n\tbackgroundColor: {fill: 'transparent'},\n\tcolors: ['#008FCC', '#E82258'],\n\tfontName: 'Open Sans',\n\tchartArea: {\n\t\tleft: 70,\n\t\ttop: 20,\n\t\twidth: '100%',\n\t\theight: '70%'\n\t},\n\tbar: {\n\t\tgroupWidth: '80%'\n\t},\n\thAxis: {\n\t\ttextStyle: {\n\t\t\tfontSize: 11\n\t\t}\n\t},\n\tvAxis: {\n\t\tminValue: 0,\n\t\tmaxValue: 100,\n\t\tbaselineColor: '#DDD',\n\t\tformat: '##,###₽',\n\t\ttextStyle: {\n\t\t\tfontSize: 11,\n\t\t\tfontWeight: 'normal'\n\t\t}\n\t},\n\tlegend: {\n\t\tposition: 'bottom',\n\t\ttextStyle: {\n\t\t\tfontName: 'Open Sans',\n\t\t\tfontSize: 14\n\t\t}\n\t},\n\ttitleTextStyle: {\n\t\tfontName: 'Open Sans',\n\t\tfontSize: 14,\n\t\tfontWeight: '400'\n\t},\n\tanimation: {\n\t\tduration: 200\n\t}\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/config/chartConfig.js\n ** module id = 7\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/config/chartConfig.js?");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	eval("var url = 'https://docs.google.com/spreadsheets/d/1_hcoJyWIR2nKpSaw31SlRQ4SeMAhN57y0KI1Q6YlzIw/edit#gid=1811284584';\nvar sheetrock = __webpack_require__(9);\nvar Promise = __webpack_require__(10).Promise;\nvar analyze = __webpack_require__(15);\n\nvar DOLLAR = 'Доллары';\nvar ROUBLES = 'Рубли';\nvar MAN = 'Мужчина';\nvar WOMAN = 'Женщина';\n\n\nmodule.exports = {\n\tgetAllData: getAllData\n};\n\nfunction getDataFromSheet(query) {\n\treturn new Promise(function(resolve, reject) {\n\t\tsheetrock({\n\t\t\turl: url,\n\t\t\tquery: query,\n\t\t\tcallback: function(error, options, response) {\n\t\t\t\tif (error) {\n\t\t\t\t\treject(error);\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t\tresolve(response);\n\t\t\t}\n\t\t})\n\t});\n}\nfunction getAllData() {\n\treturn getDataFromSheet('select C, D, F,G,H, I,J, K,M, A')\n\t\t.then(function(allData) {\n\t\t\tvar data = allData.raw.table.rows;\n\t\t\tvar result = [];\n\n\t\t\tdata.forEach(function(item) {\n\t\t\t\tvar dataItem = item.c.map(function(itemField) {\n\t\t\t\t\treturn !!itemField ? itemField : {v: null};\n\t\t\t\t});\n\t\t\t\tif (!analyze.isFake(dataItem[9].f)) {\n\t\t\t\t\tvar salary = dataItem[4].v;\n\t\t\t\t\tif (!analyze.needToMultiply(dataItem[9].f)) {\n\t\t\t\t\t\tsalary *= 1000;\n\t\t\t\t\t}\n\t\t\t\t\tresult.push({\n\t\t\t\t\t\tcity: dataItem[0].v,\n\t\t\t\t\t\tjob: dataItem[1].v.toLowerCase(),\n\t\t\t\t\t\texp: dataItem[2].v,\n\t\t\t\t\t\tfullExp: dataItem[3].v,\n\t\t\t\t\t\tsalary: salary,\n\t\t\t\t\t\tmonthlyBonus: dataItem[5].v || 0,\n\t\t\t\t\t\tyearlyBonus: dataItem[6].v || 0,\n\t\t\t\t\t\tgender: dataItem[7].v,\n\t\t\t\t\t\tcurrency: dataItem[8].v,\n\t\t\t\t\t\tisRoubles: (dataItem[8].v === ROUBLES),\n\t\t\t\t\t\tisWoman: (dataItem[7].v === WOMAN)\n\t\t\t\t\t})\n\t\t\t\t}\n\t\t\t});\n\t\t\treturn result;\n\t\t})\n\t\t.then(analyze.addFullSalary);\n}\n\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/dataGetter.js\n ** module id = 8\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/dataGetter.js?");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	eval("var __WEBPACK_AMD_DEFINE_RESULT__;/*!\n * Sheetrock v1.0.1\n * Quickly connect to, query, and lazy-load data from Google Sheets.\n * http://chriszarate.github.io/sheetrock/\n * License: MIT\n */\n(function(e,r){\"use strict\";var t=r();if(true){!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){t.environment.amd=true;return t}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))}else if(typeof module===\"object\"&&module.exports){t.environment.commonjs=true;t.environment.request=require(\"request\");module.exports=t}else{e.sheetrock=t}})(this,function(){\"use strict\";var e={2014:{apiEndpoint:\"https://docs.google.com/spreadsheets/d/%key%/gviz/tq?\",keyFormat:new RegExp(\"spreadsheets/d/([^/#]+)\",\"i\"),gidFormat:new RegExp(\"gid=([^/&#]+)\",\"i\")},2010:{apiEndpoint:\"https://spreadsheets.google.com/tq?key=%key%&\",keyFormat:new RegExp(\"key=([^&#]+)\",\"i\"),gidFormat:new RegExp(\"gid=([^/&#]+)\",\"i\")}};var r={loaded:{},failed:{},labels:{},header:{},offset:{}};var t=0;var a=typeof window===\"undefined\"?{}:window;var n={document:a.document||{},dom:!!(a.document&&a.document.createElement),jquery:!!(a.jQuery&&a.jQuery.fn&&a.jQuery.fn.jquery),request:false};if(!Array.prototype.forEach){Array.prototype.forEach=function(e){var r;var t=this;var a=t.length;for(r=0;r<a;r=r+1){e(t[r],r)}}}if(!Array.prototype.map){Array.prototype.map=function(e){var r=this;var t=[];r.forEach(function(r,a){t[a]=e(r,a)});return t}}if(!Object.keys){Object.keys=function(e){var r;var t=[];for(r in e){if(e.hasOwnProperty(r)){t.push(r)}}return t}}var o=function(e,t,a){if(!(e instanceof Error)){e=new Error(e)}if(t&&t.request&&t.request.index){r.failed[t.request.index]=true}if(t&&t.user&&t.user.callback){t.user.callback(e,t,a||null)}else{throw e}};var i=function(e){return e.toString().replace(/^ +/,\"\").replace(/ +$/,\"\")};var u=function(e){return Math.max(0,parseInt(e,10)||0)};var s=function(e,r){var t=\" \"+e.className+\" \";return t.indexOf(\" \"+r+\" \")!==-1};var f=function(e){e=e||{};if(e.jquery&&e.length){e=e[0]}return e.nodeType&&e.nodeType===1?e:false};var l=function(){n.dom=!!(n.document&&n.document.createElement)};var c=function(r){var t={};var a=Object.keys(e);a.forEach(function(a){var n=e[a];if(n.keyFormat.test(r)&&n.gidFormat.test(r)){t.key=r.match(n.keyFormat)[1];t.gid=r.match(n.gidFormat)[1];t.apiEndpoint=n.apiEndpoint.replace(\"%key%\",t.key)}});return t};var d=function(e){return e.key&&e.gid?e.key+\"_\"+e.gid+\"_\"+e.query:null};var v=function(e){var r;if(e&&e.f){r=e.f}else if(e&&e.v){r=e.v}else{r=\"\"}if(r instanceof Array){r=e.f||r.join(\"\")}return i(r)};var m=function(e,r,t){var a={cells:{},cellsArray:r,labels:t,num:e};r.forEach(function(e,r){a.cells[t[r]]=e});return a};var h=function(e,r){return\"<\"+r+\">\"+e+\"</\"+r+\">\"};var p=function(e){var r=e.num?\"td\":\"th\";var t=Object.keys(e.cells);var a=\"\";t.forEach(function(t){a+=h(e.cells[t],r)});return h(a,\"tr\")};var y=function(e){r.loaded[e]=false;r.failed[e]=false;r.labels[e]=false;r.header[e]=0;r.offset[e]=0};var b=function(e,r){var t={};var a=Object.keys(e);r.query=r.sql||r.query;r.reset=r.resetStatus||r.reset;r.fetchSize=r.chunkSize||r.fetchSize;r.rowTemplate=r.rowHandler||r.rowTemplate;a.forEach(function(a){t[a]=r[a]||e[a]});return t};var g=function(e,r){r.target=f(r.target)||f(e);r.fetchSize=u(r.fetchSize);return r};var q=function(e,t){var a=g(e,t);var n=c(a.url);n.query=a.query;n.index=d(n);if(a.reset&&n.index){y(n.index);n.reset=true}a.offset=r.offset[n.index]||0;if(a.fetchSize&&n.index){n.query+=\" limit \"+(a.fetchSize+1);n.query+=\" offset \"+a.offset;r.offset[n.index]=a.offset+a.fetchSize}return{user:a,request:n}};var k=function(e){if(!e.user.target&&!e.user.callback){throw\"No element targeted or callback provided.\"}if(!(e.request.key&&e.request.gid)){throw\"No key/gid in the provided URL.\"}if(r.failed[e.request.index]){throw\"A previous request for this resource failed.\"}if(r.loaded[e.request.index]){throw\"No more rows to load!\"}return e};var w=function(e,r){return e&&e.length===r.length?e:r};var E=function(e,t){var a=e.request.index;var n=r.labels[a];var o=e.user.fetchSize;var i=t.table.rows;var u=t.table.cols;var s={last:i.length-1,rowNumberOffset:r.header[a]||0};if(!e.user.offset){n=u.map(function(e,r){if(e.label){return e.label.replace(/\\s/g,\"\")}else{s.last=s.last+1;s.rowNumberOffset=1;return v(i[0].c[r]).replace(/\\s/g,\"\")||e.id}});r.offset[a]=r.offset[a]+s.rowNumberOffset;r.header[a]=s.rowNumberOffset;r.labels[a]=n}if(!o||i.length-s.rowNumberOffset<o){s.last=s.last+1;r.loaded[a]=true}s.labels=w(e.user.labels,n);return s};var x=function(e,r,t){var a=[];var n=r.labels;if(!e.offset&&!r.rowNumberOffset){a.push(m(0,n,n))}t.table.rows.forEach(function(t,o){if(t.c&&o<r.last){var i=u(e.offset+o+1-r.rowNumberOffset);a.push(m(i,t.c.map(v),n))}});return a};var j=function(e,r,t){if(e.tagName===\"TABLE\"){var a=n.document.createElement(\"thead\");var o=n.document.createElement(\"tbody\");a.innerHTML=r;o.innerHTML=t;e.appendChild(a);e.appendChild(o)}else{e.insertAdjacentHTML(\"beforeEnd\",r+t)}};var N=function(e,r){var t=e.rowTemplate||p;var a=n.dom&&e.target;var o=a&&e.target.tagName===\"TABLE\";var i=a&&s(e.target,\"sheetrock-header\");var u=\"\";var f=\"\";r.forEach(function(e){if(e.num){f+=t(e)}else if(o||i){u+=t(e)}});if(a){j(e.target,u,f)}return o?h(u,\"thead\")+h(f,\"tbody\"):u+f};var O=function(e,r){var t={raw:r};try{var a=t.attributes=E(e,r);var n=t.rows=x(e.user,a,r);t.html=N(e.user,n)}catch(i){o(\"Unexpected API response format.\",e,t);return}if(e.user.callback){e.user.callback(null,e,t)}};var S=function(e,r){if(typeof n.request!==\"function\"){throw\"No HTTP transport available.\"}var t={headers:{\"X-DataSource-Auth\":\"true\"},url:e.request.url};var a=function(t,a,n){if(!t&&a.statusCode===200){try{n=JSON.parse(n.replace(/^\\)\\]\\}\\'\\n/,\"\"));r(e,n)}catch(i){o(i,e,{raw:n})}}else{o(t||\"Request failed.\",e)}};n.request(t,a)};var T=function(e,r){var i;var u;var s;var f=n.document.getElementsByTagName(\"head\")[0];var l=n.document.createElement(\"script\");var c=\"_sheetrock_callback_\"+t;i=function(){if(l.removeEventListener){l.removeEventListener(\"error\",s,false);l.removeEventListener(\"abort\",s,false)}f.removeChild(l);delete a[c]};u=function(t){try{r(e,t)}catch(a){o(a,e,{raw:t})}finally{i()}};s=function(){o(\"Request failed.\",e);i()};a[c]=u;e.request.url=e.request.url.replace(\"%callback%\",c);if(l.addEventListener){l.addEventListener(\"error\",s,false);l.addEventListener(\"abort\",s,false)}l.type=\"text/javascript\";l.src=e.request.url;f.appendChild(l);t=t+1};var A=function(e){var r=[\"gid=\"+encodeURIComponent(e.request.gid),\"tq=\"+encodeURIComponent(e.request.query)];if(n.dom){r.push(\"tqx=responseHandler:%callback%\")}return e.request.apiEndpoint+r.join(\"&\")};var L=function(e,r){e.request.url=A(e);if(n.dom){T(e,r)}else{S(e,r)}};var z={url:\"\",query:\"\",target:null,fetchSize:0,labels:[],rowTemplate:null,callback:null,reset:false};var R=function(e,r){try{e=b(z,e||{});e=q(this,e);e=k(e);l();if(r){O(e,r)}else{L(e,O)}}catch(t){o(t,e)}return this};R.defaults=z;R.version=\"1.0.1\";R.environment=n;if(n.jquery){a.jQuery.fn.sheetrock=R}return R});\n//# sourceMappingURL=sheetrock.min.js.map\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/sheetrock/dist/sheetrock.min.js\n ** module id = 9\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/sheetrock/dist/sheetrock.min.js?");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	eval("var require;var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, global, module) {/*!\n * @overview es6-promise - a tiny implementation of Promises/A+.\n * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)\n * @license   Licensed under MIT license\n *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE\n * @version   3.1.2\n */\n\n(function() {\n    \"use strict\";\n    function lib$es6$promise$utils$$objectOrFunction(x) {\n      return typeof x === 'function' || (typeof x === 'object' && x !== null);\n    }\n\n    function lib$es6$promise$utils$$isFunction(x) {\n      return typeof x === 'function';\n    }\n\n    function lib$es6$promise$utils$$isMaybeThenable(x) {\n      return typeof x === 'object' && x !== null;\n    }\n\n    var lib$es6$promise$utils$$_isArray;\n    if (!Array.isArray) {\n      lib$es6$promise$utils$$_isArray = function (x) {\n        return Object.prototype.toString.call(x) === '[object Array]';\n      };\n    } else {\n      lib$es6$promise$utils$$_isArray = Array.isArray;\n    }\n\n    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;\n    var lib$es6$promise$asap$$len = 0;\n    var lib$es6$promise$asap$$vertxNext;\n    var lib$es6$promise$asap$$customSchedulerFn;\n\n    var lib$es6$promise$asap$$asap = function asap(callback, arg) {\n      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;\n      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;\n      lib$es6$promise$asap$$len += 2;\n      if (lib$es6$promise$asap$$len === 2) {\n        // If len is 2, that means that we need to schedule an async flush.\n        // If additional callbacks are queued before the queue is flushed, they\n        // will be processed by this flush that we are scheduling.\n        if (lib$es6$promise$asap$$customSchedulerFn) {\n          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);\n        } else {\n          lib$es6$promise$asap$$scheduleFlush();\n        }\n      }\n    }\n\n    function lib$es6$promise$asap$$setScheduler(scheduleFn) {\n      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;\n    }\n\n    function lib$es6$promise$asap$$setAsap(asapFn) {\n      lib$es6$promise$asap$$asap = asapFn;\n    }\n\n    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;\n    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};\n    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;\n    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';\n\n    // test for web worker but not in IE10\n    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&\n      typeof importScripts !== 'undefined' &&\n      typeof MessageChannel !== 'undefined';\n\n    // node\n    function lib$es6$promise$asap$$useNextTick() {\n      // node version 0.10.x displays a deprecation warning when nextTick is used recursively\n      // see https://github.com/cujojs/when/issues/410 for details\n      return function() {\n        process.nextTick(lib$es6$promise$asap$$flush);\n      };\n    }\n\n    // vertx\n    function lib$es6$promise$asap$$useVertxTimer() {\n      return function() {\n        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);\n      };\n    }\n\n    function lib$es6$promise$asap$$useMutationObserver() {\n      var iterations = 0;\n      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);\n      var node = document.createTextNode('');\n      observer.observe(node, { characterData: true });\n\n      return function() {\n        node.data = (iterations = ++iterations % 2);\n      };\n    }\n\n    // web worker\n    function lib$es6$promise$asap$$useMessageChannel() {\n      var channel = new MessageChannel();\n      channel.port1.onmessage = lib$es6$promise$asap$$flush;\n      return function () {\n        channel.port2.postMessage(0);\n      };\n    }\n\n    function lib$es6$promise$asap$$useSetTimeout() {\n      return function() {\n        setTimeout(lib$es6$promise$asap$$flush, 1);\n      };\n    }\n\n    var lib$es6$promise$asap$$queue = new Array(1000);\n    function lib$es6$promise$asap$$flush() {\n      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {\n        var callback = lib$es6$promise$asap$$queue[i];\n        var arg = lib$es6$promise$asap$$queue[i+1];\n\n        callback(arg);\n\n        lib$es6$promise$asap$$queue[i] = undefined;\n        lib$es6$promise$asap$$queue[i+1] = undefined;\n      }\n\n      lib$es6$promise$asap$$len = 0;\n    }\n\n    function lib$es6$promise$asap$$attemptVertx() {\n      try {\n        var r = require;\n        var vertx = __webpack_require__(13);\n        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;\n        return lib$es6$promise$asap$$useVertxTimer();\n      } catch(e) {\n        return lib$es6$promise$asap$$useSetTimeout();\n      }\n    }\n\n    var lib$es6$promise$asap$$scheduleFlush;\n    // Decide what async method to use to triggering processing of queued callbacks:\n    if (lib$es6$promise$asap$$isNode) {\n      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();\n    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {\n      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();\n    } else if (lib$es6$promise$asap$$isWorker) {\n      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();\n    } else if (lib$es6$promise$asap$$browserWindow === undefined && \"function\" === 'function') {\n      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();\n    } else {\n      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();\n    }\n    function lib$es6$promise$then$$then(onFulfillment, onRejection) {\n      var parent = this;\n      var state = parent._state;\n\n      if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {\n        return this;\n      }\n\n      var child = new this.constructor(lib$es6$promise$$internal$$noop);\n      var result = parent._result;\n\n      if (state) {\n        var callback = arguments[state - 1];\n        lib$es6$promise$asap$$asap(function(){\n          lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);\n        });\n      } else {\n        lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);\n      }\n\n      return child;\n    }\n    var lib$es6$promise$then$$default = lib$es6$promise$then$$then;\n    function lib$es6$promise$promise$resolve$$resolve(object) {\n      /*jshint validthis:true */\n      var Constructor = this;\n\n      if (object && typeof object === 'object' && object.constructor === Constructor) {\n        return object;\n      }\n\n      var promise = new Constructor(lib$es6$promise$$internal$$noop);\n      lib$es6$promise$$internal$$resolve(promise, object);\n      return promise;\n    }\n    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;\n\n    function lib$es6$promise$$internal$$noop() {}\n\n    var lib$es6$promise$$internal$$PENDING   = void 0;\n    var lib$es6$promise$$internal$$FULFILLED = 1;\n    var lib$es6$promise$$internal$$REJECTED  = 2;\n\n    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();\n\n    function lib$es6$promise$$internal$$selfFulfillment() {\n      return new TypeError(\"You cannot resolve a promise with itself\");\n    }\n\n    function lib$es6$promise$$internal$$cannotReturnOwn() {\n      return new TypeError('A promises callback cannot return that same promise.');\n    }\n\n    function lib$es6$promise$$internal$$getThen(promise) {\n      try {\n        return promise.then;\n      } catch(error) {\n        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;\n        return lib$es6$promise$$internal$$GET_THEN_ERROR;\n      }\n    }\n\n    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {\n      try {\n        then.call(value, fulfillmentHandler, rejectionHandler);\n      } catch(e) {\n        return e;\n      }\n    }\n\n    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {\n       lib$es6$promise$asap$$asap(function(promise) {\n        var sealed = false;\n        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {\n          if (sealed) { return; }\n          sealed = true;\n          if (thenable !== value) {\n            lib$es6$promise$$internal$$resolve(promise, value);\n          } else {\n            lib$es6$promise$$internal$$fulfill(promise, value);\n          }\n        }, function(reason) {\n          if (sealed) { return; }\n          sealed = true;\n\n          lib$es6$promise$$internal$$reject(promise, reason);\n        }, 'Settle: ' + (promise._label || ' unknown promise'));\n\n        if (!sealed && error) {\n          sealed = true;\n          lib$es6$promise$$internal$$reject(promise, error);\n        }\n      }, promise);\n    }\n\n    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {\n      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {\n        lib$es6$promise$$internal$$fulfill(promise, thenable._result);\n      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {\n        lib$es6$promise$$internal$$reject(promise, thenable._result);\n      } else {\n        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {\n          lib$es6$promise$$internal$$resolve(promise, value);\n        }, function(reason) {\n          lib$es6$promise$$internal$$reject(promise, reason);\n        });\n      }\n    }\n\n    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable, then) {\n      if (maybeThenable.constructor === promise.constructor &&\n          then === lib$es6$promise$then$$default &&\n          constructor.resolve === lib$es6$promise$promise$resolve$$default) {\n        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);\n      } else {\n        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {\n          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);\n        } else if (then === undefined) {\n          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);\n        } else if (lib$es6$promise$utils$$isFunction(then)) {\n          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);\n        } else {\n          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);\n        }\n      }\n    }\n\n    function lib$es6$promise$$internal$$resolve(promise, value) {\n      if (promise === value) {\n        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());\n      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {\n        lib$es6$promise$$internal$$handleMaybeThenable(promise, value, lib$es6$promise$$internal$$getThen(value));\n      } else {\n        lib$es6$promise$$internal$$fulfill(promise, value);\n      }\n    }\n\n    function lib$es6$promise$$internal$$publishRejection(promise) {\n      if (promise._onerror) {\n        promise._onerror(promise._result);\n      }\n\n      lib$es6$promise$$internal$$publish(promise);\n    }\n\n    function lib$es6$promise$$internal$$fulfill(promise, value) {\n      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }\n\n      promise._result = value;\n      promise._state = lib$es6$promise$$internal$$FULFILLED;\n\n      if (promise._subscribers.length !== 0) {\n        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);\n      }\n    }\n\n    function lib$es6$promise$$internal$$reject(promise, reason) {\n      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }\n      promise._state = lib$es6$promise$$internal$$REJECTED;\n      promise._result = reason;\n\n      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);\n    }\n\n    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {\n      var subscribers = parent._subscribers;\n      var length = subscribers.length;\n\n      parent._onerror = null;\n\n      subscribers[length] = child;\n      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;\n      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;\n\n      if (length === 0 && parent._state) {\n        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);\n      }\n    }\n\n    function lib$es6$promise$$internal$$publish(promise) {\n      var subscribers = promise._subscribers;\n      var settled = promise._state;\n\n      if (subscribers.length === 0) { return; }\n\n      var child, callback, detail = promise._result;\n\n      for (var i = 0; i < subscribers.length; i += 3) {\n        child = subscribers[i];\n        callback = subscribers[i + settled];\n\n        if (child) {\n          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);\n        } else {\n          callback(detail);\n        }\n      }\n\n      promise._subscribers.length = 0;\n    }\n\n    function lib$es6$promise$$internal$$ErrorObject() {\n      this.error = null;\n    }\n\n    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();\n\n    function lib$es6$promise$$internal$$tryCatch(callback, detail) {\n      try {\n        return callback(detail);\n      } catch(e) {\n        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;\n        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;\n      }\n    }\n\n    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {\n      var hasCallback = lib$es6$promise$utils$$isFunction(callback),\n          value, error, succeeded, failed;\n\n      if (hasCallback) {\n        value = lib$es6$promise$$internal$$tryCatch(callback, detail);\n\n        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {\n          failed = true;\n          error = value.error;\n          value = null;\n        } else {\n          succeeded = true;\n        }\n\n        if (promise === value) {\n          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());\n          return;\n        }\n\n      } else {\n        value = detail;\n        succeeded = true;\n      }\n\n      if (promise._state !== lib$es6$promise$$internal$$PENDING) {\n        // noop\n      } else if (hasCallback && succeeded) {\n        lib$es6$promise$$internal$$resolve(promise, value);\n      } else if (failed) {\n        lib$es6$promise$$internal$$reject(promise, error);\n      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {\n        lib$es6$promise$$internal$$fulfill(promise, value);\n      } else if (settled === lib$es6$promise$$internal$$REJECTED) {\n        lib$es6$promise$$internal$$reject(promise, value);\n      }\n    }\n\n    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {\n      try {\n        resolver(function resolvePromise(value){\n          lib$es6$promise$$internal$$resolve(promise, value);\n        }, function rejectPromise(reason) {\n          lib$es6$promise$$internal$$reject(promise, reason);\n        });\n      } catch(e) {\n        lib$es6$promise$$internal$$reject(promise, e);\n      }\n    }\n\n    function lib$es6$promise$promise$all$$all(entries) {\n      return new lib$es6$promise$enumerator$$default(this, entries).promise;\n    }\n    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;\n    function lib$es6$promise$promise$race$$race(entries) {\n      /*jshint validthis:true */\n      var Constructor = this;\n\n      var promise = new Constructor(lib$es6$promise$$internal$$noop);\n\n      if (!lib$es6$promise$utils$$isArray(entries)) {\n        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));\n        return promise;\n      }\n\n      var length = entries.length;\n\n      function onFulfillment(value) {\n        lib$es6$promise$$internal$$resolve(promise, value);\n      }\n\n      function onRejection(reason) {\n        lib$es6$promise$$internal$$reject(promise, reason);\n      }\n\n      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {\n        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);\n      }\n\n      return promise;\n    }\n    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;\n    function lib$es6$promise$promise$reject$$reject(reason) {\n      /*jshint validthis:true */\n      var Constructor = this;\n      var promise = new Constructor(lib$es6$promise$$internal$$noop);\n      lib$es6$promise$$internal$$reject(promise, reason);\n      return promise;\n    }\n    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;\n\n    var lib$es6$promise$promise$$counter = 0;\n\n    function lib$es6$promise$promise$$needsResolver() {\n      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');\n    }\n\n    function lib$es6$promise$promise$$needsNew() {\n      throw new TypeError(\"Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.\");\n    }\n\n    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;\n    /**\n      Promise objects represent the eventual result of an asynchronous operation. The\n      primary way of interacting with a promise is through its `then` method, which\n      registers callbacks to receive either a promise's eventual value or the reason\n      why the promise cannot be fulfilled.\n\n      Terminology\n      -----------\n\n      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.\n      - `thenable` is an object or function that defines a `then` method.\n      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).\n      - `exception` is a value that is thrown using the throw statement.\n      - `reason` is a value that indicates why a promise was rejected.\n      - `settled` the final resting state of a promise, fulfilled or rejected.\n\n      A promise can be in one of three states: pending, fulfilled, or rejected.\n\n      Promises that are fulfilled have a fulfillment value and are in the fulfilled\n      state.  Promises that are rejected have a rejection reason and are in the\n      rejected state.  A fulfillment value is never a thenable.\n\n      Promises can also be said to *resolve* a value.  If this value is also a\n      promise, then the original promise's settled state will match the value's\n      settled state.  So a promise that *resolves* a promise that rejects will\n      itself reject, and a promise that *resolves* a promise that fulfills will\n      itself fulfill.\n\n\n      Basic Usage:\n      ------------\n\n      ```js\n      var promise = new Promise(function(resolve, reject) {\n        // on success\n        resolve(value);\n\n        // on failure\n        reject(reason);\n      });\n\n      promise.then(function(value) {\n        // on fulfillment\n      }, function(reason) {\n        // on rejection\n      });\n      ```\n\n      Advanced Usage:\n      ---------------\n\n      Promises shine when abstracting away asynchronous interactions such as\n      `XMLHttpRequest`s.\n\n      ```js\n      function getJSON(url) {\n        return new Promise(function(resolve, reject){\n          var xhr = new XMLHttpRequest();\n\n          xhr.open('GET', url);\n          xhr.onreadystatechange = handler;\n          xhr.responseType = 'json';\n          xhr.setRequestHeader('Accept', 'application/json');\n          xhr.send();\n\n          function handler() {\n            if (this.readyState === this.DONE) {\n              if (this.status === 200) {\n                resolve(this.response);\n              } else {\n                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));\n              }\n            }\n          };\n        });\n      }\n\n      getJSON('/posts.json').then(function(json) {\n        // on fulfillment\n      }, function(reason) {\n        // on rejection\n      });\n      ```\n\n      Unlike callbacks, promises are great composable primitives.\n\n      ```js\n      Promise.all([\n        getJSON('/posts'),\n        getJSON('/comments')\n      ]).then(function(values){\n        values[0] // => postsJSON\n        values[1] // => commentsJSON\n\n        return values;\n      });\n      ```\n\n      @class Promise\n      @param {function} resolver\n      Useful for tooling.\n      @constructor\n    */\n    function lib$es6$promise$promise$$Promise(resolver) {\n      this._id = lib$es6$promise$promise$$counter++;\n      this._state = undefined;\n      this._result = undefined;\n      this._subscribers = [];\n\n      if (lib$es6$promise$$internal$$noop !== resolver) {\n        typeof resolver !== 'function' && lib$es6$promise$promise$$needsResolver();\n        this instanceof lib$es6$promise$promise$$Promise ? lib$es6$promise$$internal$$initializePromise(this, resolver) : lib$es6$promise$promise$$needsNew();\n      }\n    }\n\n    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;\n    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;\n    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;\n    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;\n    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;\n    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;\n    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;\n\n    lib$es6$promise$promise$$Promise.prototype = {\n      constructor: lib$es6$promise$promise$$Promise,\n\n    /**\n      The primary way of interacting with a promise is through its `then` method,\n      which registers callbacks to receive either a promise's eventual value or the\n      reason why the promise cannot be fulfilled.\n\n      ```js\n      findUser().then(function(user){\n        // user is available\n      }, function(reason){\n        // user is unavailable, and you are given the reason why\n      });\n      ```\n\n      Chaining\n      --------\n\n      The return value of `then` is itself a promise.  This second, 'downstream'\n      promise is resolved with the return value of the first promise's fulfillment\n      or rejection handler, or rejected if the handler throws an exception.\n\n      ```js\n      findUser().then(function (user) {\n        return user.name;\n      }, function (reason) {\n        return 'default name';\n      }).then(function (userName) {\n        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it\n        // will be `'default name'`\n      });\n\n      findUser().then(function (user) {\n        throw new Error('Found user, but still unhappy');\n      }, function (reason) {\n        throw new Error('`findUser` rejected and we're unhappy');\n      }).then(function (value) {\n        // never reached\n      }, function (reason) {\n        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.\n        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.\n      });\n      ```\n      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.\n\n      ```js\n      findUser().then(function (user) {\n        throw new PedagogicalException('Upstream error');\n      }).then(function (value) {\n        // never reached\n      }).then(function (value) {\n        // never reached\n      }, function (reason) {\n        // The `PedgagocialException` is propagated all the way down to here\n      });\n      ```\n\n      Assimilation\n      ------------\n\n      Sometimes the value you want to propagate to a downstream promise can only be\n      retrieved asynchronously. This can be achieved by returning a promise in the\n      fulfillment or rejection handler. The downstream promise will then be pending\n      until the returned promise is settled. This is called *assimilation*.\n\n      ```js\n      findUser().then(function (user) {\n        return findCommentsByAuthor(user);\n      }).then(function (comments) {\n        // The user's comments are now available\n      });\n      ```\n\n      If the assimliated promise rejects, then the downstream promise will also reject.\n\n      ```js\n      findUser().then(function (user) {\n        return findCommentsByAuthor(user);\n      }).then(function (comments) {\n        // If `findCommentsByAuthor` fulfills, we'll have the value here\n      }, function (reason) {\n        // If `findCommentsByAuthor` rejects, we'll have the reason here\n      });\n      ```\n\n      Simple Example\n      --------------\n\n      Synchronous Example\n\n      ```javascript\n      var result;\n\n      try {\n        result = findResult();\n        // success\n      } catch(reason) {\n        // failure\n      }\n      ```\n\n      Errback Example\n\n      ```js\n      findResult(function(result, err){\n        if (err) {\n          // failure\n        } else {\n          // success\n        }\n      });\n      ```\n\n      Promise Example;\n\n      ```javascript\n      findResult().then(function(result){\n        // success\n      }, function(reason){\n        // failure\n      });\n      ```\n\n      Advanced Example\n      --------------\n\n      Synchronous Example\n\n      ```javascript\n      var author, books;\n\n      try {\n        author = findAuthor();\n        books  = findBooksByAuthor(author);\n        // success\n      } catch(reason) {\n        // failure\n      }\n      ```\n\n      Errback Example\n\n      ```js\n\n      function foundBooks(books) {\n\n      }\n\n      function failure(reason) {\n\n      }\n\n      findAuthor(function(author, err){\n        if (err) {\n          failure(err);\n          // failure\n        } else {\n          try {\n            findBoooksByAuthor(author, function(books, err) {\n              if (err) {\n                failure(err);\n              } else {\n                try {\n                  foundBooks(books);\n                } catch(reason) {\n                  failure(reason);\n                }\n              }\n            });\n          } catch(error) {\n            failure(err);\n          }\n          // success\n        }\n      });\n      ```\n\n      Promise Example;\n\n      ```javascript\n      findAuthor().\n        then(findBooksByAuthor).\n        then(function(books){\n          // found books\n      }).catch(function(reason){\n        // something went wrong\n      });\n      ```\n\n      @method then\n      @param {Function} onFulfilled\n      @param {Function} onRejected\n      Useful for tooling.\n      @return {Promise}\n    */\n      then: lib$es6$promise$then$$default,\n\n    /**\n      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same\n      as the catch block of a try/catch statement.\n\n      ```js\n      function findAuthor(){\n        throw new Error('couldn't find that author');\n      }\n\n      // synchronous\n      try {\n        findAuthor();\n      } catch(reason) {\n        // something went wrong\n      }\n\n      // async with promises\n      findAuthor().catch(function(reason){\n        // something went wrong\n      });\n      ```\n\n      @method catch\n      @param {Function} onRejection\n      Useful for tooling.\n      @return {Promise}\n    */\n      'catch': function(onRejection) {\n        return this.then(null, onRejection);\n      }\n    };\n    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;\n    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {\n      this._instanceConstructor = Constructor;\n      this.promise = new Constructor(lib$es6$promise$$internal$$noop);\n\n      if (Array.isArray(input)) {\n        this._input     = input;\n        this.length     = input.length;\n        this._remaining = input.length;\n\n        this._result = new Array(this.length);\n\n        if (this.length === 0) {\n          lib$es6$promise$$internal$$fulfill(this.promise, this._result);\n        } else {\n          this.length = this.length || 0;\n          this._enumerate();\n          if (this._remaining === 0) {\n            lib$es6$promise$$internal$$fulfill(this.promise, this._result);\n          }\n        }\n      } else {\n        lib$es6$promise$$internal$$reject(this.promise, this._validationError());\n      }\n    }\n\n    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {\n      return new Error('Array Methods must be provided an Array');\n    };\n\n    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {\n      var length  = this.length;\n      var input   = this._input;\n\n      for (var i = 0; this._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {\n        this._eachEntry(input[i], i);\n      }\n    };\n\n    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {\n      var c = this._instanceConstructor;\n      var resolve = c.resolve;\n\n      if (resolve === lib$es6$promise$promise$resolve$$default) {\n        var then = lib$es6$promise$$internal$$getThen(entry);\n\n        if (then === lib$es6$promise$then$$default &&\n            entry._state !== lib$es6$promise$$internal$$PENDING) {\n          this._settledAt(entry._state, i, entry._result);\n        } else if (typeof then !== 'function') {\n          this._remaining--;\n          this._result[i] = entry;\n        } else if (c === lib$es6$promise$promise$$default) {\n          var promise = new c(lib$es6$promise$$internal$$noop);\n          lib$es6$promise$$internal$$handleMaybeThenable(promise, entry, then);\n          this._willSettleAt(promise, i);\n        } else {\n          this._willSettleAt(new c(function(resolve) { resolve(entry); }), i);\n        }\n      } else {\n        this._willSettleAt(resolve(entry), i);\n      }\n    };\n\n    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {\n      var promise = this.promise;\n\n      if (promise._state === lib$es6$promise$$internal$$PENDING) {\n        this._remaining--;\n\n        if (state === lib$es6$promise$$internal$$REJECTED) {\n          lib$es6$promise$$internal$$reject(promise, value);\n        } else {\n          this._result[i] = value;\n        }\n      }\n\n      if (this._remaining === 0) {\n        lib$es6$promise$$internal$$fulfill(promise, this._result);\n      }\n    };\n\n    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {\n      var enumerator = this;\n\n      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {\n        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);\n      }, function(reason) {\n        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);\n      });\n    };\n    function lib$es6$promise$polyfill$$polyfill() {\n      var local;\n\n      if (typeof global !== 'undefined') {\n          local = global;\n      } else if (typeof self !== 'undefined') {\n          local = self;\n      } else {\n          try {\n              local = Function('return this')();\n          } catch (e) {\n              throw new Error('polyfill failed because global object is unavailable in this environment');\n          }\n      }\n\n      var P = local.Promise;\n\n      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {\n        return;\n      }\n\n      local.Promise = lib$es6$promise$promise$$default;\n    }\n    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;\n\n    var lib$es6$promise$umd$$ES6Promise = {\n      'Promise': lib$es6$promise$promise$$default,\n      'polyfill': lib$es6$promise$polyfill$$default\n    };\n\n    /* global define:true module:true window: true */\n    if (\"function\" === 'function' && __webpack_require__(14)['amd']) {\n      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return lib$es6$promise$umd$$ES6Promise; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    } else if (typeof module !== 'undefined' && module['exports']) {\n      module['exports'] = lib$es6$promise$umd$$ES6Promise;\n    } else if (typeof this !== 'undefined') {\n      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;\n    }\n\n    lib$es6$promise$polyfill$$default();\n}).call(this);\n\n\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), (function() { return this; }()), __webpack_require__(12)(module)))\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/es6-promise/dist/es6-promise.js\n ** module id = 10\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/es6-promise/dist/es6-promise.js?");

/***/ },
/* 11 */
/***/ function(module, exports) {

	eval("// shim for using process in browser\n\nvar process = module.exports = {};\nvar queue = [];\nvar draining = false;\nvar currentQueue;\nvar queueIndex = -1;\n\nfunction cleanUpNextTick() {\n    draining = false;\n    if (currentQueue.length) {\n        queue = currentQueue.concat(queue);\n    } else {\n        queueIndex = -1;\n    }\n    if (queue.length) {\n        drainQueue();\n    }\n}\n\nfunction drainQueue() {\n    if (draining) {\n        return;\n    }\n    var timeout = setTimeout(cleanUpNextTick);\n    draining = true;\n\n    var len = queue.length;\n    while(len) {\n        currentQueue = queue;\n        queue = [];\n        while (++queueIndex < len) {\n            if (currentQueue) {\n                currentQueue[queueIndex].run();\n            }\n        }\n        queueIndex = -1;\n        len = queue.length;\n    }\n    currentQueue = null;\n    draining = false;\n    clearTimeout(timeout);\n}\n\nprocess.nextTick = function (fun) {\n    var args = new Array(arguments.length - 1);\n    if (arguments.length > 1) {\n        for (var i = 1; i < arguments.length; i++) {\n            args[i - 1] = arguments[i];\n        }\n    }\n    queue.push(new Item(fun, args));\n    if (queue.length === 1 && !draining) {\n        setTimeout(drainQueue, 0);\n    }\n};\n\n// v8 likes predictible objects\nfunction Item(fun, array) {\n    this.fun = fun;\n    this.array = array;\n}\nItem.prototype.run = function () {\n    this.fun.apply(null, this.array);\n};\nprocess.title = 'browser';\nprocess.browser = true;\nprocess.env = {};\nprocess.argv = [];\nprocess.version = ''; // empty string to avoid regexp issues\nprocess.versions = {};\n\nfunction noop() {}\n\nprocess.on = noop;\nprocess.addListener = noop;\nprocess.once = noop;\nprocess.off = noop;\nprocess.removeListener = noop;\nprocess.removeAllListeners = noop;\nprocess.emit = noop;\n\nprocess.binding = function (name) {\n    throw new Error('process.binding is not supported');\n};\n\nprocess.cwd = function () { return '/' };\nprocess.chdir = function (dir) {\n    throw new Error('process.chdir is not supported');\n};\nprocess.umask = function() { return 0; };\n\n\n/*****************\n ** WEBPACK FOOTER\n ** (webpack)/~/node-libs-browser/~/process/browser.js\n ** module id = 11\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///(webpack)/~/node-libs-browser/~/process/browser.js?");

/***/ },
/* 12 */
/***/ function(module, exports) {

	eval("module.exports = function(module) {\r\n\tif(!module.webpackPolyfill) {\r\n\t\tmodule.deprecate = function() {};\r\n\t\tmodule.paths = [];\r\n\t\t// module.parent = undefined by default\r\n\t\tmodule.children = [];\r\n\t\tmodule.webpackPolyfill = 1;\r\n\t}\r\n\treturn module;\r\n}\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** (webpack)/buildin/module.js\n ** module id = 12\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///(webpack)/buildin/module.js?");

/***/ },
/* 13 */
/***/ function(module, exports) {

	eval("/* (ignored) */\n\n/*****************\n ** WEBPACK FOOTER\n ** vertx (ignored)\n ** module id = 13\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///vertx_(ignored)?");

/***/ },
/* 14 */
/***/ function(module, exports) {

	eval("module.exports = function() { throw new Error(\"define cannot be used indirect\"); };\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** (webpack)/buildin/amd-define.js\n ** module id = 14\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///(webpack)/buildin/amd-define.js?");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	eval("var objectAssign = __webpack_require__(16);\nvar fakeList = __webpack_require__(17).fake;\nvar multiplyList = __webpack_require__(17).multiplyOnThousand;\nvar itJobsKeywords = __webpack_require__(18);\nvar DOLLAR_COST = 70;\nmodule.exports = {\n\taddFullSalary: countFullSalary,\n\tgetAllStats: prepareAllStats,\n\tisFake: isFake,\n\tneedToMultiply: needToMultiply,\n\tgetIT: getIT,\n\tgetAllInRoubles: getAllInRoubles\n};\n\nfunction countAverageYearSalary(item) {\n\tvar newItem = objectAssign({}, item);\n\tnewItem.fullSalary = item.salary * 12 + item.monthlyBonus * 12 + item.yearlyBonus;\n\tnewItem.averageSalary = newItem.fullSalary / 12;\n\treturn newItem;\n}\nfunction isFake(timestamp) {\n\treturn fakeList.some(function(fakeTimestamp) {\n\t\treturn fakeTimestamp === timestamp;\n\t});\n}\nfunction needToMultiply(timestamp) {\n\treturn multiplyList.some(function(multiplyTimestamp) {\n\t\treturn multiplyTimestamp === timestamp;\n\t});\n}\nfunction getCities(data) {\n\tvar spbAlias = ['санкт-петербург', 'питер', 'спб'];\n\tvar mskAlias = ['москва', 'moscow', 'мск'];\n\n\tvar cityChecker = function(cityAliasArray, city) {\n\t\treturn cityAliasArray.some(function(cityAlias) {\n\t\t\treturn cityAlias === city\n\t\t})\n\t};\n\tvar saintP = [];\n\tvar moscow = [];\n\tvar allOther = [];\n\n\tdata.forEach(function(item) {\n\t\tvar city = (item.city || '').toLowerCase();\n\n\t\tvar isSpb = cityChecker(spbAlias, city);\n\t\tvar isMsk = cityChecker(mskAlias, city);\n\t\tvar isOther = !(isMsk || isSpb);\n\t\tif (isSpb) {\n\t\t\tsaintP.push(item)\n\t\t}\n\t\tif (isMsk) {\n\t\t\tmoscow.push(item)\n\t\t}\n\t\tif (isOther) {\n\t\t\tallOther.push(item)\n\t\t}\n\t});\n\n\treturn {\n\t\tmsk: moscow,\n\t\tspb: saintP,\n\t\tallOther: allOther\n\t}\n}\n\nfunction getRoubles(data) {\n\treturn data.filter(function(item) {\n\t\treturn item.isRoubles;\n\t});\n}\n\nfunction getDollars(data) {\n\treturn data.filter(function(item) {\n\t\treturn !item.isRoubles\n\t});\n}\n\nfunction convertDollarsToRoubles(data) {\n\treturn data.map(function(item) {\n\t\tvar newItem = objectAssign({}, item);\n\t\tnewItem.averageSalary = item.averageSalary * DOLLAR_COST;\n\t\treturn newItem;\n\t});\n}\n\n\nfunction getMen(data) {\n\treturn data.filter(function(item) {\n\t\treturn !item.isWoman\n\t});\n}\n\nfunction getWomen(data) {\n\treturn data.filter(function(item) {\n\t\treturn item.isWoman\n\t});\n}\n\nfunction getIT(data) {\n\treturn data.filter(function(item) {\n\t\treturn itJobsKeywords.some(function(job) {\n\t\t\treturn item.job.indexOf(job) !== -1;\n\t\t})\n\t})\n\n}\nfunction countFullSalary(data) {\n\treturn data.map(countAverageYearSalary)\n}\n\nfunction getAverageSalary(data) {\n\tvar res = 0;\n\tdata.forEach(function(item) {\n\t\tres += item.averageSalary;\n\t});\n\treturn (res / data.length);\n}\nfunction getMedianSalary(data) {\n\tif (!data.length) {\n\t\treturn 0;\n\t}\n\tvar tempData = data.sort(function(a, b) {\n\t\treturn a.averageSalary - b.averageSalary;\n\t});\n\tvar half = Math.floor(tempData.length / 2);\n\n\tif (tempData.length % 2) {\n\t\treturn tempData[half].averageSalary;\n\t}\n\telse {\n\t\treturn (tempData[half - 1].averageSalary + tempData[half].averageSalary) / 2;\n\t}\n}\n\nfunction groupByExperience(data) {\n\tvar result = [];\n\n\tdata.forEach(function(item) {\n\t\tif (item.fullExp) {\n\t\t\tvar exp = Math.round(+item.fullExp);\n\t\t\tif (!result[exp]) {\n\t\t\t\tresult[exp] = []\n\t\t\t}\n\t\t\tresult[exp].push(item);\n\t\t}\n\t});\n\tfor (var i = 0; i < result.length; i++) {\n\t\tresult[i] = !result[i] ? [] : result[i];\n\t}\n\treturn result;\n\n}\n\nfunction getMax(obj) {\n\tvar max = 0;\n\tfor (var key in obj) {\n\t\tvar value = obj[key];\n\t\tvar toNumber = typeof value === 'object' ? getMax(value) : value;\n\t\tif (toNumber > max) {\n\t\t\tmax = toNumber;\n\t\t}\n\t}\n\treturn max;\n}\n\nfunction createTitle(i, step, groupNumber) {\n\treturn (i !== groupNumber - 1) ?\n\t(i * step + 1) + '-' + (i * step + step) :\n\ti * step + '+';\n}\nfunction getExpStats(data) {\n\tvar groupedResult = {};\n\tvar groupsNumber = 6;\n\tvar step = 3;\n\tvar lastGroup = [];\n\tfor (var i = 0; i < groupsNumber - 1; i++) {\n\n\t\t//@todo use step variable\n\t\tvar groupedByExperience = data[i + 3].concat(data[i + 1]).concat(data[i + 2]);\n\t\tgroupedResult[createTitle(i, step, groupsNumber)] = {\n\t\t\tmen: getMedianSalary(getMen(groupedByExperience)),\n\t\t\twomen: getMedianSalary(getWomen(groupedByExperience))\n\t\t}\n\t}\n\tfor (var j = i * step; j < data.length; j++) {\n\t\tlastGroup = lastGroup.concat(data[j]);\n\t}\n\tgroupedResult[createTitle(i, step, groupsNumber)] = {\n\t\tmen: getMedianSalary(getMen(lastGroup)),\n\t\twomen: getMedianSalary(getWomen(lastGroup))\n\t};\n\treturn groupedResult;\n\n}\nfunction prepareAllStats(data) {\n\tvar men = getMen(data);\n\tvar women = getWomen(data);\n\tvar groupedByExp = groupByExperience(data);\n\tvar cities = getCities(data);\n\tvar avg = getMedianSalary;\n\n\tvar stats = {\n\t\tmen: avg(men),\n\t\twomen: avg(women),\n\t\texp: getExpStats(groupedByExp),\n\t\tcities: {\n\t\t\tspb: {\n\t\t\t\tmen: avg(getMen(cities.spb)),\n\t\t\t\twomen: avg(getWomen(cities.spb))\n\t\t\t},\n\t\t\tmsk: {\n\t\t\t\tmen: avg(getMen(cities.msk)),\n\t\t\t\twomen: avg(getWomen(cities.msk))\n\t\t\t},\n\t\t\tallOther: {\n\t\t\t\tmen: avg(getMen(cities.allOther)),\n\t\t\t\twomen: avg(getWomen(cities.allOther))\n\t\t\t}\n\t\t}\n\t};\n\tstats.maxAverage = getMax(stats);\n\treturn stats;\n}\n\nfunction getAllInRoubles(data) {\n\tvar roublesData = getRoubles(data);\n\tvar dollarsData = getDollars(data);\n\treturn roublesData.concat(convertDollarsToRoubles(dollarsData));\n\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/analyze.js\n ** module id = 15\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/analyze.js?");

/***/ },
/* 16 */
/***/ function(module, exports) {

	eval("/* eslint-disable no-unused-vars */\n'use strict';\nvar hasOwnProperty = Object.prototype.hasOwnProperty;\nvar propIsEnumerable = Object.prototype.propertyIsEnumerable;\n\nfunction toObject(val) {\n\tif (val === null || val === undefined) {\n\t\tthrow new TypeError('Object.assign cannot be called with null or undefined');\n\t}\n\n\treturn Object(val);\n}\n\nmodule.exports = Object.assign || function (target, source) {\n\tvar from;\n\tvar to = toObject(target);\n\tvar symbols;\n\n\tfor (var s = 1; s < arguments.length; s++) {\n\t\tfrom = Object(arguments[s]);\n\n\t\tfor (var key in from) {\n\t\t\tif (hasOwnProperty.call(from, key)) {\n\t\t\t\tto[key] = from[key];\n\t\t\t}\n\t\t}\n\n\t\tif (Object.getOwnPropertySymbols) {\n\t\t\tsymbols = Object.getOwnPropertySymbols(from);\n\t\t\tfor (var i = 0; i < symbols.length; i++) {\n\t\t\t\tif (propIsEnumerable.call(from, symbols[i])) {\n\t\t\t\t\tto[symbols[i]] = from[symbols[i]];\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\n\treturn to;\n};\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/object-assign/index.js\n ** module id = 16\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/object-assign/index.js?");

/***/ },
/* 17 */
/***/ function(module, exports) {

	eval("module.exports = {\n\tfake: ['23/03/2016 13:07:04','24/03/2016 19:12:16', '26/03/2016 12:10:19', '23/03/2016 14:53:01'],\n\tmultiplyOnThousand: ['25/03/2016 10:59:50','23/03/2016 23:28:11', '22/03/2016 19:12:19', '22/03/2016 20:07:17', '22/03/2016 20:12:17']\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/config/fakeList.js\n ** module id = 17\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/config/fakeList.js?");

/***/ },
/* 18 */
/***/ function(module, exports) {

	eval("//in lowercase\nmodule.exports = ['3d', 'android', 'architect', 'artist', 'backend', 'back-end', 'ceo',\n\t'cto', 'design', 'dev', 'digital', 'engineer', 'freelance', 'frontend', 'front-end',\n\t'ios', 'interface', 'junior', 'lead', 'mobile', 'program', 'qa', 'senior', 'seo',\n\t'smm', 'ui', 'usability', 'ux', 'visual', 'web', 'администратор', 'аналитик',\n\t'архитектор', 'бэкенд', 'бекенд', 'веб', 'верстальщик', 'диджитал', 'дизайн',\n\t'иллюстратор', 'интерфейс', 'лидер', 'проектировщик', 'программист', 'разработчик',\n\t'сеньор', 'сисадмин', 'тестировщик', 'тимлид', 'юзабилити', 'фриланс', 'фронтенд'];\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/config/itKeywords.js\n ** module id = 18\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/config/itKeywords.js?");

/***/ }
/******/ ]);