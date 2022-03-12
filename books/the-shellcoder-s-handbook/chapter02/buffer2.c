#include <stdio.h>
#include <string.h>

// gcc -g buffer2.c -o buffer2.out
int main () {
  int array[5];
  int i;

  for (i=0; i<=255; i++) {
    array[i] = 10;
  }
}

/*

# TODO force core dump output
ulimit -c unlimited
-bash: ulimit: core file size: cannot modify limit: Operation not permitted

OUTPUT

./buffer2.out 
*** stack smashing detected ***: terminated
Aborted (core dumped)

*/
