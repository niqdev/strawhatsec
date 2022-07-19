"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[572],{2420:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var a=t(3117),r=(t(7294),t(3905));const o={sidebar_position:1,id:"binary-exploitation-memory-corruption",title:"Binary Exploitation / Memory Corruption"},i=void 0,l={unversionedId:"notes/binary-exploitation-memory-corruption",id:"notes/binary-exploitation-memory-corruption",title:"Binary Exploitation / Memory Corruption",description:"Short ~10min videos about binary exploitation. From beginner to advanced",source:"@site/../docs/notes/binary-exploitation-memory-corruption.md",sourceDirName:"notes",slug:"/notes/binary-exploitation-memory-corruption",permalink:"/strawhatsec/docs/notes/binary-exploitation-memory-corruption",draft:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,id:"binary-exploitation-memory-corruption",title:"Binary Exploitation / Memory Corruption"},sidebar:"tutorialSidebar",previous:{title:"Shellcode",permalink:"/strawhatsec/docs/resources/shellcode"},next:{title:"The Art of Network Penetration Testing",permalink:"/strawhatsec/docs/notes/the-art-of-petwork-penetration-testing"}},s={},p=[{value:"0x02",id:"0x02",level:2},{value:"Notes",id:"notes",level:3},{value:"0x03",id:"0x03",level:2},{value:"Notes",id:"notes-1",level:3},{value:"0x04",id:"0x04",level:2},{value:"Resources",id:"resources",level:3},{value:"0x05",id:"0x05",level:2},{value:"Notes",id:"notes-2",level:3}],c={toc:p};function m(e){let{components:n,...t}=e;return(0,r.kt)("wrapper",(0,a.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("admonition",{title:"About",type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"Short ~10min videos about binary exploitation. From beginner to advanced"),(0,r.kt)("p",{parentName:"admonition"},(0,r.kt)("a",{parentName:"p",href:"https://www.youtube.com/playlist?list=PLhixgUqwRTjxglIswKp9mpkfPNfHkzyeN"},"Binary Exploitation / Memory Corruption by LiveOverflow"))),(0,r.kt)("h2",{id:"0x02"},"0x02"),(0,r.kt)("h3",{id:"notes"},"Notes"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'docker run --rm -it \\\n  --name ubuntu \\\n  -v "$(pwd)/notes/liveoverflow/binary-exploitation-memory-corruption:/share" \\\n  --platform linux/386 \\\n  i386/ubuntu:18.04 \\\n  bash\n\n# install C compiler and debugger\napt-get update && apt-get install vim gcc gdb -y\n\nenv\nprintenv\nwhereis ls\nexport PATH=$PATH:/share\n\ncd /share\nvim hello.c\n:set number\n\n# -Wall enables all warnings\ngcc hello.c -o hello.out -Wall\nhello.out "liveoverflow"\n# prints exit code of previously running program\necho $?\n\n# ELF 32-bit\nfile hello.out\nexiftool hello.out\n')),(0,r.kt)("p",null,"See also ",(0,r.kt)("inlineCode",{parentName:"p"},"hexdump"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"xxd"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"od"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"hexcurse"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"hexyl")),(0,r.kt)("h2",{id:"0x03"},"0x03"),(0,r.kt)("h3",{id:"notes-1"},"Notes"),(0,r.kt)("p",null,"Vim"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"cd /share\n# split 2 columns\nvim -O hello.c hello.py\n\n# change column\nCTRL + (double) W\n# skip words\nCTRL + LEFT/RIGHT ARROW\n# jump at the beginning of the line\n0\n# jump at the end of the line\n$\n# create new line below cursor\no\n# create new line above cursor\nSHIFT + o\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://en.wikipedia.org/wiki/Shebang_(Unix)"},"Shebang"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'python3 hello.py "liveoverflow"\n\n# with shebang\nhello.py "liveoverflow"\n')),(0,r.kt)("h2",{id:"0x04"},"0x04"),(0,r.kt)("h3",{id:"resources"},"Resources"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://microcorruption.com"},"Embedded Security CTF")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://sockpuppet.org/issue-79-file-0xb-foxport-hht-hacking.txt.html"},"Issue 79, File 0xB"))),(0,r.kt)("h2",{id:"0x05"},"0x05"),(0,r.kt)("h3",{id:"notes-2"},"Notes"),(0,r.kt)("p",null,"Debug"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"cd /share\n# compile binary\ngcc -g -m32 -fno-stack-protector -z execstack -fno-pie -no-pie -Wall license.c -o license.out\nlicense.out AAAA-Z10N-42-OK\n\n# gnu debugger\ngdb -q license.out\n# every C program has a main function\ndisassemble main\n\n# default AT&T syntax\n# https://visualgdb.com/gdbreference/commands/set_disassembly-flavor\nshow disassembly-flavor\nset disassembly-flavor intel\ndisassemble main\n")),(0,r.kt)("p",null,"Analysis"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510   \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 497 CMP == 2 \u2502 =2\u2502 4ad PRINTF   \u2502\n\u2502 49a JNE 4f6  \u251c\u2500\u2500\u2500\u25ba 4c6 STRCMP   \u2502 returns 0 if equal\n\u2514\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518   \u2502 4ce TEST EAX \u2502\n   \u2502               \u2502 4d0 JNE 4e4  \u2502 zeroflag = 0 (strings different)\n   \u2502not 2          \u2514\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2518\n   \u2502                 \u2502YES       \u2502NO\n\u250c\u2500\u2500\u25bc\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510 \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u25bc\u2500\u2500\u2500\u2500\u2500\u2510 \u250c\u2500\u2500\u25bc\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 4f6      \u2502 \u2502 4da PUTS    \u2502 \u2502 4e4         \u2502\n\u2502 4fe PUTS \u2502 \u2502 4e2 JMP 506 \u2502 \u2502 4ec PUTS    \u2502\n\u2514\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2518 \u2502 4f4 JMP 506 \u2502\n   \u2502                 \u2502       \u2514\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n   \u2502            \u250c\u2500\u2500\u2500\u2500\u25bc\u2510         \u2502\n   \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u25ba\u2502 506 \u25c4\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n                \u2514\u2500\u2500\u2500\u2500\u2500\u2518\n\nDump of assembler code for function main:\n   0x08048486 <+0>:     lea    ecx,[esp+0x4]\n   0x0804848a <+4>:     and    esp,0xfffffff0\n   0x0804848d <+7>:     push   DWORD PTR [ecx-0x4]\n   0x08048490 <+10>:    push   ebp\n   0x08048491 <+11>:    mov    ebp,esp\n   0x08048493 <+13>:    push   ebx\n   0x08048494 <+14>:    push   ecx\n   0x08048495 <+15>:    mov    ebx,ecx\n   \n   # MAIN argc == 2\n   0x08048497 <+17>:    cmp    DWORD PTR [ebx],0x2          ; 497 CMP == 2\n   0x0804849a <+20>:    jne    0x80484f6 <main+112>         ; 49a JNE to 4f6 (#1)\n\n   0x0804849c <+22>:    mov    eax,DWORD PTR [ebx+0x4]\n   0x0804849f <+25>:    add    eax,0x4\n   0x080484a2 <+28>:    mov    eax,DWORD PTR [eax]\n   0x080484a4 <+30>:    sub    esp,0x8\n   0x080484a7 <+33>:    push   eax\n   0x080484a8 <+34>:    push   0x80485a0\n   # PRINT CHECKING\n   0x080484ad <+39>:    call   0x8048330 <printf@plt>       ; 4ad PRINTF\n   0x080484b2 <+44>:    add    esp,0x10\n   0x080484b5 <+47>:    mov    eax,DWORD PTR [ebx+0x4]\n   0x080484b8 <+50>:    add    eax,0x4\n   0x080484bb <+53>:    mov    eax,DWORD PTR [eax]\n   0x080484bd <+55>:    sub    esp,0x8\n   0x080484c0 <+58>:    push   0x80485b6\n   0x080484c5 <+63>:    push   eax\n   # COMPARE LICENSE\n   0x080484c6 <+64>:    call   0x8048320 <strcmp@plt>       ; 4c6 STRCMP returns 0 if equal\n   0x080484cb <+69>:    add    esp,0x10\n   0x080484ce <+72>:    test   eax,eax                      ; 4ce TEST EAX\n   0x080484d0 <+74>:    jne    0x80484e4 <main+94>          ; 4d0 JNE to 4e4 (#2)\n\n   0x080484d2 <+76>:    sub    esp,0xc\n   0x080484d5 <+79>:    push   0x80485c6\n   # PRINT WRONG\n   0x080484da <+84>:    call   0x8048340 <puts@plt>         ; 4da PUTS\n   0x080484df <+89>:    add    esp,0x10\n   0x080484e2 <+92>:    jmp    0x8048506 <main+128>         ; 4e2 JMP to 506 (#3)\n\n   0x080484e4 <+94>:    sub    esp,0xc                      ; 4e4 (#2)\n   0x080484e7 <+97>:    push   0x80485d6\n   # PRINT ACCESS\n   0x080484ec <+102>:   call   0x8048340 <puts@plt>         ; 4ec PUTS\n   0x080484f1 <+107>:   add    esp,0x10\n   0x080484f4 <+110>:   jmp    0x8048506 <main+128>         ; 4f4 JMP to 506 (#3)\n\n   # PRINT USAGE\n   0x080484f6 <+112>:   sub    esp,0xc                      ; 4f6 (#1)\n   0x080484f9 <+115>:   push   0x80485dd\n   0x080484fe <+120>:   call   0x8048340 <puts@plt>         ; 4fe PUTS\n   0x08048503 <+125>:   add    esp,0x10\n\n   # EXIT\n   0x08048506 <+128>:   mov    eax,0x0                      ; 506 (#3)\n   0x0804850b <+133>:   lea    esp,[ebp-0x8]\n   0x0804850e <+136>:   pop    ecx\n   0x0804850f <+137>:   pop    ebx\n   0x08048510 <+138>:   pop    ebp\n   0x08048511 <+139>:   lea    esp,[ecx-0x4]\n   0x08048514 <+142>:   ret    \nEnd of assembler dump.\n")),(0,r.kt)("p",null,"Crack manually"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'# step through the program\nbreak main\nrun\n\n# step into next instruction\nsi\n# step next instruction or ENTER\nni\n\nhelp\n# remove all breakpoints\ndelete\n\n# >>> hack\nbreak main\n# pass invalid key\nrun MY-KEY\ndisassemble main\n# copy JUMP address of "COMPARE LICENSE"\nbreak *0x080484ce\ncontinue\n# check EAX\ninfo registers\n# override return value of STRCMP\nset $eax=0\n')),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"TODO 0x06")),(0,r.kt)("p",null,"Reversing and Cracking first simple Program"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'# setup\ndocker run --rm --name reverse -p 5900:5900 -v "$(pwd)/liveoverflow:/share" strawhatsec/reverse\n\n# vnc\nvncviewer localhost:5900\n\n# ghidra\ndocker exec -it reverse bash\nghidra\n')),(0,r.kt)("hr",null),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"http://insecure.org/stf/smashstack.html"},"Smashing the Stack for Fun and Profit")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.youtube.com/watch?v=qtoS3CG6ht0"},"GHIDRA HYPE!! - NSA Reverse Engineering Tool"))),(0,r.kt)("p",null,"Challenges"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://crackmes.one/search"},"crackmes.one")),(0,r.kt)("li",{parentName:"ul"},"archive mirror of ",(0,r.kt)("a",{parentName:"li",href:"http://crackmes.cf/archive"},"crackmes.de")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://exploit.education"},"exploit.education"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/eLoopWoo/exploit-education-solutions"},"exploit-education-solutions")))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.vulnhub.com"},"VulnHub")," ",(0,r.kt)("strong",{parentName:"li"},"TODO")," on DigitalOcean with Vagrant - no network access")),(0,r.kt)("p",null,"Kernel"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://software.intel.com/content/www/us/en/develop/articles/intel-sdm.html"},"Intel 64 and IA-32 Architectures Software Developer Manuals"),": OPCODE vs SYSCALL",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.intel.de/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-instruction-set-reference-manual-325383.pdf"},"Instruction set reference")))),(0,r.kt)("li",{parentName:"ul"},"search ",(0,r.kt)("a",{parentName:"li",href:"https://elixir.bootlin.com/linux/latest/ident"},"kernel")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://filippo.io/linux-syscall-table"},"Searchable Linux Syscall Table for x86 and x86_64")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.kernel.org/doc/html/latest/x86/exception-tables.html"},"Example C to Assembler")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://gist.github.com/rkubik/b96c23bd8ed58333de37f2b8cd052c30"},"GDB cheat sheet"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"file hello\nhexdump hello -C\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"RIP: instrution pointer")),(0,r.kt)("p",null,"Output"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},'Dump of assembler code for function main:\n   0x0000000000001215 <+0>: push   rbp\n   0x0000000000001216 <+1>: mov    rbp,rsp\n   \n   # MAIN\n   # from output "break main": (gdb) break main, Breakpoint 1 at 0x1219\n   0x0000000000001219 <+4>: sub    rsp,0x10\n   0x000000000000121d <+8>: mov    DWORD PTR [rbp-0x4],edi\n   0x0000000000001220 <+11>:    mov    QWORD PTR [rbp-0x10],rsi\n   # argc == 2\n   0x0000000000001224 <+15>:    cmp    DWORD PTR [rbp-0x4],0x2\n   # (1a)(1b) JUMP NOT EQUAL\n   0x0000000000001228 <+19>:    jne    0x1283 <main+110>\n   \n   0x000000000000122a <+21>:    mov    rax,QWORD PTR [rbp-0x10]\n   0x000000000000122e <+25>:    add    rax,0x8\n   0x0000000000001232 <+29>:    mov    rax,QWORD PTR [rax]\n   0x0000000000001235 <+32>:    mov    rsi,rax\n   0x0000000000001238 <+35>:    lea    rdi,[rip+0xdc1]        # 0x2000\n   0x000000000000123f <+42>:    mov    eax,0x0\n   # (2b) PRINTF CHECKING\n   0x0000000000001244 <+47>:    call   0x1020 <printf@plt>\n   \n   0x0000000000001249 <+52>:    mov    rax,QWORD PTR [rbp-0x10]\n   0x000000000000124d <+56>:    add    rax,0x8\n   0x0000000000001251 <+60>:    mov    rax,QWORD PTR [rax]\n   0x0000000000001254 <+63>:    lea    rsi,[rip+0xdbb]        # 0x2016\n   0x000000000000125b <+70>:    mov    rdi,rax\n   # (3b)(1c) STRCMP return 0 if equal: man strcmp\n   0x000000000000125e <+73>:    call   0x1040 <strcmp@plt>\n   # BREAK POINT HERE <<<\n   0x0000000000001263 <+78>:    test   eax,eax\n   # (4b)(2c) JUMP NOT EQUAL\n   0x0000000000001265 <+80>:    jne    0x1275 <main+96>\n   \n   0x0000000000001267 <+82>:    lea    rdi,[rip+0xdb8]        # 0x2026\n   # (5b) PRINTF ACCESS\n   0x000000000000126e <+89>:    call   0x1030 <puts@plt>\n   0x0000000000001273 <+94>:    jmp    0x128f <main+122>\n   \n   0x0000000000001275 <+96>:    lea    rdi,[rip+0xdba]        # 0x2036\n   # (3c) PRINTF WRONG\n   0x000000000000127c <+103>:   call   0x1030 <puts@plt>\n   0x0000000000001281 <+108>:   jmp    0x128f <main+122>\n   \n   # (2a) PRINTF USAGE\n   0x0000000000001283 <+110>:   lea    rdi,[rip+0xdb3]        # 0x203d\n   0x000000000000128a <+117>:   call   0x1030 <puts@plt>\n   # (3a)(6b)(4c) EXIT\n   0x000000000000128f <+122>:   mov    eax,0x0\n   \n   0x0000000000001294 <+127>:   leave  \n   0x0000000000001295 <+128>:   ret    \nEnd of assembler dump.\n')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# ascii defines only from 0 to 7F\n# 0x7F (0111 1111) = 127 chars\n# 0xFF (1111 1111) = 255\n# 1 byte goes from 0x00 to 0xFF (0-255)\n# - every chars has an assigned number\n# - there are numbers that don't have a printable number assigned (weird values in VIM when opening a binary)\nman ascii\n\n# all printable chars\nstrings /share/license\n\n# non-printable chars\nhexdump -C /share/license\n\n# disassembly\nobjdump -d /share/license\n\nman syscall\nman syscalls\n\n# trace system calls and signals\nstrace ./license\nltrace ./license\n")),(0,r.kt)("p",null,"Output"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},'strace ./license AAA\nexecve("./license", ["./license", "AAA"], 0x7ffe79b59438 /* 74 vars */) = 0\nbrk(NULL)                               = 0x558a8cae4000\narch_prctl(0x3001 /* ARCH_??? */, 0x7fff9fa89ad0) = -1 EINVAL (Invalid argument)\naccess("/etc/ld.so.preload", R_OK)      = -1 ENOENT (No such file or directory)\nopenat(AT_FDCWD, "/etc/ld.so.cache", O_RDONLY|O_CLOEXEC) = 3\nfstat(3, {st_mode=S_IFREG|0644, st_size=84800, ...}) = 0\nmmap(NULL, 84800, PROT_READ, MAP_PRIVATE, 3, 0) = 0x7f5d84687000\nclose(3)                                = 0\nopenat(AT_FDCWD, "/lib/x86_64-linux-gnu/libc.so.6", O_RDONLY|O_CLOEXEC) = 3\nread(3, "\\177ELF\\2\\1\\1\\3\\0\\0\\0\\0\\0\\0\\0\\0\\3\\0>\\0\\1\\0\\0\\0\\360q\\2\\0\\0\\0\\0\\0"..., 832) = 832\npread64(3, "\\6\\0\\0\\0\\4\\0\\0\\0@\\0\\0\\0\\0\\0\\0\\0@\\0\\0\\0\\0\\0\\0\\0@\\0\\0\\0\\0\\0\\0\\0"..., 784, 64) = 784\npread64(3, "\\4\\0\\0\\0\\20\\0\\0\\0\\5\\0\\0\\0GNU\\0\\2\\0\\0\\300\\4\\0\\0\\0\\3\\0\\0\\0\\0\\0\\0\\0", 32, 848) = 32\npread64(3, "\\4\\0\\0\\0\\24\\0\\0\\0\\3\\0\\0\\0GNU\\0\\t\\233\\222%\\274\\260\\320\\31\\331\\326\\10\\204\\276X>\\263"..., 68, 880) = 68\nfstat(3, {st_mode=S_IFREG|0755, st_size=2029224, ...}) = 0\nmmap(NULL, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f5d84685000\npread64(3, "\\6\\0\\0\\0\\4\\0\\0\\0@\\0\\0\\0\\0\\0\\0\\0@\\0\\0\\0\\0\\0\\0\\0@\\0\\0\\0\\0\\0\\0\\0"..., 784, 64) = 784\npread64(3, "\\4\\0\\0\\0\\20\\0\\0\\0\\5\\0\\0\\0GNU\\0\\2\\0\\0\\300\\4\\0\\0\\0\\3\\0\\0\\0\\0\\0\\0\\0", 32, 848) = 32\npread64(3, "\\4\\0\\0\\0\\24\\0\\0\\0\\3\\0\\0\\0GNU\\0\\t\\233\\222%\\274\\260\\320\\31\\331\\326\\10\\204\\276X>\\263"..., 68, 880) = 68\nmmap(NULL, 2036952, PROT_READ, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f5d84493000\nmprotect(0x7f5d844b8000, 1847296, PROT_NONE) = 0\nmmap(0x7f5d844b8000, 1540096, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x25000) = 0x7f5d844b8000\nmmap(0x7f5d84630000, 303104, PROT_READ, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x19d000) = 0x7f5d84630000\nmmap(0x7f5d8467b000, 24576, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x1e7000) = 0x7f5d8467b000\nmmap(0x7f5d84681000, 13528, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f5d84681000\nclose(3)                                = 0\narch_prctl(ARCH_SET_FS, 0x7f5d84686540) = 0\nmprotect(0x7f5d8467b000, 12288, PROT_READ) = 0\nmprotect(0x558a8c9bb000, 4096, PROT_READ) = 0\nmprotect(0x7f5d846c9000, 4096, PROT_READ) = 0\nmunmap(0x7f5d84687000, 84800)           = 0\nfstat(1, {st_mode=S_IFCHR|0620, st_rdev=makedev(0x88, 0), ...}) = 0\nbrk(NULL)                               = 0x558a8cae4000\nbrk(0x558a8cb05000)                     = 0x558a8cb05000\nwrite(1, "Checking License: AAA\\n", 22Checking License: AAA\n) = 22\nwrite(1, "WRONG!\\n", 7WRONG!\n)                 = 7\nexit_group(0)                           = ?\n+++ exited with 0 +++\n')),(0,r.kt)("p",null,"Radare"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"TODO review 0x06")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"r2 license\naaa\ns sys.main\npdf\nVV\nV!\n")),(0,r.kt)("p",null,"Parser differential: program compiles but gdb and radare2 can't"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://www.sentinelone.com/blog/breaking-and-evading"},"https://www.sentinelone.com/blog/breaking-and-evading"),"\n",(0,r.kt)("a",{parentName:"p",href:"https://ioactive.com/striking-back-gdb-and-ida-debuggers-through-malformed-elf-executables/"},"https://ioactive.com/striking-back-gdb-and-ida-debuggers-through-malformed-elf-executables/")),(0,r.kt)("p",null,"Conversions"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Binary Data Structures ",(0,r.kt)("a",{parentName:"li",href:"https://pymotw.com/3/struct"},"struct")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://en.wikipedia.org/wiki/Endianness"},"Endianness")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://en.wikipedia.org/wiki/Two%27s_complement"},"Two's complement"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python"},'# binary to decimal\nint(\'1111\', 2)\n#15\n\nfor i in ["00000000", "00000010", "01010101", "11110010", "11111111"]:\n  print("{0} | {1:3} | {2:2x}".format(i, int(i, 2), int(i, 2)))\n#00000000 |   0 |  0\n#00000010 |   2 |  2\n#01010101 |  85 | 55\n#11110010 | 242 | f2\n#11111111 | 255 | ff\n\n>>> bin(123)\n\'0b1111011\'\n>>> hex(123)\n\'0x7b\'\n>>> hex(int(\'0b1111011\', 2))\n\'0x7b\'\n\n# I = unsigned integer\n')),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"setuid")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"setgid")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},'The Unix access rights flags setuid and setgid (short for "set user ID" and "set group ID") allow users to run an executable with the file system permissions of the executable\'s owner or group respectively and to change behaviour in directories. They are often used to allow users on a computer system to run programs with temporarily elevated privileges in order to perform a specific task.\n\n# example: see `s`\nll /usr/bin/passwd \nPermissions Size User Date Modified Name\n.rwsr-xr-x   68k root 28 May  2020  /usr/bin/passwd\n')),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"0x0C ",(0,r.kt)("a",{parentName:"li",href:"https://youtu.be/T03idxny9jE"},"video")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://exploit.education/protostar/stack-zero"},"stack0"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"gdb stack0\nset disassembly-flavor intel\ndisassemble main\nbreak main\nrun\nni\ninfo registers\n\n# map memory\ninfo proc mappings\n\nMapped address spaces:\n          Start Addr           End Addr       Size     Offset objfile\n      0x7fffd94cc000     0x7fffd94ed000    0x21000        0x0 [stack]\n\n# stack is bottom-up\n# register $ESP points to the top of the stack\n# ends to\n0x7fffd94cc000\n...\n# starts from (bottom)\n0x7fffd94ed000\n\n# inspect address\nx/wx $esp\n\ndefine hook-stop\n\n\n# print\npython3 -c 'print(\"A\"*64)'\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"# >>> ENTER\n# register RBP contains ?\n0x0000000000001215 <+0>:    push   rbp\n0x0000000000001216 <+1>:    mov    rbp,rsp\n# mask RSP to keep it nicely aligned ?\n0x0000000000001219 <+4>:    sub    rsp,0x70\n\n0x000000000000121d <+8>:    mov    DWORD PTR [rbp-0x64],edi\n0x0000000000001220 <+11>:   mov    QWORD PTR [rbp-0x70],rsi\n0x0000000000001224 <+15>:   mov    rax,QWORD PTR fs:0x28\n0x000000000000122d <+24>:   mov    QWORD PTR [rbp-0x8],rax\n0x0000000000001231 <+28>:   xor    eax,eax\n0x0000000000001233 <+30>:   mov    DWORD PTR [rbp-0x54],0x0\n0x000000000000123a <+37>:   lea    rax,[rbp-0x50]\n0x000000000000123e <+41>:   mov    rdi,rax\n0x0000000000001241 <+44>:   mov    eax,0x0\n0x0000000000001246 <+49>:   call   0x1020 <gets@plt>\n0x000000000000124b <+54>:   mov    eax,DWORD PTR [rbp-0x54]\n0x000000000000124e <+57>:   test   eax,eax\n0x0000000000001250 <+59>:   je     0x1260 <main+75>\n0x0000000000001252 <+61>:   lea    rdi,[rip+0xda7]        # 0x2000\n0x0000000000001259 <+68>:   call   0x1030 <puts@plt>\n0x000000000000125e <+73>:   jmp    0x126c <main+87>\n0x0000000000001260 <+75>:   lea    rdi,[rip+0xdc2]        # 0x2029\n0x0000000000001267 <+82>:   call   0x1030 <puts@plt>\n0x000000000000126c <+87>:   mov    eax,0x0\n0x0000000000001271 <+92>:   mov    rdx,QWORD PTR [rbp-0x8]\n0x0000000000001275 <+96>:   sub    rdx,QWORD PTR fs:0x28\n0x000000000000127e <+105>:  je     0x1285 <main+112>\n0x0000000000001280 <+107>:  call   0x1040 <__stack_chk_fail@plt>\n\n# <<< EXIT\n# LEAVE\u2014High Level Procedure Exit: Set RSP to RBP, then pop RBP.\n# Releases the stack frame set up by an earlier ENTER instruction.\n# The LEAVE instruction copies the frame pointer (in the EBP register) into the stack pointer register (ESP),\n# which releases the stack space allocated to the stack frame.\n0x0000000000001285 <+112>:  leave  \n0x0000000000001286 <+113>:  ret\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"# instruction pointer\nEIP\n# stack pointer\nESP\n# base pointer\nEBP\n\n# CALL\n# push address after EIP on the stack, then jump to main\n\n# LEA: load effective address\n# similar to MOV, instead of moving the content of a register offset into a register,\n# it moves the address of register offset into a register \n")),(0,r.kt)("p",null,"1) before enter main we push address of NEXT function on the stack\n2) enter main and we have 2 pointer:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"EBP is at the bottom of the stack frame"),(0,r.kt)("li",{parentName:"ul"},"ESP is at the top of the stack frame"),(0,r.kt)("li",{parentName:"ul"},"MOV + SUB create space between botto and top"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("blockquote",{parentName:"li"},(0,r.kt)("blockquote",{parentName:"blockquote"},(0,r.kt)("blockquote",{parentName:"blockquote"},(0,r.kt)("p",{parentName:"blockquote"},"internal variable are added from the bottom"))))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("blockquote",{parentName:"li"},(0,r.kt)("blockquote",{parentName:"blockquote"},(0,r.kt)("blockquote",{parentName:"blockquote"},(0,r.kt)("p",{parentName:"blockquote"},"parameter are added from the top")))))),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://github.com/NationalSecurityAgency/ghidra/issues/1495"},"https://github.com/NationalSecurityAgency/ghidra/issues/1495"),"\n",(0,r.kt)("a",{parentName:"p",href:"https://github.com/ProtonVPN/linux-cli/issues/297"},"https://github.com/ProtonVPN/linux-cli/issues/297")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"TODO 9.10")),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://exploit.education/downloads/"},"https://exploit.education/downloads/")))}m.isMDXComponent=!0},3905:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>x});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var s=a.createContext({}),p=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},c=function(e){var n=p(e.components);return a.createElement(s.Provider,{value:n},e.children)},m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},u=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(t),x=r,d=u["".concat(s,".").concat(x)]||u[x]||m[x]||o;return t?a.createElement(d,i(i({ref:n},c),{},{components:t})):a.createElement(d,i({ref:n},c))}));function x(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,i=new Array(o);i[0]=u;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var p=2;p<o;p++)i[p]=t[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}u.displayName="MDXCreateElement"}}]);