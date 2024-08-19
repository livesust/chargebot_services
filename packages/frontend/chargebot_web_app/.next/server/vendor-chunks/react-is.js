"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/react-is";
exports.ids = ["vendor-chunks/react-is"];
exports.modules = {

/***/ "(ssr)/./node_modules/react-is/cjs/react-is.development.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-is/cjs/react-is.development.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("/**\n * @license React\n * react-is.development.js\n *\n * Copyright (c) Facebook, Inc. and its affiliates.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n */ \nif (true) {\n    (function() {\n        \"use strict\";\n        // ATTENTION\n        // When adding new symbols to this file,\n        // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'\n        // The Symbol used to tag the ReactElement-like types.\n        var REACT_ELEMENT_TYPE = Symbol.for(\"react.element\");\n        var REACT_PORTAL_TYPE = Symbol.for(\"react.portal\");\n        var REACT_FRAGMENT_TYPE = Symbol.for(\"react.fragment\");\n        var REACT_STRICT_MODE_TYPE = Symbol.for(\"react.strict_mode\");\n        var REACT_PROFILER_TYPE = Symbol.for(\"react.profiler\");\n        var REACT_PROVIDER_TYPE = Symbol.for(\"react.provider\");\n        var REACT_CONTEXT_TYPE = Symbol.for(\"react.context\");\n        var REACT_SERVER_CONTEXT_TYPE = Symbol.for(\"react.server_context\");\n        var REACT_FORWARD_REF_TYPE = Symbol.for(\"react.forward_ref\");\n        var REACT_SUSPENSE_TYPE = Symbol.for(\"react.suspense\");\n        var REACT_SUSPENSE_LIST_TYPE = Symbol.for(\"react.suspense_list\");\n        var REACT_MEMO_TYPE = Symbol.for(\"react.memo\");\n        var REACT_LAZY_TYPE = Symbol.for(\"react.lazy\");\n        var REACT_OFFSCREEN_TYPE = Symbol.for(\"react.offscreen\");\n        // -----------------------------------------------------------------------------\n        var enableScopeAPI = false; // Experimental Create Event Handle API.\n        var enableCacheElement = false;\n        var enableTransitionTracing = false; // No known bugs, but needs performance testing\n        var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber\n        // stuff. Intended to enable React core members to more easily debug scheduling\n        // issues in DEV builds.\n        var enableDebugTracing = false; // Track which Fiber(s) schedule render work.\n        var REACT_MODULE_REFERENCE;\n        {\n            REACT_MODULE_REFERENCE = Symbol.for(\"react.module.reference\");\n        }\n        function isValidElementType(type) {\n            if (typeof type === \"string\" || typeof type === \"function\") {\n                return true;\n            } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).\n            if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {\n                return true;\n            }\n            if (typeof type === \"object\" && type !== null) {\n                if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object\n                // types supported by any Flight configuration anywhere since\n                // we don't know which Flight build this will end up being used\n                // with.\n                type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {\n                    return true;\n                }\n            }\n            return false;\n        }\n        function typeOf(object) {\n            if (typeof object === \"object\" && object !== null) {\n                var $$typeof = object.$$typeof;\n                switch($$typeof){\n                    case REACT_ELEMENT_TYPE:\n                        var type = object.type;\n                        switch(type){\n                            case REACT_FRAGMENT_TYPE:\n                            case REACT_PROFILER_TYPE:\n                            case REACT_STRICT_MODE_TYPE:\n                            case REACT_SUSPENSE_TYPE:\n                            case REACT_SUSPENSE_LIST_TYPE:\n                                return type;\n                            default:\n                                var $$typeofType = type && type.$$typeof;\n                                switch($$typeofType){\n                                    case REACT_SERVER_CONTEXT_TYPE:\n                                    case REACT_CONTEXT_TYPE:\n                                    case REACT_FORWARD_REF_TYPE:\n                                    case REACT_LAZY_TYPE:\n                                    case REACT_MEMO_TYPE:\n                                    case REACT_PROVIDER_TYPE:\n                                        return $$typeofType;\n                                    default:\n                                        return $$typeof;\n                                }\n                        }\n                    case REACT_PORTAL_TYPE:\n                        return $$typeof;\n                }\n            }\n            return undefined;\n        }\n        var ContextConsumer = REACT_CONTEXT_TYPE;\n        var ContextProvider = REACT_PROVIDER_TYPE;\n        var Element = REACT_ELEMENT_TYPE;\n        var ForwardRef = REACT_FORWARD_REF_TYPE;\n        var Fragment = REACT_FRAGMENT_TYPE;\n        var Lazy = REACT_LAZY_TYPE;\n        var Memo = REACT_MEMO_TYPE;\n        var Portal = REACT_PORTAL_TYPE;\n        var Profiler = REACT_PROFILER_TYPE;\n        var StrictMode = REACT_STRICT_MODE_TYPE;\n        var Suspense = REACT_SUSPENSE_TYPE;\n        var SuspenseList = REACT_SUSPENSE_LIST_TYPE;\n        var hasWarnedAboutDeprecatedIsAsyncMode = false;\n        var hasWarnedAboutDeprecatedIsConcurrentMode = false; // AsyncMode should be deprecated\n        function isAsyncMode(object) {\n            {\n                if (!hasWarnedAboutDeprecatedIsAsyncMode) {\n                    hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint\n                    console[\"warn\"](\"The ReactIs.isAsyncMode() alias has been deprecated, \" + \"and will be removed in React 18+.\");\n                }\n            }\n            return false;\n        }\n        function isConcurrentMode(object) {\n            {\n                if (!hasWarnedAboutDeprecatedIsConcurrentMode) {\n                    hasWarnedAboutDeprecatedIsConcurrentMode = true; // Using console['warn'] to evade Babel and ESLint\n                    console[\"warn\"](\"The ReactIs.isConcurrentMode() alias has been deprecated, \" + \"and will be removed in React 18+.\");\n                }\n            }\n            return false;\n        }\n        function isContextConsumer(object) {\n            return typeOf(object) === REACT_CONTEXT_TYPE;\n        }\n        function isContextProvider(object) {\n            return typeOf(object) === REACT_PROVIDER_TYPE;\n        }\n        function isElement(object) {\n            return typeof object === \"object\" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;\n        }\n        function isForwardRef(object) {\n            return typeOf(object) === REACT_FORWARD_REF_TYPE;\n        }\n        function isFragment(object) {\n            return typeOf(object) === REACT_FRAGMENT_TYPE;\n        }\n        function isLazy(object) {\n            return typeOf(object) === REACT_LAZY_TYPE;\n        }\n        function isMemo(object) {\n            return typeOf(object) === REACT_MEMO_TYPE;\n        }\n        function isPortal(object) {\n            return typeOf(object) === REACT_PORTAL_TYPE;\n        }\n        function isProfiler(object) {\n            return typeOf(object) === REACT_PROFILER_TYPE;\n        }\n        function isStrictMode(object) {\n            return typeOf(object) === REACT_STRICT_MODE_TYPE;\n        }\n        function isSuspense(object) {\n            return typeOf(object) === REACT_SUSPENSE_TYPE;\n        }\n        function isSuspenseList(object) {\n            return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;\n        }\n        exports.ContextConsumer = ContextConsumer;\n        exports.ContextProvider = ContextProvider;\n        exports.Element = Element;\n        exports.ForwardRef = ForwardRef;\n        exports.Fragment = Fragment;\n        exports.Lazy = Lazy;\n        exports.Memo = Memo;\n        exports.Portal = Portal;\n        exports.Profiler = Profiler;\n        exports.StrictMode = StrictMode;\n        exports.Suspense = Suspense;\n        exports.SuspenseList = SuspenseList;\n        exports.isAsyncMode = isAsyncMode;\n        exports.isConcurrentMode = isConcurrentMode;\n        exports.isContextConsumer = isContextConsumer;\n        exports.isContextProvider = isContextProvider;\n        exports.isElement = isElement;\n        exports.isForwardRef = isForwardRef;\n        exports.isFragment = isFragment;\n        exports.isLazy = isLazy;\n        exports.isMemo = isMemo;\n        exports.isPortal = isPortal;\n        exports.isProfiler = isProfiler;\n        exports.isStrictMode = isStrictMode;\n        exports.isSuspense = isSuspense;\n        exports.isSuspenseList = isSuspenseList;\n        exports.isValidElementType = isValidElementType;\n        exports.typeOf = typeOf;\n    })();\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmVhY3QtaXMvY2pzL3JlYWN0LWlzLmRldmVsb3BtZW50LmpzIiwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztDQVFDLEdBRUQ7QUFFQSxJQUFJQSxJQUFxQyxFQUFFO0lBQ3hDO1FBQ0g7UUFFQSxZQUFZO1FBQ1osd0NBQXdDO1FBQ3hDLGtGQUFrRjtRQUNsRixzREFBc0Q7UUFDdEQsSUFBSUMscUJBQXFCQyxPQUFPQyxHQUFHLENBQUM7UUFDcEMsSUFBSUMsb0JBQW9CRixPQUFPQyxHQUFHLENBQUM7UUFDbkMsSUFBSUUsc0JBQXNCSCxPQUFPQyxHQUFHLENBQUM7UUFDckMsSUFBSUcseUJBQXlCSixPQUFPQyxHQUFHLENBQUM7UUFDeEMsSUFBSUksc0JBQXNCTCxPQUFPQyxHQUFHLENBQUM7UUFDckMsSUFBSUssc0JBQXNCTixPQUFPQyxHQUFHLENBQUM7UUFDckMsSUFBSU0scUJBQXFCUCxPQUFPQyxHQUFHLENBQUM7UUFDcEMsSUFBSU8sNEJBQTRCUixPQUFPQyxHQUFHLENBQUM7UUFDM0MsSUFBSVEseUJBQXlCVCxPQUFPQyxHQUFHLENBQUM7UUFDeEMsSUFBSVMsc0JBQXNCVixPQUFPQyxHQUFHLENBQUM7UUFDckMsSUFBSVUsMkJBQTJCWCxPQUFPQyxHQUFHLENBQUM7UUFDMUMsSUFBSVcsa0JBQWtCWixPQUFPQyxHQUFHLENBQUM7UUFDakMsSUFBSVksa0JBQWtCYixPQUFPQyxHQUFHLENBQUM7UUFDakMsSUFBSWEsdUJBQXVCZCxPQUFPQyxHQUFHLENBQUM7UUFFdEMsZ0ZBQWdGO1FBRWhGLElBQUljLGlCQUFpQixPQUFPLHdDQUF3QztRQUNwRSxJQUFJQyxxQkFBcUI7UUFDekIsSUFBSUMsMEJBQTBCLE9BQU8sK0NBQStDO1FBRXBGLElBQUlDLHFCQUFxQixPQUFPLHNEQUFzRDtRQUN0RiwrRUFBK0U7UUFDL0Usd0JBQXdCO1FBRXhCLElBQUlDLHFCQUFxQixPQUFPLDZDQUE2QztRQUU3RSxJQUFJQztRQUVKO1lB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UUFDdkJTLGtCQUFrQixHQUFHUjtRQUNyQlEsY0FBYyxHQUFHUDtRQUNqQk8sY0FBYyxHQUFHTjtRQUNqQk0sZ0JBQWdCLEdBQUdMO1FBQ25CSyxrQkFBa0IsR0FBR0o7UUFDckJJLG9CQUFvQixHQUFHSDtRQUN2Qkcsa0JBQWtCLEdBQUdGO1FBQ3JCRSxzQkFBc0IsR0FBR0Q7UUFDekJDLDBCQUEwQixHQUFHckM7UUFDN0JxQyxjQUFjLEdBQUdoQztJQUNmO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AY2hhcmdlYm90L3dlYi8uL25vZGVfbW9kdWxlcy9yZWFjdC1pcy9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanM/NDk2YSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlIFJlYWN0XG4gKiByZWFjdC1pcy5kZXZlbG9wbWVudC5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbi8vIEFUVEVOVElPTlxuLy8gV2hlbiBhZGRpbmcgbmV3IHN5bWJvbHMgdG8gdGhpcyBmaWxlLFxuLy8gUGxlYXNlIGNvbnNpZGVyIGFsc28gYWRkaW5nIHRvICdyZWFjdC1kZXZ0b29scy1zaGFyZWQvc3JjL2JhY2tlbmQvUmVhY3RTeW1ib2xzJ1xuLy8gVGhlIFN5bWJvbCB1c2VkIHRvIHRhZyB0aGUgUmVhY3RFbGVtZW50LWxpa2UgdHlwZXMuXG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpO1xudmFyIFJFQUNUX1BPUlRBTF9UWVBFID0gU3ltYm9sLmZvcigncmVhY3QucG9ydGFsJyk7XG52YXIgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LmZyYWdtZW50Jyk7XG52YXIgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LnN0cmljdF9tb2RlJyk7XG52YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LnByb2ZpbGVyJyk7XG52YXIgUkVBQ1RfUFJPVklERVJfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LnByb3ZpZGVyJyk7XG52YXIgUkVBQ1RfQ09OVEVYVF9UWVBFID0gU3ltYm9sLmZvcigncmVhY3QuY29udGV4dCcpO1xudmFyIFJFQUNUX1NFUlZFUl9DT05URVhUX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5zZXJ2ZXJfY29udGV4dCcpO1xudmFyIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5mb3J3YXJkX3JlZicpO1xudmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5zdXNwZW5zZScpO1xudmFyIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LnN1c3BlbnNlX2xpc3QnKTtcbnZhciBSRUFDVF9NRU1PX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJyk7XG52YXIgUkVBQ1RfTEFaWV9UWVBFID0gU3ltYm9sLmZvcigncmVhY3QubGF6eScpO1xudmFyIFJFQUNUX09GRlNDUkVFTl9UWVBFID0gU3ltYm9sLmZvcigncmVhY3Qub2Zmc2NyZWVuJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBlbmFibGVTY29wZUFQSSA9IGZhbHNlOyAvLyBFeHBlcmltZW50YWwgQ3JlYXRlIEV2ZW50IEhhbmRsZSBBUEkuXG52YXIgZW5hYmxlQ2FjaGVFbGVtZW50ID0gZmFsc2U7XG52YXIgZW5hYmxlVHJhbnNpdGlvblRyYWNpbmcgPSBmYWxzZTsgLy8gTm8ga25vd24gYnVncywgYnV0IG5lZWRzIHBlcmZvcm1hbmNlIHRlc3RpbmdcblxudmFyIGVuYWJsZUxlZ2FjeUhpZGRlbiA9IGZhbHNlOyAvLyBFbmFibGVzIHVuc3RhYmxlX2F2b2lkVGhpc0ZhbGxiYWNrIGZlYXR1cmUgaW4gRmliZXJcbi8vIHN0dWZmLiBJbnRlbmRlZCB0byBlbmFibGUgUmVhY3QgY29yZSBtZW1iZXJzIHRvIG1vcmUgZWFzaWx5IGRlYnVnIHNjaGVkdWxpbmdcbi8vIGlzc3VlcyBpbiBERVYgYnVpbGRzLlxuXG52YXIgZW5hYmxlRGVidWdUcmFjaW5nID0gZmFsc2U7IC8vIFRyYWNrIHdoaWNoIEZpYmVyKHMpIHNjaGVkdWxlIHJlbmRlciB3b3JrLlxuXG52YXIgUkVBQ1RfTU9EVUxFX1JFRkVSRU5DRTtcblxue1xuICBSRUFDVF9NT0RVTEVfUkVGRVJFTkNFID0gU3ltYm9sLmZvcigncmVhY3QubW9kdWxlLnJlZmVyZW5jZScpO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkge1xuICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gTm90ZTogdHlwZW9mIG1pZ2h0IGJlIG90aGVyIHRoYW4gJ3N5bWJvbCcgb3IgJ251bWJlcicgKGUuZy4gaWYgaXQncyBhIHBvbHlmaWxsKS5cblxuXG4gIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEUgfHwgZW5hYmxlRGVidWdUcmFjaW5nICB8fCB0eXBlID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFIHx8IGVuYWJsZUxlZ2FjeUhpZGRlbiAgfHwgdHlwZSA9PT0gUkVBQ1RfT0ZGU0NSRUVOX1RZUEUgfHwgZW5hYmxlU2NvcGVBUEkgIHx8IGVuYWJsZUNhY2hlRWxlbWVudCAgfHwgZW5hYmxlVHJhbnNpdGlvblRyYWNpbmcgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwpIHtcbiAgICBpZiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IC8vIFRoaXMgbmVlZHMgdG8gaW5jbHVkZSBhbGwgcG9zc2libGUgbW9kdWxlIHJlZmVyZW5jZSBvYmplY3RcbiAgICAvLyB0eXBlcyBzdXBwb3J0ZWQgYnkgYW55IEZsaWdodCBjb25maWd1cmF0aW9uIGFueXdoZXJlIHNpbmNlXG4gICAgLy8gd2UgZG9uJ3Qga25vdyB3aGljaCBGbGlnaHQgYnVpbGQgdGhpcyB3aWxsIGVuZCB1cCBiZWluZyB1c2VkXG4gICAgLy8gd2l0aC5cbiAgICB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NT0RVTEVfUkVGRVJFTkNFIHx8IHR5cGUuZ2V0TW9kdWxlSWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiB0eXBlT2Yob2JqZWN0KSB7XG4gIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwpIHtcbiAgICB2YXIgJCR0eXBlb2YgPSBvYmplY3QuJCR0eXBlb2Y7XG5cbiAgICBzd2l0Y2ggKCQkdHlwZW9mKSB7XG4gICAgICBjYXNlIFJFQUNUX0VMRU1FTlRfVFlQRTpcbiAgICAgICAgdmFyIHR5cGUgPSBvYmplY3QudHlwZTtcblxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICBjYXNlIFJFQUNUX0ZSQUdNRU5UX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9QUk9GSUxFUl9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfU1RSSUNUX01PREVfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gdHlwZTtcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgJCR0eXBlb2ZUeXBlID0gdHlwZSAmJiB0eXBlLiQkdHlwZW9mO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKCQkdHlwZW9mVHlwZSkge1xuICAgICAgICAgICAgICBjYXNlIFJFQUNUX1NFUlZFUl9DT05URVhUX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfQ09OVEVYVF9UWVBFOlxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfTEFaWV9UWVBFOlxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX01FTU9fVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9QUk9WSURFUl9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiAkJHR5cGVvZlR5cGU7XG5cbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gJCR0eXBlb2Y7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgICByZXR1cm4gJCR0eXBlb2Y7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbnZhciBDb250ZXh0Q29uc3VtZXIgPSBSRUFDVF9DT05URVhUX1RZUEU7XG52YXIgQ29udGV4dFByb3ZpZGVyID0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbnZhciBFbGVtZW50ID0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xudmFyIEZvcndhcmRSZWYgPSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFO1xudmFyIEZyYWdtZW50ID0gUkVBQ1RfRlJBR01FTlRfVFlQRTtcbnZhciBMYXp5ID0gUkVBQ1RfTEFaWV9UWVBFO1xudmFyIE1lbW8gPSBSRUFDVF9NRU1PX1RZUEU7XG52YXIgUG9ydGFsID0gUkVBQ1RfUE9SVEFMX1RZUEU7XG52YXIgUHJvZmlsZXIgPSBSRUFDVF9QUk9GSUxFUl9UWVBFO1xudmFyIFN0cmljdE1vZGUgPSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xudmFyIFN1c3BlbnNlID0gUkVBQ1RfU1VTUEVOU0VfVFlQRTtcbnZhciBTdXNwZW5zZUxpc3QgPSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU7XG52YXIgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUgPSBmYWxzZTtcbnZhciBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0NvbmN1cnJlbnRNb2RlID0gZmFsc2U7IC8vIEFzeW5jTW9kZSBzaG91bGQgYmUgZGVwcmVjYXRlZFxuXG5mdW5jdGlvbiBpc0FzeW5jTW9kZShvYmplY3QpIHtcbiAge1xuICAgIGlmICghaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUpIHtcbiAgICAgIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlID0gdHJ1ZTsgLy8gVXNpbmcgY29uc29sZVsnd2FybiddIHRvIGV2YWRlIEJhYmVsIGFuZCBFU0xpbnRcblxuICAgICAgY29uc29sZVsnd2FybiddKCdUaGUgUmVhY3RJcy5pc0FzeW5jTW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsICcgKyAnYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZWFjdCAxOCsuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNDb25jdXJyZW50TW9kZShvYmplY3QpIHtcbiAge1xuICAgIGlmICghaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSkge1xuICAgICAgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSA9IHRydWU7IC8vIFVzaW5nIGNvbnNvbGVbJ3dhcm4nXSB0byBldmFkZSBCYWJlbCBhbmQgRVNMaW50XG5cbiAgICAgIGNvbnNvbGVbJ3dhcm4nXSgnVGhlIFJlYWN0SXMuaXNDb25jdXJyZW50TW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsICcgKyAnYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZWFjdCAxOCsuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0Q29uc3VtZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0UHJvdmlkZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRWxlbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRm9yd2FyZFJlZihvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFO1xufVxuZnVuY3Rpb24gaXNGcmFnbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNMYXp5KG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0xBWllfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzTWVtbyhvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9NRU1PX1RZUEU7XG59XG5mdW5jdGlvbiBpc1BvcnRhbChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9QT1JUQUxfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzUHJvZmlsZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzU3RyaWN0TW9kZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xufVxuZnVuY3Rpb24gaXNTdXNwZW5zZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFO1xufVxuZnVuY3Rpb24gaXNTdXNwZW5zZUxpc3Qob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFO1xufVxuXG5leHBvcnRzLkNvbnRleHRDb25zdW1lciA9IENvbnRleHRDb25zdW1lcjtcbmV4cG9ydHMuQ29udGV4dFByb3ZpZGVyID0gQ29udGV4dFByb3ZpZGVyO1xuZXhwb3J0cy5FbGVtZW50ID0gRWxlbWVudDtcbmV4cG9ydHMuRm9yd2FyZFJlZiA9IEZvcndhcmRSZWY7XG5leHBvcnRzLkZyYWdtZW50ID0gRnJhZ21lbnQ7XG5leHBvcnRzLkxhenkgPSBMYXp5O1xuZXhwb3J0cy5NZW1vID0gTWVtbztcbmV4cG9ydHMuUG9ydGFsID0gUG9ydGFsO1xuZXhwb3J0cy5Qcm9maWxlciA9IFByb2ZpbGVyO1xuZXhwb3J0cy5TdHJpY3RNb2RlID0gU3RyaWN0TW9kZTtcbmV4cG9ydHMuU3VzcGVuc2UgPSBTdXNwZW5zZTtcbmV4cG9ydHMuU3VzcGVuc2VMaXN0ID0gU3VzcGVuc2VMaXN0O1xuZXhwb3J0cy5pc0FzeW5jTW9kZSA9IGlzQXN5bmNNb2RlO1xuZXhwb3J0cy5pc0NvbmN1cnJlbnRNb2RlID0gaXNDb25jdXJyZW50TW9kZTtcbmV4cG9ydHMuaXNDb250ZXh0Q29uc3VtZXIgPSBpc0NvbnRleHRDb25zdW1lcjtcbmV4cG9ydHMuaXNDb250ZXh0UHJvdmlkZXIgPSBpc0NvbnRleHRQcm92aWRlcjtcbmV4cG9ydHMuaXNFbGVtZW50ID0gaXNFbGVtZW50O1xuZXhwb3J0cy5pc0ZvcndhcmRSZWYgPSBpc0ZvcndhcmRSZWY7XG5leHBvcnRzLmlzRnJhZ21lbnQgPSBpc0ZyYWdtZW50O1xuZXhwb3J0cy5pc0xhenkgPSBpc0xhenk7XG5leHBvcnRzLmlzTWVtbyA9IGlzTWVtbztcbmV4cG9ydHMuaXNQb3J0YWwgPSBpc1BvcnRhbDtcbmV4cG9ydHMuaXNQcm9maWxlciA9IGlzUHJvZmlsZXI7XG5leHBvcnRzLmlzU3RyaWN0TW9kZSA9IGlzU3RyaWN0TW9kZTtcbmV4cG9ydHMuaXNTdXNwZW5zZSA9IGlzU3VzcGVuc2U7XG5leHBvcnRzLmlzU3VzcGVuc2VMaXN0ID0gaXNTdXNwZW5zZUxpc3Q7XG5leHBvcnRzLmlzVmFsaWRFbGVtZW50VHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZTtcbmV4cG9ydHMudHlwZU9mID0gdHlwZU9mO1xuICB9KSgpO1xufVxuIl0sIm5hbWVzIjpbInByb2Nlc3MiLCJSRUFDVF9FTEVNRU5UX1RZUEUiLCJTeW1ib2wiLCJmb3IiLCJSRUFDVF9QT1JUQUxfVFlQRSIsIlJFQUNUX0ZSQUdNRU5UX1RZUEUiLCJSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFIiwiUkVBQ1RfUFJPRklMRVJfVFlQRSIsIlJFQUNUX1BST1ZJREVSX1RZUEUiLCJSRUFDVF9DT05URVhUX1RZUEUiLCJSRUFDVF9TRVJWRVJfQ09OVEVYVF9UWVBFIiwiUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSIsIlJFQUNUX1NVU1BFTlNFX1RZUEUiLCJSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUiLCJSRUFDVF9NRU1PX1RZUEUiLCJSRUFDVF9MQVpZX1RZUEUiLCJSRUFDVF9PRkZTQ1JFRU5fVFlQRSIsImVuYWJsZVNjb3BlQVBJIiwiZW5hYmxlQ2FjaGVFbGVtZW50IiwiZW5hYmxlVHJhbnNpdGlvblRyYWNpbmciLCJlbmFibGVMZWdhY3lIaWRkZW4iLCJlbmFibGVEZWJ1Z1RyYWNpbmciLCJSRUFDVF9NT0RVTEVfUkVGRVJFTkNFIiwiaXNWYWxpZEVsZW1lbnRUeXBlIiwidHlwZSIsIiQkdHlwZW9mIiwiZ2V0TW9kdWxlSWQiLCJ1bmRlZmluZWQiLCJ0eXBlT2YiLCJvYmplY3QiLCIkJHR5cGVvZlR5cGUiLCJDb250ZXh0Q29uc3VtZXIiLCJDb250ZXh0UHJvdmlkZXIiLCJFbGVtZW50IiwiRm9yd2FyZFJlZiIsIkZyYWdtZW50IiwiTGF6eSIsIk1lbW8iLCJQb3J0YWwiLCJQcm9maWxlciIsIlN0cmljdE1vZGUiLCJTdXNwZW5zZSIsIlN1c3BlbnNlTGlzdCIsImhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlIiwiaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSIsImlzQXN5bmNNb2RlIiwiY29uc29sZSIsImlzQ29uY3VycmVudE1vZGUiLCJpc0NvbnRleHRDb25zdW1lciIsImlzQ29udGV4dFByb3ZpZGVyIiwiaXNFbGVtZW50IiwiaXNGb3J3YXJkUmVmIiwiaXNGcmFnbWVudCIsImlzTGF6eSIsImlzTWVtbyIsImlzUG9ydGFsIiwiaXNQcm9maWxlciIsImlzU3RyaWN0TW9kZSIsImlzU3VzcGVuc2UiLCJpc1N1c3BlbnNlTGlzdCIsImV4cG9ydHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/react-is/cjs/react-is.development.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/react-is/index.js":
/*!****************************************!*\
  !*** ./node_modules/react-is/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\nif (false) {} else {\n    module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ \"(ssr)/./node_modules/react-is/cjs/react-is.development.js\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmVhY3QtaXMvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFFQSxJQUFJQSxLQUF5QixFQUFjLEVBRTFDLE1BQU07SUFDTEMsc0lBQXlCO0FBQzNCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGNoYXJnZWJvdC93ZWIvLi9ub2RlX21vZHVsZXMvcmVhY3QtaXMvaW5kZXguanM/YjMxMyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtaXMucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiJdLCJuYW1lcyI6WyJwcm9jZXNzIiwibW9kdWxlIiwiZXhwb3J0cyIsInJlcXVpcmUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/react-is/index.js\n");

/***/ })

};
;