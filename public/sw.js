if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const d=e=>c(e,n),r={module:{uri:n},exports:t,require:d};s[n]=Promise.all(a.map((e=>r[e]||d(e)))).then((e=>(i(...e),t)))}}define(["./workbox-7028bf80"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/DTxM6kPcUDHq-5s_XQtpB/_buildManifest.js",revision:"024d6042187fa90a3d1de38ed61bb684"},{url:"/_next/static/DTxM6kPcUDHq-5s_XQtpB/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1017.70512e1c78208bc6.js",revision:"70512e1c78208bc6"},{url:"/_next/static/chunks/116-b94daad57638c71d.js",revision:"b94daad57638c71d"},{url:"/_next/static/chunks/1287.ce9a69d756f9dbf2.js",revision:"ce9a69d756f9dbf2"},{url:"/_next/static/chunks/1299.480fdecb5c07263e.js",revision:"480fdecb5c07263e"},{url:"/_next/static/chunks/1369.9277cf27f4575fbd.js",revision:"9277cf27f4575fbd"},{url:"/_next/static/chunks/1674.dbf6cd42a84740e2.js",revision:"dbf6cd42a84740e2"},{url:"/_next/static/chunks/1789-59f49b3d0aee2ce9.js",revision:"59f49b3d0aee2ce9"},{url:"/_next/static/chunks/1888.614cb57c952bc02b.js",revision:"614cb57c952bc02b"},{url:"/_next/static/chunks/1913-8f1c7b16e30ec8a1.js",revision:"8f1c7b16e30ec8a1"},{url:"/_next/static/chunks/2307.5bf9496101a3e9bb.js",revision:"5bf9496101a3e9bb"},{url:"/_next/static/chunks/2549-dfff202f0147d922.js",revision:"dfff202f0147d922"},{url:"/_next/static/chunks/2579-56ad485810ee60fd.js",revision:"56ad485810ee60fd"},{url:"/_next/static/chunks/2663.d3066e700f25ce86.js",revision:"d3066e700f25ce86"},{url:"/_next/static/chunks/303.f7e510c5600aa6c4.js",revision:"f7e510c5600aa6c4"},{url:"/_next/static/chunks/3220.cf80cf195eb723b7.js",revision:"cf80cf195eb723b7"},{url:"/_next/static/chunks/332030a0-5e244a5baf09f288.js",revision:"5e244a5baf09f288"},{url:"/_next/static/chunks/3478.2716026faa3550bf.js",revision:"2716026faa3550bf"},{url:"/_next/static/chunks/355.9afbde2c79f54f74.js",revision:"9afbde2c79f54f74"},{url:"/_next/static/chunks/3735-96571269c2939f7e.js",revision:"96571269c2939f7e"},{url:"/_next/static/chunks/3766.475dd66393b4e311.js",revision:"475dd66393b4e311"},{url:"/_next/static/chunks/3860.e8b343dda554ed50.js",revision:"e8b343dda554ed50"},{url:"/_next/static/chunks/4164-f8d0a41dea76e266.js",revision:"f8d0a41dea76e266"},{url:"/_next/static/chunks/4211-e1e87886ef269d6b.js",revision:"e1e87886ef269d6b"},{url:"/_next/static/chunks/4589-28ac22b6d1751db1.js",revision:"28ac22b6d1751db1"},{url:"/_next/static/chunks/4643.f855c98286079234.js",revision:"f855c98286079234"},{url:"/_next/static/chunks/496.0b560816a45cf568.js",revision:"0b560816a45cf568"},{url:"/_next/static/chunks/4f041c27-7efd53d235a672e1.js",revision:"7efd53d235a672e1"},{url:"/_next/static/chunks/5046-02f1babad8c72271.js",revision:"02f1babad8c72271"},{url:"/_next/static/chunks/524.154cd8b53290bebd.js",revision:"154cd8b53290bebd"},{url:"/_next/static/chunks/5859-a05593ca77dc35cb.js",revision:"a05593ca77dc35cb"},{url:"/_next/static/chunks/6238.ebd070c452d20b5f.js",revision:"ebd070c452d20b5f"},{url:"/_next/static/chunks/6273.b00db2706598a380.js",revision:"b00db2706598a380"},{url:"/_next/static/chunks/6301.767b27d6528aa359.js",revision:"767b27d6528aa359"},{url:"/_next/static/chunks/6725.232e165a3e8840da.js",revision:"232e165a3e8840da"},{url:"/_next/static/chunks/7016.53324de029069098.js",revision:"53324de029069098"},{url:"/_next/static/chunks/7170.fddd2110d2a96f38.js",revision:"fddd2110d2a96f38"},{url:"/_next/static/chunks/7556a9d6-0e02c78b520f7364.js",revision:"0e02c78b520f7364"},{url:"/_next/static/chunks/7737-66b4b98c95c6dfa5.js",revision:"66b4b98c95c6dfa5"},{url:"/_next/static/chunks/7886-050681bdbbec9fc4.js",revision:"050681bdbbec9fc4"},{url:"/_next/static/chunks/7a7c95a0-2fb9f6811dc9b8b6.js",revision:"2fb9f6811dc9b8b6"},{url:"/_next/static/chunks/8263.fb2ba39e36a6179b.js",revision:"fb2ba39e36a6179b"},{url:"/_next/static/chunks/8488.673b79bae1405fb4.js",revision:"673b79bae1405fb4"},{url:"/_next/static/chunks/8542-a30d2fa92415f8ac.js",revision:"a30d2fa92415f8ac"},{url:"/_next/static/chunks/8588-9ac654724e9d85bb.js",revision:"9ac654724e9d85bb"},{url:"/_next/static/chunks/8777.041f0f7129db08ec.js",revision:"041f0f7129db08ec"},{url:"/_next/static/chunks/8928.d0bc91a043489b9f.js",revision:"d0bc91a043489b9f"},{url:"/_next/static/chunks/8983.51e99728ee542990.js",revision:"51e99728ee542990"},{url:"/_next/static/chunks/8988-ed0ae833078270ce.js",revision:"ed0ae833078270ce"},{url:"/_next/static/chunks/8e7ab092-57bff4aa0d812771.js",revision:"57bff4aa0d812771"},{url:"/_next/static/chunks/9074.b9158dcda494a91b.js",revision:"b9158dcda494a91b"},{url:"/_next/static/chunks/9092-2f048ac504b090db.js",revision:"2f048ac504b090db"},{url:"/_next/static/chunks/914d0b43-6eb7bcdffb936a52.js",revision:"6eb7bcdffb936a52"},{url:"/_next/static/chunks/9233a80c-6005fbd0c7eecc97.js",revision:"6005fbd0c7eecc97"},{url:"/_next/static/chunks/9499-9764fa047f65f8e7.js",revision:"9764fa047f65f8e7"},{url:"/_next/static/chunks/9506.8da4827f0053d6f1.js",revision:"8da4827f0053d6f1"},{url:"/_next/static/chunks/9581.dc495fb3bc325917.js",revision:"dc495fb3bc325917"},{url:"/_next/static/chunks/985.5eba68e106530036.js",revision:"5eba68e106530036"},{url:"/_next/static/chunks/9879.d1d84ab5e7ef1000.js",revision:"d1d84ab5e7ef1000"},{url:"/_next/static/chunks/9dc68651-8382d09ad9cc2e87.js",revision:"8382d09ad9cc2e87"},{url:"/_next/static/chunks/framework-2b8313eaddccee30.js",revision:"2b8313eaddccee30"},{url:"/_next/static/chunks/main-35dd864659a90515.js",revision:"35dd864659a90515"},{url:"/_next/static/chunks/pages/%5BtableName%5D-f2a66fbdbcf5fe4d.js",revision:"f2a66fbdbcf5fe4d"},{url:"/_next/static/chunks/pages/_app-09bc4d3af5909057.js",revision:"09bc4d3af5909057"},{url:"/_next/static/chunks/pages/_error-e1447fde43a50070.js",revision:"e1447fde43a50070"},{url:"/_next/static/chunks/pages/address/%5Baddress%5D-cf262b413b6e101d.js",revision:"cf262b413b6e101d"},{url:"/_next/static/chunks/pages/attributes-735bb3bb2cc57f4c.js",revision:"735bb3bb2cc57f4c"},{url:"/_next/static/chunks/pages/discover-ab9073702bda536b.js",revision:"ab9073702bda536b"},{url:"/_next/static/chunks/pages/index-cce4d40bd7952f44.js",revision:"cce4d40bd7952f44"},{url:"/_next/static/chunks/pages/interactive-613b0fbe63f3bccc.js",revision:"613b0fbe63f3bccc"},{url:"/_next/static/chunks/pages/rig/%5BrigId%5D-7a81bbf4a9a9cdb6.js",revision:"7a81bbf4a9a9cdb6"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-432d540496f1df17.js",revision:"432d540496f1df17"},{url:"/_next/static/css/93c408c65e455a6e.css",revision:"93c408c65e455a6e"},{url:"/_next/static/css/ab6c25acaee59f9c.css",revision:"ab6c25acaee59f9c"},{url:"/_next/static/media/.54662e50",revision:"54662e50"},{url:"/_next/static/media/.d1475b32.png",revision:"d1475b32"},{url:"/_next/static/media/2aaf0723e720e8b9.p.woff2",revision:"e1b9f0ecaaebb12c93064cd3c406f82b"},{url:"/_next/static/media/9c4f34569c9b36ca.woff2",revision:"2c1fc211bf5cca7ae7e7396dc9e4c824"},{url:"/_next/static/media/ae9ae6716d4f8bf8.woff2",revision:"b0c49a041e15bdbca22833f1ed5cfb19"},{url:"/_next/static/media/b1db3e28af9ef94a.woff2",revision:"70afeea69c7f52ffccde29e1ea470838"},{url:"/_next/static/media/b967158bc7d7a9fb.woff2",revision:"08ccb2a3cfc83cf18d4a3ec64dd7c11b"},{url:"/_next/static/media/c0f5ec5bbf5913b7.woff2",revision:"8ca5bc1cd1579933b73e51ec9354eec9"},{url:"/_next/static/media/d1d9458b69004127.woff2",revision:"9885d5da3e4dfffab0b4b1f4a259ca27"},{url:"/_next/static/media/main.cd51a4b6.wasm",revision:"cd51a4b6"},{url:"/_next/static/media/main.ed98b892.wasm",revision:"ed98b892"},{url:"/favicon.svg",revision:"d357a3ff2c30636c98d305ea5cd9b698"},{url:"/icons.js",revision:"4b620dd825349a80dede96073e1d7888"},{url:"/icons/icon-128x128.png",revision:"84fce6c70583ab1d66525a45b45867cc"},{url:"/icons/icon-144x144.png",revision:"7983c0b3a93c6ab57a070f93efcb0c51"},{url:"/icons/icon-152x152.png",revision:"fb2bdfd6a4cd5d3b089b4bf006999a84"},{url:"/icons/icon-192x192.png",revision:"00e430aa21d38fdf3bc45e1975c19bd2"},{url:"/icons/icon-384x384.png",revision:"0f97b08694332522a9a6dc3192bcd0a3"},{url:"/icons/icon-512x512.png",revision:"a0b445785240e460a46ea4793a30edaf"},{url:"/icons/icon-72x72.png",revision:"661ba64f31f810e7a0cd310013b66610"},{url:"/icons/icon-96x96.png",revision:"7d3dc6ca2150839c396e4dc2fe3a1206"},{url:"/lightbackground.png",revision:"c57e3c1ee58c1253ddd5fece14f95627"},{url:"/logo.svg",revision:"fc73ae42896021d77a8ca719c6efa6b4"},{url:"/manifest.json",revision:"e6fc414bcc4a4db27ddb748d0ae4c7a6"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
