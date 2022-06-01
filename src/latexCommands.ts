export type LatexCommandGroup = {
    name: string,
    commands: string[]
}

const GREEKS_LOWERCASE: LatexCommandGroup = {
    name: 'Greek Symbols Lowercase',
    commands: [
        '\\alpha',
        '\\beta',
        '\\gamma',
        '\\delta',
        '\\epsilon',
        '\\varepsilon',
        '\\zeta',
        '\\eta',
        '\\theta',
        '\\vartheta',
        '\\iota',
        '\\kappa',
        '\\varkappa',
        '\\lambda',
        '\\mu',
        '\\nu',
        '\\xi',
        '\\omicron',
        '\\pi',
        '\\varpi',
        '\\rho',
        '\\varrho',
        '\\sigma',
        '\\varsigma',
        '\\tau',
        '\\upsilon',
        '\\phi',
        '\\varphi',
        '\\chi',
        '\\psi',
        '\\omega'
    ]
}
const GREEKS_UPERCASE: LatexCommandGroup = {
    name: 'Greek Symbols Uppercase',
    commands: [
        '\\Gamma',
        '\\Delta',
        '\\Theta',
        '\\Lambda',
        '\\Xi',
        '\\Pi',
        '\\Sigma',
        '\\Upsilon',
        '\\Phi',
        '\\Psi',
        '\\Omega'
    ]
}

const SET_SYMBOLS: LatexCommandGroup = {
    name: 'Set Theory',
    commands: [
        '\\mathbb{N}',
        '\\mathbb{Z}',
        '\\mathbb{Q}',
        '\\mathbb{R}',
        '\\mathbb{C}',
        '\\in',
        '\\notin',
        '\\ni',
        '\\subseteq',
        '\\subset',
        '\\supseteq',
        '\\supset',
        '\\cup',
        '\\cap',
        '\\times',
        '\\setminus',
        '\\mathcal{P}(X)',
        '\\bigcup_{i \\in I} A_i',
        '\\bigcap_{i \\in I} A_i',
        '\\mathcal{S}',
        'f : A \\rightarrow B',
        '\\uplus'
    ]
}

const RELATIONS: LatexCommandGroup = {
    name: 'Relations',
    commands: [
        '\\equiv',
        '\\approx',
        '\\cong',
        '\\neq',
        '\\sim',
        '<',
        '\\leq',
        '\\nleq',
        '\\prec',
        '\\nprec',
        '\\preceq',
        '\\npreceq',
        '\\succ',
        '\\succeq',
        '\\nsucc',
        '\\nsucceq',
        '\\ll',
        '\\lll',
        '\\sqsubset',
        '\\sqsubseteq',
        '\\sqsupset',
        '\\sqsupseteq',
        '>',
        '\\ngtr',
        '\\geq',

    ]
}

const LOGIC_SYMBOLS: LatexCommandGroup = {
    name: 'Logic',
    commands: [
        '\\exists',
        '\\exists!',
        '\\nexists',
        '\\forall',
        '\\neg',
        '\\land',
        '\\lor',
        '\\Rightarrow',
        '\\Leftarrow',
        '\\Leftrightarrow',
        '\\top',
        '\\bot',
        '\\vdash',
        '\\models'
    ]
}

const LINEAR_ALGEBRA: LatexCommandGroup = {
    name: 'Linear Algebra',
    commands: [
        '\\mathbb{K}',
        '\\mathbb{K}^n',
        '\\mathbb{K}^{n \\times m}',
        '\\mathbb{K}[X]',
        '\\mathbb{K}[\\![ X ]\\!]',
        '\\oplus',
        '\\otimes',
        '\\hat p',
        '\\langle x, y \\rangle',
        '\\begin{pmatrix}x_1 \\\\ x_2 \\\\ x_3 \\end{pmatrix}',
        '\\begin{pmatrix}a & b \\\\ c & d \\end{pmatrix}',
        '\\begin{pmatrix}a & b & c \\\\ d & e & f \\\\ g & e & h \\end{pmatrix}',
        '\\left | \\begin{array}{rrr} a & b & c \\\\ c & d & e \\\\ f & g & h \\end{array} \\right |',
        '\\det A',
        '\\ker A',
        '\\text{im } A',
    ]
}

const CALCULUS: LatexCommandGroup = {
    name: 'Calculus',
    commands: [
        '\\frac{\\partial f}{\\partial x_i}',
        '\\frac{d f}{d x}',
        '\\int_a^b f(x) dx',
        '\\lim_{x \\rightarrow a} f(x)',
        '\\infty',
        '\\sum_{i = 0}^{\\infty} a_i',
        '\\prod_{i = 0}^{\\infty} a_i',
        '\\sin',
        '\\cos',
        '\\tan',
        '\\arcsin',
        '\\arccos',
        '\\arctan'
    ]
}

const ARITHMETIC_OPERATORS: LatexCommandGroup = {
    name: 'Arithmetic',
    commands: [
        '+',
        '*',
        '\\cdot',
        '\\div',
        '\\frac{a}{b}'
    ]
}


export const COMMAND_GROUPS: LatexCommandGroup[] = [
    ARITHMETIC_OPERATORS,
    LINEAR_ALGEBRA,
    CALCULUS,
    RELATIONS,
    SET_SYMBOLS,
    LOGIC_SYMBOLS,
    GREEKS_LOWERCASE,
    GREEKS_UPERCASE
]
