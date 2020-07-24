interface Instruction {
    code: string;
    alais: string;
}

export const instructions: {[key: string]: Instruction} = {
    load: { alais: 'load', code: '110000' },
    store: { alais: 'store', code: '110001' },
    noop: { alais: 'noop', code: '000000' },
};
