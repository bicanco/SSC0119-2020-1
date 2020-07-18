jmp main            ; jump to the main function

; >>>>>>>>>>>> CONSTANTS
ParityTest: var #1
static ParityTest + #0, #2

OffsetCounterMax: var #1
static OffsetCounterMax + #0, #5

ScreenWidth: var #1
static ScreenWidth + #0, #40

ScreenHeight : var #1
static ScreenHeight + #0, #30

StringEnd: var #1
static StringEnd + #0, #'\0'

LaneSize: var #1
static LaneSize + #0, #5

FirstLaneBasePos: var #5
static FirstLaneBasePos + #0, #40
static FirstLaneBasePos + #1, #80
static FirstLaneBasePos + #2, #120
static FirstLaneBasePos + #3, #160
static FirstLaneBasePos + #4, #200

; >>>>>>>>>>>> STRINGS
TestLaneChars: var #5
TestLaneChar0: string "=====<<<<>=====<<<<>=====<<<<>=====<<<<>"
TestLaneChar1: string "wwwwttttwwwwwwwttttwwwwwwwwwwttttwwwwwww"
TestLaneChar2: string "==cb=======cb====cb======cb======cb====="
TestLaneChar3: string "=====cb========cb===cb========cb======cb"
TestLaneChar4: string "gGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgGgG"

; >>>>>>>>>>>> GLOBAL VARIABLES
globalOffset: var #2          ; current line offset = [positive/left, negative/right]
currentLaneBase: var #1       ; current lane base positions

frogPos: var #1
static frogPos + #0, #240     ; initial frog position

offsetCounter: var #1
static offsetCounter + #0, #0 ; initial offset change counter
; >>>>>>>>>>>> FUNCTIONS

; === MAIN ===
main:
  call globalInit             ; init global variables

  loadn r0, #FirstLaneBasePos ; r0 = FirstLaneBasePos[]
  store currentLaneBase, r0   ; currentLaneBase = FirstLaneBasePos[]

mainLoop:
;  breakp
  call moveFrog               ; call move Frog
  call printFrog              ; call print Frog
  call printLane              ; call print first lane
  call updateOffset           ; call update offset
  jmp mainLoop                ; test loop

  halt                        ; end of program


; === GLOBALINIT ===
globalInit:                   ; === GLOBALINIT ===
  push r0                     ; protecting registers
  push r1

  loadn r0, #globalOffset     ; r0 = *globalOffset[0]
  loadn r1, #10                ; default positive global offset
  storei r0, r1               ; globalOffset[0] = positive offset

  inc r0                      ; r0 = *globalOffset[1]
  loadn r1, #30               ; default negative global offset
  storei r0, r1               ; globalOffset[1] = negative offset

globalInitLanes:              ; === GLOBALINIT > LANES ===
  loadn r0, #TestLaneChars    ; r0 = TestLaneChars[0]
  loadn r1, #TestLaneChar0    ; r1 = *TestLaneChar0
  storei r0, r1               ; TestLaneChars[0] = TestLaneChar0

  inc r0                      ; r0 = TestLaneChars[1]
  loadn r1, #TestLaneChar1    ; r1 = *TestLaneChar1
  storei r0, r1               ; TestLaneChars[1] = TestLaneChar1

  inc r0                      ; r0 = TestLaneChars[2]
  loadn r1, #TestLaneChar2    ; r1 = *TestLaneChar2
  storei r0, r1               ; TestLaneChars[2] = TestLaneChar2

  inc r0                      ; r0 = TestLaneChars[3]
  loadn r1, #TestLaneChar3    ; r1 = *TestLaneChar3
  storei r0, r1               ; TestLaneChars[3] = TestLaneChar3

  inc r0                      ; r0 = TestLaneChars[4]
  loadn r1, #TestLaneChar4    ; r1 = *TestLaneChar4
  storei r0, r1               ; TestLaneChars[4] = TestLaneChar4

globalInitEnd:                ; === GLOBALINIT > END ===
  pop r1                      ; recovering registers
  pop r0

  rts                         ; return to main function


; === PRINTLANE ===
printLane:                    ; === PRINTLANE ===
  push r0                     ; protecting registers
  push r1
  push r2
  push r3
  push r4
  push r5
  push r6
  push r7

  loadn r0, #0                ; r0 = lineCounter
  loadn r1, #0                ; r1 = charCounter

printLaneLine:                ; === PRINTLANE > LINE ===
  load r7, LaneSize           ; r7 = comparation limit; r7 = LaneSize
  cmp r7, r0                  ; comparing lineCounter with LaneSize
  jeq printLaneEnd            ; lineCounter === LaneSize -> jump to end

printLaneChar:                ; === PRINTLANE > CHAR ===
  loadn r2, #TestLaneChars    ; r2 = linePointer
  add r2, r2, r0              ; r2 = linePointer[lineCounter]
  loadi r2, r2                ; r2 = charPointer

  loadn r1, #0                ; r1 = 0; reseting charCounter

