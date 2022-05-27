export type LatexCommandGroup = {
    name: string,
    commands: string[]
}

const GREEKS: LatexCommandGroup = {
    name: 'Greek lowercase letters',
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
        '\\bot'
    ]
}

const LINEAR_ALGEBRA: LatexCommandGroup = {
    name: 'Linear Algebra',
    commands: [
        '\\mathbb{K}',
        '\\mathbb{K}^n',
        '\\mathbb{K}^{n \\times m}',
        '\\oplus',
        '\\otimes'
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

const MATH_OPERATORS: LatexCommandGroup = {
    name: 'math operators',
    commands: [
        '+',
        '*',
        '\\cdot',
        '\\oplus',
        '\\sum_{i=1}^n a_i',
        '\\int_a^b f(x)dx'
    ]
}


export const COMMAND_GROUPS: LatexCommandGroup[] = [
    GREEKS,
    MATH_OPERATORS,
    RELATIONS,
    SET_SYMBOLS,
    LOGIC_SYMBOLS,
    LINEAR_ALGEBRA,
    CALCULUS
]
