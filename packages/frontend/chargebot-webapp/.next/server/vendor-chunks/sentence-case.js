"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/sentence-case";
exports.ids = ["vendor-chunks/sentence-case"];
exports.modules = {

/***/ "(ssr)/./node_modules/sentence-case/dist.es2015/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/sentence-case/dist.es2015/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   sentenceCase: () => (/* binding */ sentenceCase),\n/* harmony export */   sentenceCaseTransform: () => (/* binding */ sentenceCaseTransform)\n/* harmony export */ });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ \"(ssr)/./node_modules/tslib/tslib.es6.mjs\");\n/* harmony import */ var no_case__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! no-case */ \"(ssr)/./node_modules/no-case/dist.es2015/index.js\");\n/* harmony import */ var upper_case_first__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! upper-case-first */ \"(ssr)/./node_modules/upper-case-first/dist.es2015/index.js\");\n\n\n\nfunction sentenceCaseTransform(input, index) {\n    var result = input.toLowerCase();\n    if (index === 0) return (0,upper_case_first__WEBPACK_IMPORTED_MODULE_0__.upperCaseFirst)(result);\n    return result;\n}\nfunction sentenceCase(input, options) {\n    if (options === void 0) {\n        options = {};\n    }\n    return (0,no_case__WEBPACK_IMPORTED_MODULE_1__.noCase)(input, (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__assign)({\n        delimiter: \" \",\n        transform: sentenceCaseTransform\n    }, options));\n} //# sourceMappingURL=index.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvc2VudGVuY2UtY2FzZS9kaXN0LmVzMjAxNS9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFpQztBQUNBO0FBQ2lCO0FBQzNDLFNBQVNHLHNCQUFzQkMsS0FBSyxFQUFFQyxLQUFLO0lBQzlDLElBQUlDLFNBQVNGLE1BQU1HLFdBQVc7SUFDOUIsSUFBSUYsVUFBVSxHQUNWLE9BQU9ILGdFQUFjQSxDQUFDSTtJQUMxQixPQUFPQTtBQUNYO0FBQ08sU0FBU0UsYUFBYUosS0FBSyxFQUFFSyxPQUFPO0lBQ3ZDLElBQUlBLFlBQVksS0FBSyxHQUFHO1FBQUVBLFVBQVUsQ0FBQztJQUFHO0lBQ3hDLE9BQU9SLCtDQUFNQSxDQUFDRyxPQUFPSiwrQ0FBUUEsQ0FBQztRQUFFVSxXQUFXO1FBQUtDLFdBQVdSO0lBQXNCLEdBQUdNO0FBQ3hGLEVBQ0EsaUNBQWlDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hhcmdlYm90LXdlYmFwcC8uL25vZGVfbW9kdWxlcy9zZW50ZW5jZS1jYXNlL2Rpc3QuZXMyMDE1L2luZGV4LmpzPzRmNzYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgX19hc3NpZ24gfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IG5vQ2FzZSB9IGZyb20gXCJuby1jYXNlXCI7XG5pbXBvcnQgeyB1cHBlckNhc2VGaXJzdCB9IGZyb20gXCJ1cHBlci1jYXNlLWZpcnN0XCI7XG5leHBvcnQgZnVuY3Rpb24gc2VudGVuY2VDYXNlVHJhbnNmb3JtKGlucHV0LCBpbmRleCkge1xuICAgIHZhciByZXN1bHQgPSBpbnB1dC50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChpbmRleCA9PT0gMClcbiAgICAgICAgcmV0dXJuIHVwcGVyQ2FzZUZpcnN0KHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZW50ZW5jZUNhc2UoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHJldHVybiBub0Nhc2UoaW5wdXQsIF9fYXNzaWduKHsgZGVsaW1pdGVyOiBcIiBcIiwgdHJhbnNmb3JtOiBzZW50ZW5jZUNhc2VUcmFuc2Zvcm0gfSwgb3B0aW9ucykpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl0sIm5hbWVzIjpbIl9fYXNzaWduIiwibm9DYXNlIiwidXBwZXJDYXNlRmlyc3QiLCJzZW50ZW5jZUNhc2VUcmFuc2Zvcm0iLCJpbnB1dCIsImluZGV4IiwicmVzdWx0IiwidG9Mb3dlckNhc2UiLCJzZW50ZW5jZUNhc2UiLCJvcHRpb25zIiwiZGVsaW1pdGVyIiwidHJhbnNmb3JtIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/sentence-case/dist.es2015/index.js\n");

/***/ })

};
;