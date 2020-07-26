interface Instruction {
    code: string;
    alais: string;
}

export const instructions: {[key: string]: Instruction} = {
    store: { alais: 'store', code: '110001' },
    load: { alais: 'load', code: '110000' },

    loadi: { alais: 'loadi', code: '111100' },
    storei: { alais: 'storei', code: '111101' },

    loadn: { alais: 'loadn', code: '111000' },

    mov: { alais: 'mov', code: '110011' },

    add: { alais: 'add', code: '100000' },

    sub: { alais: 'sub', code: '100001' },

    mult: { alais: 'mult', code: '100010' },

    div: { alais: 'div', code: '100011' },

    inc: { alais: 'inc', code: '100100' },

    mod: { alais: 'mod', code: '100101' },

    and: { alais: 'and', code: '010010' },
    or: { alais: 'or', code: '010011' },
    xor: { alais: 'xor', code: '010100' },

    not: { alais: 'not', code: '010101' },

    cmp: { alais: 'cmp', code: '010110' },

    inchar: { alais: 'inchar', code: '110101' },
    outchar: { alais: 'outchar', code: '110010' },

    halt: { alais: 'halt', code: '001111' },
    noop: { alais: 'noop', code: '000000' },
    breakp: { alais: 'breakp', code: '001110' },
};
