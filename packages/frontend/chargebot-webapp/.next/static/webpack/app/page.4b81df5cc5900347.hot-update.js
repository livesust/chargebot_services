/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./src/app/page.tsx":
/*!**************************!*\
  !*** ./src/app/page.tsx ***!
  \**************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   App: function() { return /* binding */ App; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var aws_amplify__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! aws-amplify */ \"(app-pages-browser)/./node_modules/aws-amplify/dist/esm/initSingleton.mjs\");\n/* harmony import */ var _aws_amplify_ui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @aws-amplify/ui-react */ \"(app-pages-browser)/./node_modules/@aws-amplify/ui-react/dist/esm/components/Authenticator/Authenticator.mjs\");\n/* harmony import */ var _aws_amplify_ui_react_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @aws-amplify/ui-react/styles.css */ \"(app-pages-browser)/./node_modules/@aws-amplify/ui-react/dist/styles.css\");\n/* harmony import */ var _amplifyconfiguration_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../amplifyconfiguration.json */ \"(app-pages-browser)/./src/amplifyconfiguration.json\");\n/* harmony import */ var _pages_home__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/home */ \"(app-pages-browser)/./src/app/pages/home/index.tsx\");\n/* harmony import */ var _pages_home__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_pages_home__WEBPACK_IMPORTED_MODULE_3__);\n// Amplify UI components are interactive and designed to work on the client side.\n// To use them inside of Server Components you must wrap them in a Client Component \n/* __next_internal_client_entry_do_not_use__ App,default auto */ \n\n\n\n\n\nvar _process_env_NEXT_PUBLIC_API_URL;\naws_amplify__WEBPACK_IMPORTED_MODULE_4__.DefaultAmplify.configure({\n    ..._amplifyconfiguration_json__WEBPACK_IMPORTED_MODULE_2__,\n    API: {\n        REST: {\n            chargebot: {\n                endpoint: (_process_env_NEXT_PUBLIC_API_URL = \"https://6ykkwrugp8.execute-api.us-east-1.amazonaws.com\") !== null && _process_env_NEXT_PUBLIC_API_URL !== void 0 ? _process_env_NEXT_PUBLIC_API_URL : \"\"\n            }\n        }\n    }\n});\nfunction App() {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"flex bg-gray-700 p-3 align-middle w-full h-screen\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_aws_amplify_ui_react__WEBPACK_IMPORTED_MODULE_5__.Authenticator, {\n            hideSignUp: true,\n            className: \"max-w-fit m-auto bg-orange-500 rounded-md\",\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_pages_home__WEBPACK_IMPORTED_MODULE_3__.Home, {}, void 0, false, {\n                fileName: \"/home/daniel/workspace/sust/chargebot/chargebot_services/packages/frontend/chargebot-webapp/src/app/page.tsx\",\n                lineNumber: 26,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/home/daniel/workspace/sust/chargebot/chargebot_services/packages/frontend/chargebot-webapp/src/app/page.tsx\",\n            lineNumber: 25,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/daniel/workspace/sust/chargebot/chargebot_services/packages/frontend/chargebot-webapp/src/app/page.tsx\",\n        lineNumber: 24,\n        columnNumber: 5\n    }, this);\n}\n_c = App;\n/* harmony default export */ __webpack_exports__[\"default\"] = (App);\nvar _c;\n$RefreshReg$(_c, \"App\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvcGFnZS50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxpRkFBaUY7QUFDakYsb0ZBQW9GOztBQUc5QztBQUNnQjtBQUNaO0FBQ1k7QUFDbEI7SUFPbEJJO0FBTGxCSix1REFBT0EsQ0FBQ0ssU0FBUyxDQUFDO0lBQ2hCLEdBQUdILHVEQUFVO0lBQ2JJLEtBQUs7UUFDSEMsTUFBTTtZQUNKQyxXQUFXO2dCQUNUQyxVQUFVTCxDQUFBQSxtQ0FBQUEsd0RBQStCLGNBQS9CQSw4Q0FBQUEsbUNBQW1DO1lBQy9DO1FBQ0Y7SUFDRjtBQUNGO0FBRU8sU0FBU1E7SUFDZCxxQkFDRSw4REFBQ0M7UUFBSUMsV0FBVTtrQkFDYiw0RUFBQ2IsZ0VBQWFBO1lBQUNjLFlBQVk7WUFBTUQsV0FBVTtzQkFDekMsNEVBQUNYLDZDQUFJQTs7Ozs7Ozs7Ozs7Ozs7O0FBSWI7S0FSZ0JTO0FBU2hCLCtEQUFlQSxHQUFHQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9hcHAvcGFnZS50c3g/ZjY4YSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBbXBsaWZ5IFVJIGNvbXBvbmVudHMgYXJlIGludGVyYWN0aXZlIGFuZCBkZXNpZ25lZCB0byB3b3JrIG9uIHRoZSBjbGllbnQgc2lkZS5cbi8vIFRvIHVzZSB0aGVtIGluc2lkZSBvZiBTZXJ2ZXIgQ29tcG9uZW50cyB5b3UgbXVzdCB3cmFwIHRoZW0gaW4gYSBDbGllbnQgQ29tcG9uZW50IFxuJ3VzZSBjbGllbnQnO1xuXG5pbXBvcnQgeyBBbXBsaWZ5IH0gZnJvbSBcImF3cy1hbXBsaWZ5XCI7XG5pbXBvcnQgeyBBdXRoZW50aWNhdG9yIH0gZnJvbSAnQGF3cy1hbXBsaWZ5L3VpLXJlYWN0JztcbmltcG9ydCAnQGF3cy1hbXBsaWZ5L3VpLXJlYWN0L3N0eWxlcy5jc3MnO1xuaW1wb3J0IGF3c2NvbmZpZ3MgZnJvbSAnLi4vYW1wbGlmeWNvbmZpZ3VyYXRpb24uanNvbic7XG5pbXBvcnQgeyBIb21lIH0gZnJvbSAnLi9wYWdlcy9ob21lJztcblxuQW1wbGlmeS5jb25maWd1cmUoe1xuICAuLi5hd3Njb25maWdzLFxuICBBUEk6IHtcbiAgICBSRVNUOiB7XG4gICAgICBjaGFyZ2Vib3Q6IHtcbiAgICAgICAgZW5kcG9pbnQ6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0FQSV9VUkwgPz8gXCJcIixcbiAgICAgIH1cbiAgICB9XG4gIH0sXG59KVxuXG5leHBvcnQgZnVuY3Rpb24gQXBwKCkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBiZy1ncmF5LTcwMCBwLTMgYWxpZ24tbWlkZGxlIHctZnVsbCBoLXNjcmVlblwiPlxuICAgICAgPEF1dGhlbnRpY2F0b3IgaGlkZVNpZ25VcD17dHJ1ZX0gY2xhc3NOYW1lPVwibWF4LXctZml0IG0tYXV0byBiZy1vcmFuZ2UtNTAwIHJvdW5kZWQtbWRcIj5cbiAgICAgICAgPEhvbWUgLz5cbiAgICAgIDwvQXV0aGVudGljYXRvcj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbmV4cG9ydCBkZWZhdWx0IEFwcDsiXSwibmFtZXMiOlsiQW1wbGlmeSIsIkF1dGhlbnRpY2F0b3IiLCJhd3Njb25maWdzIiwiSG9tZSIsInByb2Nlc3MiLCJjb25maWd1cmUiLCJBUEkiLCJSRVNUIiwiY2hhcmdlYm90IiwiZW5kcG9pbnQiLCJlbnYiLCJORVhUX1BVQkxJQ19BUElfVVJMIiwiQXBwIiwiZGl2IiwiY2xhc3NOYW1lIiwiaGlkZVNpZ25VcCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/page.tsx\n"));

/***/ }),

/***/ "(app-pages-browser)/./src/app/pages/home/index.tsx":
/*!**************************************!*\
  !*** ./src/app/pages/home/index.tsx ***!
  \**************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ })

});