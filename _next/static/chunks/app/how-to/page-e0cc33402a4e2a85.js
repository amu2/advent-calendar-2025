(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[213],{6394:function(e,t,a){Promise.resolve().then(a.bind(a,2687))},2687:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return c}});var n=a(7437),r=a(429),o=a(7648),s=a(4938),i=a(3831),l=a(9337);function c(){let e=`
## How to read this Advent calendar

This Advent calendar is written for readers who are comfortably fluent in theoretical physics and mathematics, but who may or may not have worked with octonions and exceptional algebras before. Each day is a self-contained sheet, but together they tell a single story:

- that the Standard Model and gravity can be seen as low-energy expressions of a more rigid exceptional structure, and
- that many familiar "facts" of particle physics look less arbitrary when viewed from this perspective.

You do *not* need to accept every step as "the" final truth to benefit from the journey. The purpose is to make plausible that there is a coherent algebraic backbone behind the zoo of fields, couplings and generations.

## Structure of the four weeks

The four Advent Sundays mark the main milestones:

**First Sunday:** We introduce the octonionic stage, the group $G_2$ and triality, and explain why an $8$-dimensional, nonassociative number system is a natural candidate for internal degrees of freedom.

**Second Sunday:** We move to the Albert algebra $H_3(\\mathbb{O})$, the unified transport equation $D\\Psi=0$ and the idea that Dirac, Yang–Mills and Einstein equations can all be read as projections or consistency conditions of this single operator.

**Third Sunday:** We look at flavour: three generations, CKM and PMNS mixing, and how these structures appear as different charts on the same internal exceptional space.

**Fourth Sunday:** We step back and ask what kind of "attractor universe" is selected by this geometry, and how robust the picture is under deformations.

In between the Sundays, the weekday sheets focus on specific mechanisms, numerical prototypes and "what-if" universes based on alternative algebras.

## What you can expect (and what not)

This calendar is intentionally modest and ambitious at the same time:

- **Modest**, because it does not pretend to deliver a full, rigorous theory with all details worked out. Many steps are presented at the level of structure and plausibility rather than polished theorems.
- **Ambitious**, because it aims to show that a surprisingly small set of algebraic ingredients — octonions, $H_3(\\mathbb{O})$, an $\\mathfrak{so}(8)$-connection and a vacuum configuration $\\langle H\\rangle$ — can organise a large portion of what we know as the Standard Model plus gravity.

You should *not* expect precise numeric predictions for every mass and mixing angle on these pages. What you can expect are:

1. clear structural links: why three generations, why particular charge assignments, why certain patterns of couplings;
2. concrete numerical prototypes: explicit eigenvalue patterns from simple vacua in $H_3(\\mathbb{O})$;
3. a comparative view: what is lost when we replace the exceptional algebras by more conventional ones.

## Who this is written for

These sheets deliberately sit in between a technical paper and a popular article:

- If you are a working physicist or mathematician, you will find enough structure to connect the ideas to your own toolbox: Lie groups, representation theory, spectral geometry, operator algebras.
- If you come from a neighbouring field, you might treat the technical points as signposts rather than obstacles, and focus on the emerging picture: a universe whose internal order is exceptional in a very literal sense.

References at the bottom of each sheet point to the underlying literature. You do not need to read them to follow the calendar, but they are there if you want to see how the pieces connect to mainstream work on division algebras, Jordan algebras and noncommutative geometry.

## An invitation rather than a conclusion

Finally, this Advent calendar should be read as an invitation, not as a finished doctrine. There are many open questions:

- How unique is the proposed exceptional backbone?
- How far can the numerical fits to real-world data be pushed?
- Which aspects of the nonassociative structure survive quantisation?

If, by Christmas, you feel that these questions are worth spending serious time on, the calendar has achieved its goal.
  `;return(0,n.jsxs)("div",{className:"min-h-screen relative overflow-hidden",style:{background:"linear-gradient(135deg, #003366 0%, #006633 100%)"},children:[(0,n.jsx)(l.X,{}),(0,n.jsxs)("div",{className:"relative z-10 container mx-auto px-4 py-8 max-w-4xl",children:[(0,n.jsxs)(r.E.div,{initial:{y:-20,opacity:0},animate:{y:0,opacity:1},className:"mb-8",children:[(0,n.jsxs)("div",{className:"flex items-center justify-between mb-6",children:[(0,n.jsx)("h1",{className:"text-4xl font-bold",style:{color:"#FFD700"},children:"Advent Calendar 2025"}),(0,n.jsxs)(o.default,{href:"/",className:"flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:scale-105",style:{backgroundColor:"rgba(0, 51, 102, 0.7)",color:"#FFFFFF"},children:[(0,n.jsx)(s.Z,{className:"w-5 h-5"}),(0,n.jsx)("span",{children:"Back to Calendar"})]})]}),(0,n.jsx)("h2",{className:"text-2xl font-semibold",style:{color:"#B3001B"},children:"An exceptional algebraic walk through particle physics"})]}),(0,n.jsx)(r.E.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.3},className:"bg-white rounded-xl p-8 shadow-2xl",style:{border:"3px solid rgba(0, 102, 51, 0.8)"},children:(0,n.jsx)("div",{className:"prose prose-lg max-w-none",children:(0,n.jsx)(i.Y,{content:e})})})]})]})}},3831:function(e,t,a){"use strict";a.d(t,{Y:function(){return o}});var n=a(7437),r=a(2265);function o({content:e}){let t=(0,r.useRef)(null);return(0,r.useEffect)(()=>{t.current&&e&&(async()=>{let n=(await a.e(954).then(a.bind(a,8455))).default,r=t.current;if(!r)return;let o=e;o=(o=o.replace(/\\\[([\s\S]*?)\\\]/g,(e,t)=>{try{return n.renderToString(t.trim(),{displayMode:!0,throwOnError:!1})}catch(e){return`<span class="math-error">\\[${t}\\]</span>`}})).replace(/\$([^$]+)\$/g,(e,t)=>{try{return n.renderToString(t.trim(),{displayMode:!1,throwOnError:!1})}catch(e){return`<span class="math-error">$${t}$</span>`}}),r.innerHTML=o})()},[e]),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("link",{rel:"stylesheet",href:"https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",crossOrigin:"anonymous"}),(0,n.jsx)("div",{ref:t,className:"math-content"})]})}},9337:function(e,t,a){"use strict";a.d(t,{X:function(){return i}});var n=a(7437),r=a(29),o=a.n(r),s=a(2265);function i(){let[e,t]=(0,s.useState)([]);return(0,s.useEffect)(()=>{t(Array.from({length:50},(e,t)=>({id:t,left:100*Math.random(),animationDuration:10+20*Math.random(),size:16+24*Math.random(),delay:10*Math.random()})))},[]),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(o(),{id:"b67d430fdd7c5b47",children:"@-webkit-keyframes snowfall{0%{-webkit-transform:translatey(-10vh)rotate(0deg);transform:translatey(-10vh)rotate(0deg);opacity:1}100%{-webkit-transform:translatey(110vh)rotate(360deg);transform:translatey(110vh)rotate(360deg);opacity:.8}}@-moz-keyframes snowfall{0%{-moz-transform:translatey(-10vh)rotate(0deg);transform:translatey(-10vh)rotate(0deg);opacity:1}100%{-moz-transform:translatey(110vh)rotate(360deg);transform:translatey(110vh)rotate(360deg);opacity:.8}}@-o-keyframes snowfall{0%{-o-transform:translatey(-10vh)rotate(0deg);transform:translatey(-10vh)rotate(0deg);opacity:1}100%{-o-transform:translatey(110vh)rotate(360deg);transform:translatey(110vh)rotate(360deg);opacity:.8}}@keyframes snowfall{0%{-webkit-transform:translatey(-10vh)rotate(0deg);-moz-transform:translatey(-10vh)rotate(0deg);-o-transform:translatey(-10vh)rotate(0deg);transform:translatey(-10vh)rotate(0deg);opacity:1}100%{-webkit-transform:translatey(110vh)rotate(360deg);-moz-transform:translatey(110vh)rotate(360deg);-o-transform:translatey(110vh)rotate(360deg);transform:translatey(110vh)rotate(360deg);opacity:.8}}"}),(0,n.jsx)("div",{className:"jsx-b67d430fdd7c5b47 fixed inset-0 pointer-events-none z-10 overflow-hidden",children:e.map(e=>(0,n.jsx)("div",{style:{left:`${e.left}%`,fontSize:`${e.size}px`,animation:`snowfall ${e.animationDuration}s linear infinite`,animationDelay:`${e.delay}s`,textShadow:"0 0 5px rgba(0,0,0,0.5), 0 0 10px rgba(0,0,0,0.3)",opacity:.9},className:"jsx-b67d430fdd7c5b47 absolute text-white font-bold",children:"❄"},e.id))})]})}},4938:function(e,t,a){"use strict";a.d(t,{Z:function(){return n}});let n=(0,a(9205).Z)("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]])}},function(e){e.O(0,[877,971,117,744],function(){return e(e.s=6394)}),_N_E=e.O()}]);