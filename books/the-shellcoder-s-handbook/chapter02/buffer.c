#include <stdio.h>
#include <string.h>

// gcc -g buffer.c -o buffer.out
int main () {
  int array[5] = {1, 2, 3, 4, 5};
  printf("%d\n", array[5]);
}

/*

OUTPUT

./buffer.out 
532615680
./buffer.out 
72611328
./buffer.out 
-923382784
./buffer.out 
373869824
./buffer.out 
-1674137856

*/