printLaneCharLoop:            ; === PRINTLANE > CHAR > LOOP ===
  loadi r3, r2                ; r3: char to be printed; r3 = charPointer[X]

  load r7, StringEnd          ; r7 = StringEnd
  cmp r7, r3                  ; comparing char with StringEnd
  jeq printLaneCharEnd        ; char === StringEnd -> jump to charEnd, ending line printing

  load r7, ParityTest         ; r7 = ParityTest = 2
  mod r7, r0, r7              ; r7 = lineCounter % 2

  loadn r4, #globalOffset     ; r4: position to be printed; r4 = *globalOffset
  add r4, r4, r7              ; r4 = *globalOffset[lineCounter % 2]
  loadi r4, r4                ; r4 = correct global offset

  add r4, r4, r1              ; r4 = (globalOffset + charCounter)

  load r7, ScreenWidth        ; r7 = screenWidth
  mod r4, r4, r7              ; r4 = (globalOffset + charCounter) % screenWidth

  load r7, currentLaneBase    ; r7 = currentLaneBase[]
  add r7, r7, r0              ; r7 = currentLaneBase[lineCounter]
  loadi r7, r7                ; r7 = lineBase
  add r4, r4, r7              ; r4 = ((globalOffset + charCounter) % screenWidth) + lineBase

  ;=== checking object colors
  ;===== grass
  loadn r5, #512              ; loading color green
  loadn r6, #'g'
  cmp r3, r6
  jeq continue

  loadn r6, #'G'
  cmp r3, r6
  jeq continue

  ;===== river
  loadn r5, #3072              ; loading color blue
  loadn r6, #'w'
  cmp r3, r6
  jeq continue

  ;===== trunk
  loadn r5, #256              ; loading color brown
  loadn r6, #'t'
  cmp r3, r6
  jeq continue

  ;===== car
  loadn r5, #2304              ; loading color red
  loadn r6, #'c'
  cmp r3, r6
  jeq continue

  loadn r6, #'b'
  cmp r3, r6
  jeq continue

  ;===== street
  loadn r5, #2048              ; loading color gray
  loadn r6, #'='
  cmp r3, r6
  jeq continue

  ;===== truck
  loadn r5, #2560              ; loading color lima
  loadn r6, #'>'
  cmp r3, r6
  jeq continue

  loadn r5, #3584              ; loading color lima
  loadn r6, #'<'
  cmp r3, r6
  jeq continue

  ;===== none
  loadn r5, #0               ; loading color green

continue:
  add r3, r3, r5              ; coloring char
  outchar r3, r4              ; print r3 content in r4 position

  inc r1                      ; incrementing charCounter
  inc r2                      ; incrementing charPointer

  jmp printLaneCharLoop       ; restart the print loop with the next char

printLaneCharEnd:             ; === PRINTLANE > CHAR > END ===
  inc r0                      ; incrementing lineCounter
  jmp printLaneLine           ; starting printing the next line

printLaneEnd:                 ; === PRINTLANE > END ===
  pop r7                      ; recovering registers
  pop r5
  pop r6
  pop r4
  pop r3
  pop r2
  pop r1
  pop r0

  rts                         ; return to main function


; === UPDATEOFFSET ===
updateOffset:                 ; === UPDATEOFFSET ===
  push r0                     ; protecting registers
  push r1
  push r2

  load r0, offsetCounter      ; r0 = offsetCounter
  load r1, OffsetCounterMax   ; r1 = OffsetCounterMax
  cmp r0, r1                  ; offsetCounter == OffsetCounterMax?
  jne updateOffsetCount       ; if isn't max yet, don't update the offset and count

  load r0, ScreenWidth        ; r0 = ScreenWidth
  loadn r1, #globalOffset     ; r1 = *globalOffset[0=pos]

  loadi r2, r1                ; r2 = globalOffset[0=pos]
  inc r2                      ; r2 = globalOffset[0=pos] + 1
  mod r2, r2, r0              ; r2 = (globalOffset[0=pos] + 1) % ScreenWidth
  storei r1, r2               ; globalOffset[0=pos] updated

  inc r1                      ; r1 = *globalOffset[1=neg]
  loadi r2, r1                ; r2 = globalOffset[1=neg]
  add r2, r2, r0              ; sum with ScreenWidth to not have negative values
  dec r2                      ; r2 = globalOffset[1=neg] - 1
  mod r2, r2, r0              ; r2 = (globalOffset[1=neg] - 1) % ScreenWidth
  storei r1, r2               ; globalOffset[1=neg] updated

  loadn r0, #0                ; r0 = 0
  store offsetCounter, r0     ; offsetCounter = 0 (reseted)
  jmp updateOffsetEnd         ; end function

updateOffsetCount:            ; === UPDATEOFFSET > COUNT ===
  load r0, offsetCounter      ; r0 = offsetCounter
  inc r0                      ; r0 = offsetCounter + 1
  store offsetCounter, r0     ; offsetCounter++

