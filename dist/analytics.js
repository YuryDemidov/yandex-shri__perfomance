!function(){"use strict";function e(e,t){const n=e.sort(((e,t)=>e-t)),o=(n.length-1)*t,i=Math.floor(o),a=o-i;return void 0!==n[i+1]?Math.floor(n[i]+a*(n[i+1]-n[i])):Math.floor(n[i])}function t(t,n,o,i,a){const s={},r=t.filter((e=>e.page===n&&e.name===i&&e.date===a));let d=`Event ${i}\nComparison ${o}\nPage ${n}\n${a}:`;r.forEach((e=>{s[e.additional[o]]?s[e.additional[o]].push(e.value):s[e.additional[o]]=[e.value]}));let l="";return Object.keys(s).forEach((t=>{const n=`\n    ${"undefined"===t?"not set":t}: p25=${e(s[t],.25)} p50=${e(s[t],.5)} p75=${e(s[t],.75)} p90=${e(s[t],.95)} hits=${s[t].length}`;"undefined"===t?l=n:d+=` ${n}`})),`${d}${l}`}fetch("https://shri.yandex/hw/stat/data?counterId=5c6795b9-008e-40cb-920a-a25e2a4c7d3f").then((e=>e.json())).then((n=>{let o=function(e){return e.data.map((e=>(e.date=e.timestamp.split("T")[0],e)))}(n);document.querySelector("#output").textContent=`Metrics:\n- domReady - time from the start of the page load to the end of the DOMContentLoaded event\n- modalOpenDelay - the difference between the expected time of the modal opening (500 ms)\n  and the real time from clicking on the opening button to the completion of the opening animation\n- firstTenScrollTicksTiming - the speed of the first ten scroll handlers firing\n- settingsSubmit - time of settings form handling from click on the submitter to the request sending\n- settingsChange - time of settings changing from click on the submitter to the response getting\n\nParameters:\n- env - in which environment the metric was obtained (production / development)\n- platform - device type (desktop / touch)\n- os - operating system (iOS / Android / Linux / Windows / MacOS)\n- gmt - timezone offset in GMT format (e.g. +3:00)\n- language - user's preferred language (e.g. ru-RU)\n- hasAdBlockers - does the user have ad blockers installed (true / false)\n- dpr - device pixel ratio (e.g. 2)\n    \n    \nReport examples:\n\n# Metrics for certain date:\n${function(t,n,o,i){let a=t.filter((e=>e.page===n&&e.name===o&&e.date===i)).map((e=>e.value));return`Event ${o}\nPage ${n}\n${i}:\n    p25=${e(a,.25)} p50=${e(a,.5)}\n    p75=${e(a,.75)} p90=${e(a,.95)}\n    hits=${a.length}`}(o,"builds-list","modalOpenDelay","2021-07-11")}\n\n# Metrics for certain period:\n${function(t,n,o,i,a){const s=t.filter((e=>e.page===n&&e.name===o&&e.date>=i&&e.date<=a)).map((e=>e.value));return`Event ${o}\nPage ${n}\nFrom 2021-07-11 to 2021-07-28:\n    p25=${e(s,.25)} p50=${e(s,.5)}\n    p75=${e(s,.75)} p90=${e(s,.95)}\n    hits=${s.length}`}(o,"build-logs","domReady","2021-07-11","2021-07-28")}\n\n# Metrics for certain session:\n${function(e,t,n){const o=e.filter((e=>e.requestId===t&&e.date===n));let i=`Session 510267335695\n${n}:`;return o.forEach((e=>{i+=`\n    Page ${e.page} - Event ${e.name} - ${e.value}`})),i+=`\n    hits=${o.length}`,i}(o,"510267335695","2021-07-11")}\n\n# Metric comparison depending on passed parameter:\n${t(o,"builds-list","os","domReady","2021-07-11")}\n\n${t(o,"builds-list","gmt","modalOpenDelay","2021-07-11")}\n\n${t(o,"settings","dpr","settingsSubmit","2021-07-11")}\n\n${t(o,"settings","platform","settingsChange","2021-07-11")}`}))}();