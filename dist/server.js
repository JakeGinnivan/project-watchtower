require("source-map-support").install(),function(l){function o(r){if(e[r])return e[r].exports;var n=e[r]={i:r,l:!1,exports:{}};return l[r].call(n.exports,n,n.exports,o),n.l=!0,n.exports}var e={};o.m=l,o.c=e,o.d=function(l,e,r){o.o(l,e)||Object.defineProperty(l,e,{configurable:!1,enumerable:!0,get:r})},o.n=function(l){var e=l&&l.__esModule?function(){return l.default}:function(){return l};return o.d(e,"a",e),e},o.o=function(l,o){return Object.prototype.hasOwnProperty.call(l,o)},o.p="/",o(o.s=0)}([function(l,o,e){l.exports=e(1)},function(l,o,e){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var r=e(2),n=(e.n(r),parseInt(process.env.PORT||"3000",10)),t=r();t.get("*",function(l,o){o.status(200).send("<!DOCTYPE html>\n<html>\n<head>\n    <title>Test</title>\n</head>\n<body>\n<p>\nhello world hello world hello world hello world hello world hello world hello world\nhello world hello world hello world hello world hello world hello world hello world\nhello world hello world hello world hello world hello world hello world hello world\n</p>\n</body>\n</html>")}),t.listen(n,function(){console.log("Server listening on port "+n)})},function(l,o){l.exports=require("express")}]);
//# sourceMappingURL=server.js.map