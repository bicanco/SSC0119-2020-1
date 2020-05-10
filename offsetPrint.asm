jmp main            ; jump to the main function

; CONSTANTS
SCREEN_WIDTH : var #40
SCREEN_HEIGHT: var #30

; DECLARATIONS
; testString : string "0123456789012345678901234567890123456789"
testString : string "=A====B====||||===CCC===TRT=====345====="

; MAIN FUNCTION
main:                       ; main game loop function
  loadn r0, #40              ; r0: base print position
  loadn r1, #testString     ; r1: string pointer
  loadn r2, #5              ; r2: print offset

mainPrint:
  call print                ; call print function
  inc r2                    ; increment offset
  loadn r1, #testString

  breakp
  jmp mainPrint

  halt                      ; end of program

; SUB FUNCTIONS
print:                      ; > PRINT
  push r0
  push r1
  push r2

  loadn r3, #'\0'           ; r3: stop condition
  loadn r4, #40             ; r4: offset max (to use in mod operation)
  loadn r5, #0              ; r5: print counter
  loadn r6, #0              ; r6: position to print
  loadn r7, #0              ; r7: char to print

printLoop:                  ; >> PRINT LOOP
  loadi r7, r1              ; reading the character

  cmp r7, r3                ; comparing the char with the stop condition
  jeq printEnd              ; end printing if stop condition achieved

  add r6, r2, r5            ; pos = (offset + counter)
  mod r6, r6, r4            ; pos = ((offset + counter) % max)
  add r6, r6, r0            ; pos = ((offset + counter) % max) + base

  outchar r7, r6            ; print the char in the screen

  inc r5                    ; increment the counter
  inc r1                    ; increment the string pointer
  jmp printLoop             ; continue the loop

printEnd:                   ; >> PRINT END
  pop r2
  pop r1
  pop r0

  rts                       ; return PRINT function
