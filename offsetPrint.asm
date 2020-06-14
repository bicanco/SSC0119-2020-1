jmp main            ; jump to the main function

; >>>>>>>>>>>> CONSTANTS
ParityTest: var #1
static ParityTest + #0, #2

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
TestLaneChar0: string ">a=f=k=p=FIRST LINE OF TEST LANE=t=y=d=<"
TestLaneChar1: string ">b=g=l=?=SCOND LINE OF TEST LANE=u=z=e=<"
TestLaneChar2: string ">c=h=m=q=THIRD LINE OF TEST LANE=v=a=f=<"
TestLaneChar3: string ">d=i=n=r=FORTH LINE OF TEST LANE=w=b=g=<"
TestLaneChar4: string ">e=j=o=s=FIFTH LINE OF TEST LANE=x=c=h=<"

; >>>>>>>>>>>> GLOBAL VARIABLES
globalOffset: var #2          ; current line offset = [positive/left, negative/right]
currentLaneBase: var #1       ; current lane base positions

; >>>>>>>>>>>> FUNCTIONS

; === MAIN ===
main:
  call globalInit             ; init global variables

  loadn r0, #FirstLaneBasePos ; r0 = FirstLaneBasePos[]
  store currentLaneBase, r0   ; currentLaneBase = FirstLaneBasePos[]

mainLoop:
  breakp
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

  outchar r3, r4              ; print r3 content in r4 position

  inc r1                      ; incrementing charCounter
  inc r2                      ; incrementing charPointer

  jmp printLaneCharLoop       ; restart the print loop with the next char

printLaneCharEnd:             ; === PRINTLANE > CHAR > END ===
  inc r0                      ; incrementing lineCounter
  jmp printLaneLine           ; starting printing the next line

printLaneEnd:                 ; === PRINTLANE > END ===
  pop r7                      ; recovering registers
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

  pop r2                      ; recovering registers
  pop r1
  pop r0

  rts                         ; return to main function
