"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[985],{6452:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>c,frontMatter:()=>o,metadata:()=>s,toc:()=>d});var r=a(3117),n=(a(7294),a(3905));const o={sidebar_position:2,id:"the-shellcoder-s-handbook",title:"The Shellcoder's Handbook"},i="The Shellcoder's Handbook",s={unversionedId:"notes/the-shellcoder-s-handbook",id:"notes/the-shellcoder-s-handbook",title:"The Shellcoder's Handbook",description:"This book is about code and data, and what happens when the two become confused",source:"@site/../docs/notes/the-shellcoder-s-handbook.md",sourceDirName:"notes",slug:"/notes/the-shellcoder-s-handbook",permalink:"/strawhatsec/docs/notes/the-shellcoder-s-handbook",draft:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,id:"the-shellcoder-s-handbook",title:"The Shellcoder's Handbook"},sidebar:"tutorialSidebar",previous:{title:"The Art of Network Penetration Testing",permalink:"/strawhatsec/docs/notes/the-art-of-petwork-penetration-testing"},next:{title:"Hacking: The Art of Exploitation",permalink:"/strawhatsec/docs/notes/hacking-the-art-of-exploitation"}},l={},d=[{value:"Chapter 1: Before You Begin",id:"chapter-1-before-you-begin",level:2},{value:"Notes",id:"notes",level:3},{value:"Resources",id:"resources",level:3},{value:"Extra",id:"extra",level:3},{value:"Chapter 2: Stack Overflows",id:"chapter-2-stack-overflows",level:2},{value:"Resources",id:"resources-1",level:3},{value:"Extras",id:"extras",level:3}],p={toc:d};function c(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"the-shellcoders-handbook"},"The Shellcoder's Handbook"),(0,n.kt)("admonition",{title:"About",type:"tip"},(0,n.kt)("p",{parentName:"admonition"},"This book is about code and data, and what happens when the two become confused"),(0,n.kt)("p",{parentName:"admonition"},(0,n.kt)("a",{parentName:"p",href:"https://www.wiley.com/en-us/The+Shellcoder%27s+Handbook%3A+Discovering+and+Exploiting+Security+Holes%2C+2nd+Edition-p-9780470080238"},"The Shellcoder's Handbook (2007)(2nd)"))),(0,n.kt)("h2",{id:"chapter-1-before-you-begin"},"Chapter 1: Before You Begin"),(0,n.kt)("h3",{id:"notes"},"Notes"),(0,n.kt)("p",null,"A modern computer makes no real distinction between instructions and data. If a processor can be fed instructions when it should be seeing data, it will happily go about executing the passed instructions. This characteristic makes system exploitation possible. The goal is to gain control of execution."),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"Understand memory management on Linux Intel Architecture, 32 Bit (IA32)")),(0,n.kt)("p",null,"When a program is executed, it is laid out in an organized manner i.e. various elements of the program are mapped into memory:"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},"the operating system creates an address space in which the program will run. This address space includes the actual program instructions as well as any required data"),(0,n.kt)("li",{parentName:"ol"},"information is loaded from the program's executable file to the newly created address space. There are three types of segments: ",(0,n.kt)("inlineCode",{parentName:"li"},".text"),", ",(0,n.kt)("inlineCode",{parentName:"li"},".bss"),", and ",(0,n.kt)("inlineCode",{parentName:"li"},".data"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"the ",(0,n.kt)("inlineCode",{parentName:"li"},".text")," segment is mapped as read-only, whereas ",(0,n.kt)("inlineCode",{parentName:"li"},".data")," and ",(0,n.kt)("inlineCode",{parentName:"li"},".bss")," are writable"),(0,n.kt)("li",{parentName:"ul"},"the ",(0,n.kt)("inlineCode",{parentName:"li"},".bss")," and ",(0,n.kt)("inlineCode",{parentName:"li"},".data")," segments are reserved for global variables"),(0,n.kt)("li",{parentName:"ul"},"the ",(0,n.kt)("inlineCode",{parentName:"li"},".data")," segment contains static initialized data"),(0,n.kt)("li",{parentName:"ul"},"the ",(0,n.kt)("inlineCode",{parentName:"li"},".bss")," segment contains uninitialized data"),(0,n.kt)("li",{parentName:"ul"},"the ",(0,n.kt)("inlineCode",{parentName:"li"},".text")," segment holds the program instructions"))),(0,n.kt)("li",{parentName:"ol"},"the stack and the heap are initialized",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"the stack is a ",(0,n.kt)("em",{parentName:"li"},"Last In First Out")," (LIFO) data structure: items are pushed or popped"),(0,n.kt)("li",{parentName:"ul"},"the stack stores local variables, information relating to function calls, and other information used to clean up the stack after a function or procedure is called"),(0,n.kt)("li",{parentName:"ul"},"the stack ",(0,n.kt)("em",{parentName:"li"},"grows down the address space")," : as more data is added to the stack, it is added at increasingly lower address values"),(0,n.kt)("li",{parentName:"ul"},"the heap is (roughly) a ",(0,n.kt)("em",{parentName:"li"},"First In First Out")," (FIFO) data structure: data is placed and removed from the heap as it builds"),(0,n.kt)("li",{parentName:"ul"},"the heap is another data structure used to hold program information, more specifically, dynamic variables"),(0,n.kt)("li",{parentName:"ul"},"the heap ",(0,n.kt)("em",{parentName:"li"},"grows up the address space")," : as data is added to the heap, it is added at an increasingly higher address value")))),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"\u2191 Lower addresses (0x08000000)\nShared libraries\n.text\n.bss\nHeap (grows \u2193)\nStack (grows \u2191)\nenv pointer\nArgc\n\u2193 Higher addresses (0xbfffffff)\n")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Assembly")," - Exploiting security holes requires a firm grasp of assembly language, because most exploits will require you to write (or modify existing) code in assembly"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Registers")," - Understanding how the registers work and how they are manipulated via assembly is essential for vulnerability development and exploitation. Registers can be accessed, read, and changed with assembly",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("em",{parentName:"li"},"General-purpose")," registers are used to perform a range of common mathematical operations. They include registers such as ",(0,n.kt)("inlineCode",{parentName:"li"},"EAX"),", ",(0,n.kt)("inlineCode",{parentName:"li"},"EBX"),", and ",(0,n.kt)("inlineCode",{parentName:"li"},"ECX")," for the IA32, and can be used to store data and addresses, offset addresses, perform counting functions, and many other things"),(0,n.kt)("li",{parentName:"ul"},"A general-purpose register to take note of is the ",(0,n.kt)("em",{parentName:"li"},"extended stack pointer")," register ",(0,n.kt)("inlineCode",{parentName:"li"},"ESP")," or simply the ",(0,n.kt)("em",{parentName:"li"},"stack pointer"),".",(0,n.kt)("inlineCode",{parentName:"li"},"ESP")," points to the memory address where the next stack operation will take place"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("em",{parentName:"li"},"Segment")," register on an IA32 processor are 16 bit (other registers are 32 bits in size). Segment registers, such as ",(0,n.kt)("inlineCode",{parentName:"li"},"CS"),", ",(0,n.kt)("inlineCode",{parentName:"li"},"DS"),", and ",(0,n.kt)("inlineCode",{parentName:"li"},"SS"),", are used to keep track of segments and to allow backward compatibility with 16-bit applications"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("em",{parentName:"li"},"Control")," registers are used to control the function of the processor. The most important of these registers for the IA32 is the ",(0,n.kt)("em",{parentName:"li"},"Extended Instruction Pointer")," ",(0,n.kt)("inlineCode",{parentName:"li"},"EIP")," or simply the ",(0,n.kt)("em",{parentName:"li"},"Instruction Pointer"),". ",(0,n.kt)("inlineCode",{parentName:"li"},"EIP")," contains the address of the next machine instruction to be executed"),(0,n.kt)("li",{parentName:"ul"},"Other registers include ",(0,n.kt)("em",{parentName:"li"},"Extended Flags")," ",(0,n.kt)("inlineCode",{parentName:"li"},"EFLAGS")," register, which comprises many single-bit registers that are used to store the results of various tests performed by the processor")))),(0,n.kt)("h3",{id:"resources"},"Resources"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://linux-mm.org"},"Linux Memory Management")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.sourceware.org/gdb/documentation"},"GDB: The GNU Project Debugger"))),(0,n.kt)("h3",{id:"extra"},"Extra"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.cs.princeton.edu/courses/archive/spring04/cos217"},"Computer Science 217: Introduction to Programming Systems (Spring 2004)"))),(0,n.kt)("h2",{id:"chapter-2-stack-overflows"},"Chapter 2: Stack Overflows"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Stack overflows are possible because no inherent bounds-checking exists on buffers in the C or C++ languages.")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-bash"},'docker run --rm -it \\\n  --name ubuntu \\\n  -v "$(pwd)/notes/the-shellcoder-s-handbook:/share" \\\n  --platform linux/386 \\\n  i386/ubuntu:20.04 \\\n  bash\n\napt update && apt install gcc gdb nasm -y\n')),(0,n.kt)("p",null,"Code examples"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-bash"},"cd /share/chapter02\n\n# buffer\n# buffer2\n")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"TODO 13")),(0,n.kt)("h3",{id:"resources-1"},"Resources"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"http://phrack.org/archives/issues/49/14.txt"},"Smashing the Stack for Fun and Profit"))),(0,n.kt)("h3",{id:"extras"},"Extras"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.akadia.com/services/ora_enable_core.html"},"How do I enable core dumps for everybody"))))}c.isMDXComponent=!0},3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>m});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=r.createContext({}),d=function(e){var t=r.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=d(e.components);return r.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=d(a),m=n,h=u["".concat(l,".").concat(m)]||u[m]||c[m]||o;return a?r.createElement(h,i(i({ref:t},p),{},{components:a})):r.createElement(h,i({ref:t},p))}));function m(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,i=new Array(o);i[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:n,i[1]=s;for(var d=2;d<o;d++)i[d]=a[d];return r.createElement.apply(null,i)}return r.createElement.apply(null,a)}u.displayName="MDXCreateElement"}}]);