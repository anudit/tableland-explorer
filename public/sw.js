if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const r=e=>c(e,n),d={module:{uri:n},exports:t,require:r};s[n]=Promise.all(a.map((e=>d[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-7028bf80"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/GLbbavL3UMMYYcODvP4Jx/_buildManifest.js",revision:"0e0866cac35b2ebd2598bd07fdedc239"},{url:"/_next/static/GLbbavL3UMMYYcODvP4Jx/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1345-395f10bb318bafc2.js",revision:"395f10bb318bafc2"},{url:"/_next/static/chunks/1595.c3e0df56ac2bdea0.js",revision:"c3e0df56ac2bdea0"},{url:"/_next/static/chunks/1674.dbf6cd42a84740e2.js",revision:"dbf6cd42a84740e2"},{url:"/_next/static/chunks/1789-59cd6dfddaf6f337.js",revision:"59cd6dfddaf6f337"},{url:"/_next/static/chunks/1839.1d9f6f0f5558f841.js",revision:"1d9f6f0f5558f841"},{url:"/_next/static/chunks/2.8b8c46b83818202f.js",revision:"8b8c46b83818202f"},{url:"/_next/static/chunks/2171-eb3b49a3a7269234.js",revision:"eb3b49a3a7269234"},{url:"/_next/static/chunks/225-b1ef365869240410.js",revision:"b1ef365869240410"},{url:"/_next/static/chunks/2482-8b113fd5dc886dab.js",revision:"8b113fd5dc886dab"},{url:"/_next/static/chunks/2513.46ce7905bd9b4d5c.js",revision:"46ce7905bd9b4d5c"},{url:"/_next/static/chunks/2609.850a520b73e7c5be.js",revision:"850a520b73e7c5be"},{url:"/_next/static/chunks/266.cf5abadf6e44ca3a.js",revision:"cf5abadf6e44ca3a"},{url:"/_next/static/chunks/2884.d18954dfc7c95a5d.js",revision:"d18954dfc7c95a5d"},{url:"/_next/static/chunks/2894.1194a5214b7a8e88.js",revision:"1194a5214b7a8e88"},{url:"/_next/static/chunks/303.f7e510c5600aa6c4.js",revision:"f7e510c5600aa6c4"},{url:"/_next/static/chunks/3150-87d6109ce6c740c7.js",revision:"87d6109ce6c740c7"},{url:"/_next/static/chunks/332030a0-28488fdda07231a5.js",revision:"28488fdda07231a5"},{url:"/_next/static/chunks/3511.d4a28a336c30ad7c.js",revision:"d4a28a336c30ad7c"},{url:"/_next/static/chunks/4027.9d5c2ad307f2252b.js",revision:"9d5c2ad307f2252b"},{url:"/_next/static/chunks/412-c35bda1c3e22668a.js",revision:"c35bda1c3e22668a"},{url:"/_next/static/chunks/4264.7306b2eb6f1853d8.js",revision:"7306b2eb6f1853d8"},{url:"/_next/static/chunks/4267.d492aba12d08e8eb.js",revision:"d492aba12d08e8eb"},{url:"/_next/static/chunks/4306.9bc3a7b5010ed06a.js",revision:"9bc3a7b5010ed06a"},{url:"/_next/static/chunks/4465.750184b65fc4efd0.js",revision:"750184b65fc4efd0"},{url:"/_next/static/chunks/4647-2e49cbf8a2e53544.js",revision:"2e49cbf8a2e53544"},{url:"/_next/static/chunks/4f041c27-7efd53d235a672e1.js",revision:"7efd53d235a672e1"},{url:"/_next/static/chunks/5046-02f1babad8c72271.js",revision:"02f1babad8c72271"},{url:"/_next/static/chunks/5490.28fda02bad9c4e67.js",revision:"28fda02bad9c4e67"},{url:"/_next/static/chunks/5550-f526062043704f7e.js",revision:"f526062043704f7e"},{url:"/_next/static/chunks/6689-1a9324ae8df0a9a8.js",revision:"1a9324ae8df0a9a8"},{url:"/_next/static/chunks/6837-27e356a2b09832da.js",revision:"27e356a2b09832da"},{url:"/_next/static/chunks/7224-4ec4e08a88cc9523.js",revision:"4ec4e08a88cc9523"},{url:"/_next/static/chunks/7240.bb09eae0bd37ee1c.js",revision:"bb09eae0bd37ee1c"},{url:"/_next/static/chunks/751.46274109d9459782.js",revision:"46274109d9459782"},{url:"/_next/static/chunks/7a7c95a0-8e178a79c7db146f.js",revision:"8e178a79c7db146f"},{url:"/_next/static/chunks/8138.bc3aa956f11602ac.js",revision:"bc3aa956f11602ac"},{url:"/_next/static/chunks/8197-b66b0558520afe2e.js",revision:"b66b0558520afe2e"},{url:"/_next/static/chunks/83.bdfab723b30d99eb.js",revision:"bdfab723b30d99eb"},{url:"/_next/static/chunks/835-3d289ecc34c91ee2.js",revision:"3d289ecc34c91ee2"},{url:"/_next/static/chunks/8488.988e0d07a6dfc5a1.js",revision:"988e0d07a6dfc5a1"},{url:"/_next/static/chunks/8650-ce40a5bc6dbf5871.js",revision:"ce40a5bc6dbf5871"},{url:"/_next/static/chunks/8928.729b6526c63c54f5.js",revision:"729b6526c63c54f5"},{url:"/_next/static/chunks/8949-2daf0221dabb2e99.js",revision:"2daf0221dabb2e99"},{url:"/_next/static/chunks/8983.3f730b4dd61f06c7.js",revision:"3f730b4dd61f06c7"},{url:"/_next/static/chunks/8cfab917-27a512f46b8b3a7e.js",revision:"27a512f46b8b3a7e"},{url:"/_next/static/chunks/8e7ab092-e88c46cf48e3351c.js",revision:"e88c46cf48e3351c"},{url:"/_next/static/chunks/9074.9b154ad80711cdd5.js",revision:"9b154ad80711cdd5"},{url:"/_next/static/chunks/9219.7d9240e0a84bad3d.js",revision:"7d9240e0a84bad3d"},{url:"/_next/static/chunks/9233a80c-860032ad1f020fa5.js",revision:"860032ad1f020fa5"},{url:"/_next/static/chunks/9305.92fb7cac2f5de31e.js",revision:"92fb7cac2f5de31e"},{url:"/_next/static/chunks/9322.986755690a821379.js",revision:"986755690a821379"},{url:"/_next/static/chunks/9506.c02013f1b16f664c.js",revision:"c02013f1b16f664c"},{url:"/_next/static/chunks/976.c584806d36e1e258.js",revision:"c584806d36e1e258"},{url:"/_next/static/chunks/985.5eba68e106530036.js",revision:"5eba68e106530036"},{url:"/_next/static/chunks/995.65a3ef8dfbc67735.js",revision:"65a3ef8dfbc67735"},{url:"/_next/static/chunks/9dc68651-cdf860d2e90eb025.js",revision:"cdf860d2e90eb025"},{url:"/_next/static/chunks/c53cfb96-1de1e496e178c381.js",revision:"1de1e496e178c381"},{url:"/_next/static/chunks/framework-635d1a4cc4dffe76.js",revision:"635d1a4cc4dffe76"},{url:"/_next/static/chunks/main-bdb117b40ea204fe.js",revision:"bdb117b40ea204fe"},{url:"/_next/static/chunks/pages/%5BtableName%5D-5a872a7d559c96a4.js",revision:"5a872a7d559c96a4"},{url:"/_next/static/chunks/pages/_app-b3de47489758c545.js",revision:"b3de47489758c545"},{url:"/_next/static/chunks/pages/_error-7a8074a47a780055.js",revision:"7a8074a47a780055"},{url:"/_next/static/chunks/pages/address/%5Baddress%5D-c40b2610b450ace9.js",revision:"c40b2610b450ace9"},{url:"/_next/static/chunks/pages/attributes-01babc242a23480d.js",revision:"01babc242a23480d"},{url:"/_next/static/chunks/pages/discover-97303f56505732cf.js",revision:"97303f56505732cf"},{url:"/_next/static/chunks/pages/index-5bbe6cb19978a380.js",revision:"5bbe6cb19978a380"},{url:"/_next/static/chunks/pages/interactive-4657f1e8feea0e19.js",revision:"4657f1e8feea0e19"},{url:"/_next/static/chunks/pages/rig/%5BrigId%5D-1152949f6e7e7979.js",revision:"1152949f6e7e7979"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-7e20b06e6e60282e.js",revision:"7e20b06e6e60282e"},{url:"/_next/static/css/8ed1cfd622ff09a1.css",revision:"8ed1cfd622ff09a1"},{url:"/_next/static/css/ab6c25acaee59f9c.css",revision:"ab6c25acaee59f9c"},{url:"/_next/static/media/.54662e50",revision:"54662e50"},{url:"/_next/static/media/.d1475b32.png",revision:"d1475b32"},{url:"/_next/static/media/2aaf0723e720e8b9.p.woff2",revision:"e1b9f0ecaaebb12c93064cd3c406f82b"},{url:"/_next/static/media/9c4f34569c9b36ca.woff2",revision:"2c1fc211bf5cca7ae7e7396dc9e4c824"},{url:"/_next/static/media/ae9ae6716d4f8bf8.woff2",revision:"b0c49a041e15bdbca22833f1ed5cfb19"},{url:"/_next/static/media/b1db3e28af9ef94a.woff2",revision:"70afeea69c7f52ffccde29e1ea470838"},{url:"/_next/static/media/b967158bc7d7a9fb.woff2",revision:"08ccb2a3cfc83cf18d4a3ec64dd7c11b"},{url:"/_next/static/media/c0f5ec5bbf5913b7.woff2",revision:"8ca5bc1cd1579933b73e51ec9354eec9"},{url:"/_next/static/media/d1d9458b69004127.woff2",revision:"9885d5da3e4dfffab0b4b1f4a259ca27"},{url:"/_next/static/media/main.cd51a4b6.wasm",revision:"cd51a4b6"},{url:"/_next/static/media/main.ed98b892.wasm",revision:"ed98b892"},{url:"/favicon.svg",revision:"d357a3ff2c30636c98d305ea5cd9b698"},{url:"/icons.js",revision:"4b620dd825349a80dede96073e1d7888"},{url:"/icons/icon-128x128.png",revision:"84fce6c70583ab1d66525a45b45867cc"},{url:"/icons/icon-144x144.png",revision:"7983c0b3a93c6ab57a070f93efcb0c51"},{url:"/icons/icon-152x152.png",revision:"fb2bdfd6a4cd5d3b089b4bf006999a84"},{url:"/icons/icon-192x192.png",revision:"00e430aa21d38fdf3bc45e1975c19bd2"},{url:"/icons/icon-384x384.png",revision:"0f97b08694332522a9a6dc3192bcd0a3"},{url:"/icons/icon-512x512.png",revision:"a0b445785240e460a46ea4793a30edaf"},{url:"/icons/icon-72x72.png",revision:"661ba64f31f810e7a0cd310013b66610"},{url:"/icons/icon-96x96.png",revision:"7d3dc6ca2150839c396e4dc2fe3a1206"},{url:"/lightbackground.png",revision:"c57e3c1ee58c1253ddd5fece14f95627"},{url:"/logo.svg",revision:"fc73ae42896021d77a8ca719c6efa6b4"},{url:"/manifest.json",revision:"e6fc414bcc4a4db27ddb748d0ae4c7a6"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
