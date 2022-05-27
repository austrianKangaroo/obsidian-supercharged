export type LatexCommandGroup = {
    name : string,
    commands : string[]
}

const GREEKS : LatexCommandGroup = {
	name : 'Greek lowercase letters',
	commands : [
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

const SET_SYMBOLS : LatexCommandGroup = {
	name : 'set theory',
	commands : [
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
    '\\mathcal{P}(X)',
    '\\bigcup_{i \\in I} A_i',
    '\\bigcap_{i \\in I} A_i',
    '\\mathcal{S}'
]
}

const LOGIC_SYMBOLS : LatexCommandGroup = {
	name : 'logic symbols',
	commands : [
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

const MATH_OPERATORS : LatexCommandGroup = {
	name : 'math operators',
	commands : [
	'+',
	'*',
	'\\cdot',
	'\\oplus', 
	'\\sum_{i=1}^n a_i',
	'\\int_a^b f(x)dx'
]
}


export const COMMAND_GROUPS : LatexCommandGroup[] = [
	GREEKS,
	MATH_OPERATORS, 
	SET_SYMBOLS,
	LOGIC_SYMBOLS
]
