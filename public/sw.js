if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,i)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const r=e=>n(e,c),d={module:{uri:c},exports:t,require:r};s[c]=Promise.all(a.map((e=>d[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-7028bf80"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/111-633dc212bfb10e2d.js",revision:"633dc212bfb10e2d"},{url:"/_next/static/chunks/185-6043682450ea6d6d.js",revision:"6043682450ea6d6d"},{url:"/_next/static/chunks/354-6f0fe209452c3722.js",revision:"6f0fe209452c3722"},{url:"/_next/static/chunks/369-a75a1d56f429bdf3.js",revision:"a75a1d56f429bdf3"},{url:"/_next/static/chunks/407-397ef33f6c4720f6.js",revision:"397ef33f6c4720f6"},{url:"/_next/static/chunks/440-c463001342b244a7.js",revision:"c463001342b244a7"},{url:"/_next/static/chunks/4f041c27-9292e9b7a6db50b5.js",revision:"9292e9b7a6db50b5"},{url:"/_next/static/chunks/5976154f-42cbb44f782b250c.js",revision:"42cbb44f782b250c"},{url:"/_next/static/chunks/653-e90f99d2a57de20f.js",revision:"e90f99d2a57de20f"},{url:"/_next/static/chunks/691-e4baba09daf77990.js",revision:"e4baba09daf77990"},{url:"/_next/static/chunks/829-47041f9da45a1a8b.js",revision:"47041f9da45a1a8b"},{url:"/_next/static/chunks/9-91dbbe50c01f95c8.js",revision:"91dbbe50c01f95c8"},{url:"/_next/static/chunks/945-65f1efd8164f987b.js",revision:"65f1efd8164f987b"},{url:"/_next/static/chunks/c4890102-c3d5a67417de5198.js",revision:"c3d5a67417de5198"},{url:"/_next/static/chunks/framework-b3ca2e9a9574e304.js",revision:"b3ca2e9a9574e304"},{url:"/_next/static/chunks/main-22409175f1ddefae.js",revision:"22409175f1ddefae"},{url:"/_next/static/chunks/pages/%5BtableName%5D-e1d8ded2d67b6728.js",revision:"e1d8ded2d67b6728"},{url:"/_next/static/chunks/pages/_app-85be57ecadb20809.js",revision:"85be57ecadb20809"},{url:"/_next/static/chunks/pages/_error-b5a83d78c78e1f32.js",revision:"b5a83d78c78e1f32"},{url:"/_next/static/chunks/pages/address/%5Baddress%5D-9bd7a4ebd6f31136.js",revision:"9bd7a4ebd6f31136"},{url:"/_next/static/chunks/pages/index-b3273048b8d979f3.js",revision:"b3273048b8d979f3"},{url:"/_next/static/chunks/pages/interactive-b5316352b760df6b.js",revision:"b5316352b760df6b"},{url:"/_next/static/chunks/pages/rig/%5BrigId%5D-bd0401703243d9ad.js",revision:"bd0401703243d9ad"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-00d2950bc49d6bc5.js",revision:"00d2950bc49d6bc5"},{url:"/_next/static/css/8e41c20169a3ce57.css",revision:"8e41c20169a3ce57"},{url:"/_next/static/media/.54662e50",revision:"54662e50"},{url:"/_next/static/media/main.cd51a4b6.wasm",revision:"cd51a4b6"},{url:"/_next/static/pasB_TCVhFaID2zIJfeIu/_buildManifest.js",revision:"93d8252c58427a9e9d7b400119c044f2"},{url:"/_next/static/pasB_TCVhFaID2zIJfeIu/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/favicon.svg",revision:"d357a3ff2c30636c98d305ea5cd9b698"},{url:"/icons.js",revision:"9a923f23411592c05c39af11d4564455"},{url:"/icons/icon-128x128.png",revision:"84fce6c70583ab1d66525a45b45867cc"},{url:"/icons/icon-144x144.png",revision:"7983c0b3a93c6ab57a070f93efcb0c51"},{url:"/icons/icon-152x152.png",revision:"fb2bdfd6a4cd5d3b089b4bf006999a84"},{url:"/icons/icon-192x192.png",revision:"00e430aa21d38fdf3bc45e1975c19bd2"},{url:"/icons/icon-384x384.png",revision:"0f97b08694332522a9a6dc3192bcd0a3"},{url:"/icons/icon-512x512.png",revision:"a0b445785240e460a46ea4793a30edaf"},{url:"/icons/icon-72x72.png",revision:"661ba64f31f810e7a0cd310013b66610"},{url:"/icons/icon-96x96.png",revision:"7d3dc6ca2150839c396e4dc2fe3a1206"},{url:"/logo.svg",revision:"fc73ae42896021d77a8ca719c6efa6b4"},{url:"/manifest.json",revision:"e6fc414bcc4a4db27ddb748d0ae4c7a6"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));