updateOffsetEnd:              ; === UPDATEOFFSET > END ===
  pop r2                      ; recovering registers
  pop r1
  pop r0

  rts                         ; return to main function


; === PRINTFROG ===
printFrog:                    ; === PRINTFROG ===
  push r0
  push r1
  push r2
                ;============================= ESCOLHER O CARACTER COM O SPRITE DO SAPO =======================================
  loadn r0, #'A'              ; r0 = frogSprite
  load r1, frogPos            ; r1 = frogPosition
  loadn r2, #512              ; r2 = Green Color
  add r0, r0, r2              ; colouring frog Sprite
  outchar r0, r1              ; printing frog sprite

  pop r2
  pop r1
  pop r0

  rts                         ; return to main function

; === ERASEFROG ===
eraseFrog:                    ; === ERASEFROG ===
  push r0
  push r1
  push r2

  loadn r0, #' '
  load r1, frogPos
  loadn r2, #0
  add r0, r0, r2
  outchar r0, r1

  pop r2
  pop r1
  pop r0

  rts

; === MOVEFROG ===
moveFrog:                     ; === MOVEFROG ===
  push r0
  push r1

  call eraseFrog

  inchar r1                   ; r1 = userInput

  loadn r0, #'a'              ; r0 = comparisonCharacter
  cmp r0, r1                  ; comparing characters
  ceq moveFrogCalcLeft        ; If (userInput = comparisonCharacter = a) moveFrogCalcLeft

  loadn r0, #'d'              ; r0 = comparisonCharacter
  cmp r0, r1                  ; comparing characters
  ceq moveFrogCalcRight       ; If (userInput = comparisonCharacter = a) moveFrogCalcRight

  loadn r0, #'w'              ; r0 = comparisonCharacter
  cmp r0, r1                  ; comparing characters
  ceq moveFrogCalcUp          ; If (userInput = comparisonCharacter = a) moveFrogCalcUp

  loadn r0, #'s'              ; r0 = comparisonCharacter
  cmp r0, r1                  ; comparing characters
  ceq moveFrogCalcDown        ; If (userInput = comparisonCharacter = a) moveFrogCalcDown

  pop r1
  pop r0
  rts                         ; return to main function


moveFrogCalcUp:               ; === MOVEFROG > CALC > UP ===
  push r0
  push r1

  load r0, frogPos            ; r0 = frog Pos
  loadn r1, #40               ; r0 = frog Pos
  sub r0, r0, r1              ; frog Pos = frog pos - 40 = go up

  store frogPos, r0           ; store new frog position

  pop r1
  pop r0

  rts


moveFrogCalcDown:             ; === MOVEFROG > CALC > DOWN ===
  push r0
  push r1

  load r0, frogPos            ; r0 = frog Pos
  loadn r1, #40               ; r1 = 40
  add r0, r0, r1              ; frog Pos = frog pos + 40 = go down

  store frogPos, r0           ; store new frog position

  pop r1
  pop r0

  rts


moveFrogCalcLeft:             ; === MOVEFROG > CALC > LEFT ===
  push r0
  push r1
  push r2
  push r3

  load r0, frogPos            ; r0 = frog Pos
  loadn r1, #1                ; r1 = 1
  sub r0, r0, r1              ; frog Pos = frog pos - 1 = go left


moveFrogBorderLeft:           ; === MOVEFROG > BORDER > LEFT ===
  loadn r3, #40               ; r3 = 40
  loadn r2, #39               ; r2 = 39

  mod r1, r0, r3              ; r1 = new frog Pos % 40
  cmp r1, r2                  ; comparing r1 and r2
  jne moveFrogStore           ; If (r1 != r2) = (new frog Pos % 40 != 39) Save new frog pos

  add r0, r0, r3              ; Else r0 = r0 + 40 = Frog move one line down


moveFrogCalcRight:            ; === MOVEFROG > CALC > RIGHT ===
  push r0
  push r1
  push r2
  push r3

  load r0, frogPos            ; r0 = frog Pos
  loadn r1, #1                ; r1 = 1
  add r0, r0, r1              ; frog Pos = frog pos - 1 = go right


moveFrogBorderRight:          ; === MOVEFROG > BORDER > RIGHT ===
  loadn r3, #40               ; r3 = 40
  loadn r2, #0                ; r2 = 39

  mod r1, r0, r3              ; r1 = new frog Pos % 40
  cmp r1, r2                  ; comparing r1 and r2
  jne moveFrogStore                 ; If (r1 != r2) = (new frog Pos % 40 != 39) Save new frog pos

  sub r0, r0, r3              ; Else r0 = r0 + 40 = Frog move one line down


moveFrogStore:                ; === MOVEFROG > STORE ===
  store frogPos, r0           ; Store frog pos

  pop r3
  pop r2
  pop r1
  pop r0

  rts


