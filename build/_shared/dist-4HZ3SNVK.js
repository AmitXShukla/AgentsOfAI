import{a as n,b as s}from"/build/_shared/chunk-4GOGFBZ2.js";import"/build/_shared/chunk-3CVK3PYF.js";import"/build/_shared/chunk-S4SWV34C.js";import"/build/_shared/chunk-GUCIBHGO.js";import"/build/_shared/chunk-2NH4LW52.js";var b={name:"tab-set",alias:["tabSet"],options:{...n("tab-set")},body:{type:"myst"},run(t){let e={type:"tabSet",children:t.body||[]};return s(t,e),[e]}},c={name:"tab-item",alias:["tabItem","tab"],arg:{type:String},options:{...n("tab-item"),sync:{type:String},selected:{type:Boolean}},body:{type:"myst"},run(t){var e,o,i;let r={type:"tabItem",title:(e=t.arg)!==null&&e!==void 0?e:"Tab Title",sync:(o=t.options)===null||o===void 0?void 0:o.sync,selected:(i=t.options)===null||i===void 0?void 0:i.selected,children:t.body||[]};return s(t,r),[r]}},p=[b,c];export{p as tabDirectives,c as tabItemDirective,b as tabSetDirective};
