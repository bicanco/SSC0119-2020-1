interface Register {
    code: string;
}

export const registers: {[key: string]: Register} = {
    R0: { code: '000' },
    R1: { code: '001' },
    R2: { code: '010' },
    R3: { code: '011' },
    R4: { code: '100' },
    R5: { code: '101' },
    R6: { code: '110' },
    R7: { code: '111' },
};

export function getRegister(code: string) {
    return Object.keys(registers).find(key => registers[key].code === code);
}
