"use strict";
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

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Auth: function() { return /* binding */ Auth; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var aws_amplify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! aws-amplify */ \"(app-pages-browser)/./node_modules/aws-amplify/dist/esm/initSingleton.mjs\");\n/* harmony import */ var aws_amplify_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! aws-amplify/auth */ \"(app-pages-browser)/./node_modules/@aws-amplify/auth/dist/esm/providers/cognito/apis/signIn.mjs\");\n// Amplify UI components are interactive and designed to work on the client side.\n// To use them inside of Server Components you must wrap them in a Client Component \n/* __next_internal_client_entry_do_not_use__ Auth,default auto */ \n\nvar _process_env_NEXT_PUBLIC_USER_POOL_CLIENT_ID, _process_env_NEXT_PUBLIC_USER_POOL_ID, _process_env_NEXT_PUBLIC_USER_POOL_ENDPOINT, _process_env_NEXT_PUBLIC_OAUTH_DOMAIN, _process_env_NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_IN, _process_env_NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_OUT, _process_env_NEXT_PUBLIC_API_URL;\naws_amplify__WEBPACK_IMPORTED_MODULE_1__.DefaultAmplify.configure({\n    Auth: {\n        Cognito: {\n            userPoolClientId: (_process_env_NEXT_PUBLIC_USER_POOL_CLIENT_ID = \"1un6c5uu0qu7p2dq2oa787tu0c\") !== null && _process_env_NEXT_PUBLIC_USER_POOL_CLIENT_ID !== void 0 ? _process_env_NEXT_PUBLIC_USER_POOL_CLIENT_ID : \"\",\n            userPoolId: (_process_env_NEXT_PUBLIC_USER_POOL_ID = \"us-east-1_MCV5noPaK\") !== null && _process_env_NEXT_PUBLIC_USER_POOL_ID !== void 0 ? _process_env_NEXT_PUBLIC_USER_POOL_ID : \"\",\n            userPoolEndpoint: (_process_env_NEXT_PUBLIC_USER_POOL_ENDPOINT = \"https://chargebotdev.auth.us-east-1.amazoncognito.com\") !== null && _process_env_NEXT_PUBLIC_USER_POOL_ENDPOINT !== void 0 ? _process_env_NEXT_PUBLIC_USER_POOL_ENDPOINT : \"\",\n            loginWith: {\n                oauth: {\n                    domain: (_process_env_NEXT_PUBLIC_OAUTH_DOMAIN = \"chargebotdev.auth.us-east-1.amazoncognito.com\") !== null && _process_env_NEXT_PUBLIC_OAUTH_DOMAIN !== void 0 ? _process_env_NEXT_PUBLIC_OAUTH_DOMAIN : \"\",\n                    scopes: [\n                        \"email openid\"\n                    ],\n                    redirectSignIn: [\n                        (_process_env_NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_IN = \"https://chargebotdev.sust.pro\") !== null && _process_env_NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_IN !== void 0 ? _process_env_NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_IN : \"\"\n                    ],\n                    redirectSignOut: [\n                        (_process_env_NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_OUT = \"https://chargebotdev.sust.pro/login\") !== null && _process_env_NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_OUT !== void 0 ? _process_env_NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_OUT : \"\"\n                    ],\n                    responseType: \"code\"\n                },\n                email: true\n            },\n            mfa: {\n                status: \"off\"\n            },\n            passwordFormat: {\n                minLength: 8,\n                requireLowercase: true,\n                requireNumbers: true,\n                requireSpecialCharacters: true,\n                requireUppercase: true\n            }\n        }\n    },\n    API: {\n        REST: {\n            chargebot: {\n                endpoint: (_process_env_NEXT_PUBLIC_API_URL = \"https://6ykkwrugp8.execute-api.us-east-1.amazonaws.com\") !== null && _process_env_NEXT_PUBLIC_API_URL !== void 0 ? _process_env_NEXT_PUBLIC_API_URL : \"\"\n            }\n        }\n    }\n});\nconsole.log(\"AWS CONFIG\", aws_amplify__WEBPACK_IMPORTED_MODULE_1__.DefaultAmplify.getConfig());\n\nconst handleSignIn = async ()=>{\n    try {\n        const result = await (0,aws_amplify_auth__WEBPACK_IMPORTED_MODULE_2__.signIn)({\n            username: \"daniel.brutti@livesust.com\",\n            password: \"#GreenPlanet2022\"\n        });\n        console.log(\"Login Result\", result);\n    } catch (error) {\n        console.log(error);\n    }\n};\nfunction Auth() {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                children: \"Hello\"\n            }, void 0, false, {\n                fileName: \"/home/daniel/workspace/sust/chargebot/chargebot_services/packages/frontend/chargebot-webapp/src/app/page.tsx\",\n                lineNumber: 62,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                onClick: handleSignIn,\n                children: \"Sign In\"\n            }, void 0, false, {\n                fileName: \"/home/daniel/workspace/sust/chargebot/chargebot_services/packages/frontend/chargebot-webapp/src/app/page.tsx\",\n                lineNumber: 63,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n_c = Auth;\n/* harmony default export */ __webpack_exports__[\"default\"] = (Auth);\nvar _c;\n$RefreshReg$(_c, \"Auth\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvcGFnZS50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLGlGQUFpRjtBQUNqRixvRkFBb0Y7O0FBRzlDO0lBS2RDLDhDQUNOQSx1Q0FDTUEsNkNBR05BLHVDQUVTQSxpREFDQ0Esa0RBb0JWQTtBQS9CbEJELHVEQUFPQSxDQUFDRSxTQUFTLENBQUM7SUFDaEJDLE1BQU07UUFDSkMsU0FBUztZQUNQQyxrQkFBa0JKLENBQUFBLCtDQUFBQSw0QkFBMkMsY0FBM0NBLDBEQUFBQSwrQ0FBK0M7WUFDakVPLFlBQVlQLENBQUFBLHdDQUFBQSxxQkFBb0MsY0FBcENBLG1EQUFBQSx3Q0FBd0M7WUFDcERTLGtCQUFrQlQsQ0FBQUEsOENBQUFBLHVEQUEwQyxjQUExQ0EseURBQUFBLDhDQUE4QztZQUNoRVcsV0FBVztnQkFDVEMsT0FBTztvQkFDTEMsUUFBUWIsQ0FBQUEsd0NBQUFBLCtDQUFvQyxjQUFwQ0EsbURBQUFBLHdDQUF3QztvQkFDaERlLFFBQVE7d0JBQUM7cUJBQWU7b0JBQ3hCQyxnQkFBZ0I7d0JBQUNoQixDQUFBQSxrREFBQUEsK0JBQThDLGNBQTlDQSw2REFBQUEsa0RBQWtEO3FCQUFHO29CQUN0RWtCLGlCQUFpQjt3QkFBQ2xCLENBQUFBLG1EQUFBQSxxQ0FBK0MsY0FBL0NBLDhEQUFBQSxtREFBbUQ7cUJBQUc7b0JBQ3hFb0IsY0FBYztnQkFDaEI7Z0JBQ0FDLE9BQU87WUFDVDtZQUNBQyxLQUFLO2dCQUNIQyxRQUFRO1lBQ1Y7WUFDQUMsZ0JBQWdCO2dCQUNkQyxXQUFXO2dCQUNYQyxrQkFBa0I7Z0JBQ2xCQyxnQkFBZ0I7Z0JBQ2hCQywwQkFBMEI7Z0JBQzFCQyxrQkFBa0I7WUFDcEI7UUFDRjtJQUNGO0lBQ0FDLEtBQUs7UUFDSEMsTUFBTTtZQUNKQyxXQUFXO2dCQUNUQyxVQUFVakMsQ0FBQUEsbUNBQUFBLHdEQUErQixjQUEvQkEsOENBQUFBLG1DQUFtQztZQUMvQztRQUNGO0lBQ0Y7QUFDRjtBQUVBbUMsUUFBUUMsR0FBRyxDQUFDLGNBQWNyQyx1REFBT0EsQ0FBQ3NDLFNBQVM7QUFDRDtBQUUxQyxNQUFNRSxlQUFlO0lBQ25CLElBQUk7UUFDRixNQUFNQyxTQUFTLE1BQU1GLHdEQUFNQSxDQUFDO1lBQzFCRyxVQUFVO1lBQ1ZDLFVBQVU7UUFDWjtRQUNBUCxRQUFRQyxHQUFHLENBQUMsZ0JBQWdCSTtJQUM5QixFQUFFLE9BQU9HLE9BQU87UUFDZFIsUUFBUUMsR0FBRyxDQUFDTztJQUNkO0FBQ0Y7QUFFTyxTQUFTekM7SUFDZCxxQkFDRTs7MEJBQ0UsOERBQUMwQzswQkFBRzs7Ozs7OzBCQUNKLDhEQUFDQztnQkFBT0MsU0FBU1A7MEJBQWM7Ozs7Ozs7O0FBR3JDO0tBUGdCckM7QUFTaEIsK0RBQWVBLElBQUlBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2FwcC9wYWdlLnRzeD9mNjhhIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEFtcGxpZnkgVUkgY29tcG9uZW50cyBhcmUgaW50ZXJhY3RpdmUgYW5kIGRlc2lnbmVkIHRvIHdvcmsgb24gdGhlIGNsaWVudCBzaWRlLlxuLy8gVG8gdXNlIHRoZW0gaW5zaWRlIG9mIFNlcnZlciBDb21wb25lbnRzIHlvdSBtdXN0IHdyYXAgdGhlbSBpbiBhIENsaWVudCBDb21wb25lbnQgXG4ndXNlIGNsaWVudCc7XG5cbmltcG9ydCB7IEFtcGxpZnkgfSBmcm9tIFwiYXdzLWFtcGxpZnlcIjtcblxuQW1wbGlmeS5jb25maWd1cmUoe1xuICBBdXRoOiB7XG4gICAgQ29nbml0bzoge1xuICAgICAgdXNlclBvb2xDbGllbnRJZDogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfVVNFUl9QT09MX0NMSUVOVF9JRCA/PyBcIlwiLFxuICAgICAgdXNlclBvb2xJZDogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfVVNFUl9QT09MX0lEID8/IFwiXCIsXG4gICAgICB1c2VyUG9vbEVuZHBvaW50OiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19VU0VSX1BPT0xfRU5EUE9JTlQgPz8gXCJcIixcbiAgICAgIGxvZ2luV2l0aDoge1xuICAgICAgICBvYXV0aDoge1xuICAgICAgICAgIGRvbWFpbjogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfT0FVVEhfRE9NQUlOID8/IFwiXCIsXG4gICAgICAgICAgc2NvcGVzOiBbJ2VtYWlsIG9wZW5pZCddLFxuICAgICAgICAgIHJlZGlyZWN0U2lnbkluOiBbcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfT0FVVEhfUkVESVJFQ1RfU0lHTl9JTiA/PyBcIlwiXSxcbiAgICAgICAgICByZWRpcmVjdFNpZ25PdXQ6IFtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19PQVVUSF9SRURJUkVDVF9TSUdOX09VVCA/PyBcIlwiXSxcbiAgICAgICAgICByZXNwb25zZVR5cGU6ICdjb2RlJyxcbiAgICAgICAgfSxcbiAgICAgICAgZW1haWw6IHRydWUsXG4gICAgICB9LFxuICAgICAgbWZhOiB7XG4gICAgICAgIHN0YXR1czogJ29mZidcbiAgICAgIH0sXG4gICAgICBwYXNzd29yZEZvcm1hdDoge1xuICAgICAgICBtaW5MZW5ndGg6IDgsXG4gICAgICAgIHJlcXVpcmVMb3dlcmNhc2U6IHRydWUsXG4gICAgICAgIHJlcXVpcmVOdW1iZXJzOiB0cnVlLFxuICAgICAgICByZXF1aXJlU3BlY2lhbENoYXJhY3RlcnM6IHRydWUsXG4gICAgICAgIHJlcXVpcmVVcHBlcmNhc2U6IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIEFQSToge1xuICAgIFJFU1Q6IHtcbiAgICAgIGNoYXJnZWJvdDoge1xuICAgICAgICBlbmRwb2ludDogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1VSTCA/PyBcIlwiLFxuICAgICAgfVxuICAgIH1cbiAgfSxcbn0pXG5cbmNvbnNvbGUubG9nKCdBV1MgQ09ORklHJywgQW1wbGlmeS5nZXRDb25maWcoKSk7XG5pbXBvcnQgeyBzaWduSW4gfSBmcm9tICdhd3MtYW1wbGlmeS9hdXRoJztcblxuY29uc3QgaGFuZGxlU2lnbkluID0gYXN5bmMgKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNpZ25Jbih7XG4gICAgICB1c2VybmFtZTogJ2RhbmllbC5icnV0dGlAbGl2ZXN1c3QuY29tJyxcbiAgICAgIHBhc3N3b3JkOiAnI0dyZWVuUGxhbmV0MjAyMicsXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coJ0xvZ2luIFJlc3VsdCcsIHJlc3VsdCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5sb2coZXJyb3IpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEF1dGgoKSB7XG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxoMT5IZWxsbzwvaDE+XG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9e2hhbmRsZVNpZ25Jbn0+U2lnbiBJbjwvYnV0dG9uPlxuICAgIDwvPlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBBdXRoO1xuIl0sIm5hbWVzIjpbIkFtcGxpZnkiLCJwcm9jZXNzIiwiY29uZmlndXJlIiwiQXV0aCIsIkNvZ25pdG8iLCJ1c2VyUG9vbENsaWVudElkIiwiZW52IiwiTkVYVF9QVUJMSUNfVVNFUl9QT09MX0NMSUVOVF9JRCIsInVzZXJQb29sSWQiLCJORVhUX1BVQkxJQ19VU0VSX1BPT0xfSUQiLCJ1c2VyUG9vbEVuZHBvaW50IiwiTkVYVF9QVUJMSUNfVVNFUl9QT09MX0VORFBPSU5UIiwibG9naW5XaXRoIiwib2F1dGgiLCJkb21haW4iLCJORVhUX1BVQkxJQ19PQVVUSF9ET01BSU4iLCJzY29wZXMiLCJyZWRpcmVjdFNpZ25JbiIsIk5FWFRfUFVCTElDX09BVVRIX1JFRElSRUNUX1NJR05fSU4iLCJyZWRpcmVjdFNpZ25PdXQiLCJORVhUX1BVQkxJQ19PQVVUSF9SRURJUkVDVF9TSUdOX09VVCIsInJlc3BvbnNlVHlwZSIsImVtYWlsIiwibWZhIiwic3RhdHVzIiwicGFzc3dvcmRGb3JtYXQiLCJtaW5MZW5ndGgiLCJyZXF1aXJlTG93ZXJjYXNlIiwicmVxdWlyZU51bWJlcnMiLCJyZXF1aXJlU3BlY2lhbENoYXJhY3RlcnMiLCJyZXF1aXJlVXBwZXJjYXNlIiwiQVBJIiwiUkVTVCIsImNoYXJnZWJvdCIsImVuZHBvaW50IiwiTkVYVF9QVUJMSUNfQVBJX1VSTCIsImNvbnNvbGUiLCJsb2ciLCJnZXRDb25maWciLCJzaWduSW4iLCJoYW5kbGVTaWduSW4iLCJyZXN1bHQiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiZXJyb3IiLCJoMSIsImJ1dHRvbiIsIm9uQ2xpY2siXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/page.tsx\n"));

/***/ })

});