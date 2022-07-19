"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[706],{6502:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>c,frontMatter:()=>l,metadata:()=>i,toc:()=>p});var a=n(3117),r=(n(7294),n(3905));const l={id:"contribute",title:"How to contribute"},o=void 0,i={unversionedId:"contribute",id:"contribute",title:"How to contribute",description:"Setup",source:"@site/../docs/contribute.md",sourceDirName:".",slug:"/contribute",permalink:"/strawhatsec/docs/contribute",draft:!1,tags:[],version:"current",frontMatter:{id:"contribute",title:"How to contribute"},sidebar:"tutorialSidebar",previous:{title:"wordlists",permalink:"/strawhatsec/docs/docker/wordlists"}},s={},p=[{value:"Setup",id:"setup",level:2},{value:"Development",id:"development",level:2},{value:"Deployment",id:"deployment",level:2},{value:"Docker",id:"docker",level:2}],u={toc:p};function c(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"setup"},"Setup"),(0,r.kt)("p",null,"Resources"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docusaurus.io"},"Docusaurus")," v2"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/nvm-sh/nvm"},"nvm")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://classic.yarnpkg.com/lang/en"},"Yarn"))),(0,r.kt)("p",null,"Install Node.js with ",(0,r.kt)("inlineCode",{parentName:"p"},"nvm")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# install or update nvm\ncurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash\n\n# list all LTS\nnvm ls-remote --lts\n\n# install node + npm (LTS)\nnvm install 16 --lts\n\n# verify installation\nnode --version # v16.13.1\nnpm --version # v8.1.2\n")),(0,r.kt)("p",null,"Install Yarn"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# install classic stable\nnpm install --global yarn\n\n# verify installation\nyarn --version # v1.22.15\n")),(0,r.kt)("p",null,"Generate skeleton"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# from root folder\nnpx create-docusaurus@latest website classic\n")),(0,r.kt)("p",null,"Upgrade to Yarn v2"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'corepack enable\n\n# update project to latest\ncd website/\nyarn set version stable\necho "nodeLinker: pnp" > .yarnrc.yml\nyarn install\nyarn dlx @yarnpkg/doctor\n\n# verify installation + update .gitignore\nyarn --version # v3.1.1\n')),(0,r.kt)("p",null,"Configure ",(0,r.kt)("inlineCode",{parentName:"p"},"nvm")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'# use default version (see .nvmrc)\necho "v16" > website/.nvmrc\ncd website/\nnvm use\n')),(0,r.kt)("h2",{id:"development"},"Development"),(0,r.kt)("p",null,"Starts local site with livereload"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# http://localhost:3000\nmake site-start\n")),(0,r.kt)("p",null,"Manually update all the dependencies"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# interactive\nmake site-upgrade\n")),(0,r.kt)("p",null,"Resources"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://stackoverflow.com/questions/58665817/redirect-to-docs-from-landing-page-in-docusaurus-v2"},"Landing page"))),(0,r.kt)("h2",{id:"deployment"},"Deployment"),(0,r.kt)("p",null,"Resources"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docusaurus.io/docs/deployment#deploying-to-github-pages"},"gh-pages")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/peaceiris/actions-gh-pages#%EF%B8%8F-docusaurus"},"GitHub Action"))),(0,r.kt)("p",null,"A deployment is triggered every time that a tag starting with ",(0,r.kt)("inlineCode",{parentName:"p"},"v")," is pushed. Alternatively, manual deployment"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# serves artifacts locally\nmake site-deploy-local\n\n# builds and deploys manually on gh-pages\nmake site-deploy-gh-manual\n")),(0,r.kt)("h2",{id:"docker"},"Docker"),(0,r.kt)("p",null,"Actions"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/docker/login-action"},"login-action")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/docker/metadata-action"},"metadata-action")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/docker/build-push-action"},"build-push-action"))),(0,r.kt)("p",null,"Secrets"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"create an Access Token on ",(0,r.kt)("a",{parentName:"li",href:"https://hub.docker.com/settings/security"},"DockerHub")),(0,r.kt)("li",{parentName:"ul"},"add ",(0,r.kt)("em",{parentName:"li"},"New repository secret")," on ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/niqdev/strawhatsec/settings/secrets/actions"},"GitHub"))),(0,r.kt)("p",null,"A build is triggered on every push if there is a change in the ",(0,r.kt)("inlineCode",{parentName:"p"},"docker")," folder"))}c.isMDXComponent=!0},3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=p(n),d=r,k=m["".concat(s,".").concat(d)]||m[d]||c[d]||l;return n?a.createElement(k,o(o({ref:t},u),{},{components:n})):a.createElement(k,o({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var p=2;p<l;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);