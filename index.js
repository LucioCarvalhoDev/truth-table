import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * @returns {string}
 */
function prompt(query = '') {
    return new Promise(resolve => {
        rl.question(query, (res) => {
            rl.close();
            resolve(res);
        });
    });
}

async function truthTable() {
    let expression = await prompt("INSIRA A EXPRESSÂO BOOLEANA: ");
    expression = expression
        .replace(/\n/, '')
        .replace(/\r/, '')
        .replace('+', '||')
        .replace('*', '&&');

    let terms = expression.split('').filter(char => /[a-zA-Z]/.test(char));
    terms = Array.from(new Set(terms));

    const res = [];
    const rKey = Symbol('rKey');

    for (let i = 0; i < 2 ** terms.length; i++) {
        const termsAndValues = {};
        const values = "0000" + Number(i).toString(2);
        let str = '';

        terms.forEach((value, idx) => {
            termsAndValues[value] = values[values.length - idx - 1];
        });

        // declaration
        for (let prop in termsAndValues) {
            str += `let ${prop} = ${termsAndValues[prop]};`;
        }

        str += expression;

        res[i] = { ...termsAndValues, [rKey]: !!eval(str) };
    }

    function assembleTable(terms, resolutions) {
        const header = `${terms.map(n => `|  ${n}  `)}|  r  |\n`.replace(',', '');
        const lines = resolutions.map(line => {
            let str = '';
            for (let prop in line) {
                str += `|  ${line[prop]}  `;
            }

            return str + `|  ${Number(line[rKey])}  |` + '\n';
        }).join('');

        return (header + lines).replace(',', '');
    }
    console.log(assembleTable(terms, res));

}

(await truthTable());