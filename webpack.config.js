const path = require("path");
const webpack = require("webpack");
const injectPlugin = require('webpack-inject-plugin').default;
const entryOrder = require('webpack-inject-plugin').ENTRY_ORDER


module.exports = {
  entry: {
    index: path.resolve(__dirname, "js/index.js"),
    fullToolkit: path.resolve(__dirname, "js/fullToolkit.js"),
    toolpage: path.resolve(__dirname, "js/toolpage.js"),
    wordcloud: path.resolve(__dirname, "js/wordcloud.js")
  },
  output: {
    path: path.resolve(__dirname, "build/ie"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    ie: "11"
                  },
                  useBuiltIns: "usage",
                  corejs: { version: 3, proposals: true }
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      fetch: ["whatwg-fetch", "fetch"]
    }),
    new injectPlugin(function() {
      // injectPlugin expects a string. See reusable components --> IE Polyfills for expanded code with comments
      return 'var svgChildrenPolyfill=function(e){e&&e.prototype&&null==e.prototype.children&&Object.defineProperty(e.prototype,"children",{get:function(){for(var e,t=0,o=this.childNodes,n=[];e=o[t++];)1===e.nodeType&&n.push(e);return n}})};svgChildrenPolyfill(window.Node||window.Element),"classList"in SVGElement.prototype||Object.defineProperty(SVGElement.prototype,"classList",{get:function(){var e=this;return{contains:function(t){return-1!==e.className.baseVal.split(" ").indexOf(t)},add:function(t){if(!e.classList.contains(t))return e.setAttribute("class",e.getAttribute("class")+" "+t)},remove:function(t){if(e.classList.contains(t)){var o=new RegExp("(^| )"+t+"($| )","gi"),n=e.getAttribute("class").replace(o," ");e.setAttribute("class",n)}},toggle:function(e){this.contains(e)?this.remove(e):this.add(e)}}}});var removeNodePolyfill=function(e){e.forEach(function(e){e.hasOwnProperty("remove")||Object.defineProperty(e,"remove",{configurable:!0,enumerable:!0,writable:!0,value:function(){null!==this.parentNode&&this.parentNode.removeChild(this)}})})};removeNodePolyfill([Element.prototype,CharacterData.prototype,DocumentType.prototype]);'
    }, {
      entryOrder: entryOrder.First
    }
    )
  ]
};
