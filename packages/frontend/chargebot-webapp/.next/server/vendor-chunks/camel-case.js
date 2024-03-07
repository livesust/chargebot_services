"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/camel-case";
exports.ids = ["vendor-chunks/camel-case"];
exports.modules = {

/***/ "(ssr)/./node_modules/camel-case/dist.es2015/index.js":
/*!******************************************************!*\
  !*** ./node_modules/camel-case/dist.es2015/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   camelCase: () => (/* binding */ camelCase),\n/* harmony export */   camelCaseTransform: () => (/* binding */ camelCaseTransform),\n/* harmony export */   camelCaseTransformMerge: () => (/* binding */ camelCaseTransformMerge)\n/* harmony export */ });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ \"(ssr)/./node_modules/tslib/tslib.es6.mjs\");\n/* harmony import */ var pascal_case__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pascal-case */ \"(ssr)/./node_modules/pascal-case/dist.es2015/index.js\");\n\n\nfunction camelCaseTransform(input, index) {\n    if (index === 0) return input.toLowerCase();\n    return (0,pascal_case__WEBPACK_IMPORTED_MODULE_0__.pascalCaseTransform)(input, index);\n}\nfunction camelCaseTransformMerge(input, index) {\n    if (index === 0) return input.toLowerCase();\n    return (0,pascal_case__WEBPACK_IMPORTED_MODULE_0__.pascalCaseTransformMerge)(input);\n}\nfunction camelCase(input, options) {\n    if (options === void 0) {\n        options = {};\n    }\n    return (0,pascal_case__WEBPACK_IMPORTED_MODULE_0__.pascalCase)(input, (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({\n        transform: camelCaseTransform\n    }, options));\n} //# sourceMappingURL=index.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvY2FtZWwtY2FzZS9kaXN0LmVzMjAxNS9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFpQztBQUN3RDtBQUNsRixTQUFTSSxtQkFBbUJDLEtBQUssRUFBRUMsS0FBSztJQUMzQyxJQUFJQSxVQUFVLEdBQ1YsT0FBT0QsTUFBTUUsV0FBVztJQUM1QixPQUFPTCxnRUFBbUJBLENBQUNHLE9BQU9DO0FBQ3RDO0FBQ08sU0FBU0Usd0JBQXdCSCxLQUFLLEVBQUVDLEtBQUs7SUFDaEQsSUFBSUEsVUFBVSxHQUNWLE9BQU9ELE1BQU1FLFdBQVc7SUFDNUIsT0FBT0oscUVBQXdCQSxDQUFDRTtBQUNwQztBQUNPLFNBQVNJLFVBQVVKLEtBQUssRUFBRUssT0FBTztJQUNwQyxJQUFJQSxZQUFZLEtBQUssR0FBRztRQUFFQSxVQUFVLENBQUM7SUFBRztJQUN4QyxPQUFPVCx1REFBVUEsQ0FBQ0ksT0FBT0wsK0NBQVFBLENBQUM7UUFBRVcsV0FBV1A7SUFBbUIsR0FBR007QUFDekUsRUFDQSxpQ0FBaUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaGFyZ2Vib3Qtd2ViYXBwLy4vbm9kZV9tb2R1bGVzL2NhbWVsLWNhc2UvZGlzdC5lczIwMTUvaW5kZXguanM/NzgyOCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBfX2Fzc2lnbiB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgcGFzY2FsQ2FzZSwgcGFzY2FsQ2FzZVRyYW5zZm9ybSwgcGFzY2FsQ2FzZVRyYW5zZm9ybU1lcmdlLCB9IGZyb20gXCJwYXNjYWwtY2FzZVwiO1xuZXhwb3J0IGZ1bmN0aW9uIGNhbWVsQ2FzZVRyYW5zZm9ybShpbnB1dCwgaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPT09IDApXG4gICAgICAgIHJldHVybiBpbnB1dC50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBwYXNjYWxDYXNlVHJhbnNmb3JtKGlucHV0LCBpbmRleCk7XG59XG5leHBvcnQgZnVuY3Rpb24gY2FtZWxDYXNlVHJhbnNmb3JtTWVyZ2UoaW5wdXQsIGluZGV4KSB7XG4gICAgaWYgKGluZGV4ID09PSAwKVxuICAgICAgICByZXR1cm4gaW5wdXQudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gcGFzY2FsQ2FzZVRyYW5zZm9ybU1lcmdlKGlucHV0KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjYW1lbENhc2UoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHJldHVybiBwYXNjYWxDYXNlKGlucHV0LCBfX2Fzc2lnbih7IHRyYW5zZm9ybTogY2FtZWxDYXNlVHJhbnNmb3JtIH0sIG9wdGlvbnMpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCJdLCJuYW1lcyI6WyJfX2Fzc2lnbiIsInBhc2NhbENhc2UiLCJwYXNjYWxDYXNlVHJhbnNmb3JtIiwicGFzY2FsQ2FzZVRyYW5zZm9ybU1lcmdlIiwiY2FtZWxDYXNlVHJhbnNmb3JtIiwiaW5wdXQiLCJpbmRleCIsInRvTG93ZXJDYXNlIiwiY2FtZWxDYXNlVHJhbnNmb3JtTWVyZ2UiLCJjYW1lbENhc2UiLCJvcHRpb25zIiwidHJhbnNmb3JtIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/camel-case/dist.es2015/index.js\n");

/***/ })

};
;