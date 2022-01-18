---
sidebar_position: 2
id: the-shellcoder-s-handbook
title: The Shellcoder's Handbook
---

# The Shellcoder's Handbook

[The Shellcoder's Handbook (2007)](https://www.wiley.com/en-us/The+Shellcoder%27s+Handbook%3A+Discovering+and+Exploiting+Security+Holes%2C+2nd+Edition-p-9780470080238)

## Introduction

This book is about code and data, and what happens when the two become confused

## Chapter 1

### Extra resources

* [Computer Science 217: Introduction to Programming Systems (Spring 2004)](https://www.cs.princeton.edu/courses/archive/spring04/cos217)
* [Linux Memory Management](https://linux-mm.org)
* [GDB: The GNU Project Debugger](https://www.sourceware.org/gdb/documentation)

### Notes

A modern computer makes no real distinction between instructions and data. If a processor can be fed instructions when it should be seeing data, it will happily go about executing the passed instructions. This characteristic makes system exploitation possible. The goal is to gain control of execution.

> Understand memory management on Linux Intel Architecture, 32 Bit (IA32)

When a program is executed, it is laid out in an organized manner i.e. various elements of the program are mapped into memory:
1. the operating system creates an address space in which the program will run. This address space includes the actual program instructions as well as any required data
2. information is loaded from the program's executable file to the newly created address space. There are three types of segments: `.text`, `.bss`, and `.data`
    * the `.text` segment is mapped as read-only, whereas `.data` and `.bss` are writable
    * the `.bss` and `.data` segments are reserved for global variables
    * the `.data` segment contains static initialized data
    * the `.bss` segment contains uninitialized data
    * the `.text` segment holds the program instructions
3. the stack and the heap are initialized
    * the stack is a *Last In First Out* (LIFO) data structure: items are pushed or popped
    * the stack stores local variables, information relating to function calls, and other information used to clean up the stack after a function or procedure is called
    * the stack *grows down the address space* : as more data is added to the stack, it is added at increasingly lower address values
    * the heap is (roughly) a *First In First Out* (FIFO) data structure: data is placed and removed from the heap as it builds
    * the heap is another data structure used to hold program information, more specifically, dynamic variables
    * the heap *grows up the address space* : as data is added to the heap, it is added at an increasingly higher address value

```
↑ Lower addresses (0x08000000)
Shared libraries
.text
.bss
Heap (grows ↓)
Stack (grows ↑)
env pointer
Argc
↓ Higher addresses (0xbfffffff)
```

* **Assembly** - Exploiting security holes requires a firm grasp of assembly language, because most exploits will require you to write (or modify existing) code in assembly
* **Registers** - Understanding how the registers work and how they are manipulated via assembly is essential for vulnerability development and exploitation. Registers can be accessed, read, and changed with assembly
    * *General-purpose* registers are used to perform a range of common mathematical operations. They include registers such as `EAX`, `EBX`, and `ECX` for the IA32, and can be used to store data and addresses, offset addresses, perform counting functions, and many other things
    * A general-purpose register to take note of is the *extended stack pointer* register `ESP` or simply the *stack pointer*.`ESP` points to the memory address where the next stack operation will take place
    * *Segment* register on an IA32 processor are 16 bit (other registers are 32 bits in size). Segment registers, such as `CS`, `DS`, and `SS`, are used to keep track of segments and to allow backward compatibility with 16-bit applications
    * *Control* registers are used to control the function of the processor. The most important of these registers for the IA32 is the *Extended Instruction Pointer* `EIP` or simply the *Instruction Pointer*. `EIP` contains the address of the next machine instruction to be executed
    * Other registers include *Extended Flags* `EFLAGS` register, which comprises many single-bit registers that are used to store the results of various tests performed by the processor
