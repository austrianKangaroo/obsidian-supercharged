import { Editor, ItemView, MarkdownView, Plugin, renderMath, WorkspaceLeaf } from 'obsidian';

// Remember to rename these classes and interfaces!


const LatexContextViewType = 'latex-context-view'

export default class MyPlugin extends Plugin {
	//settings: MyPluginSettings;

	latexContextView : LatexContextView;
	latexLeaf : WorkspaceLeaf;

	onload() {
		//await this.loadSettings();

		this.registerView(LatexContextViewType, leaf => (this.latexContextView = new LatexContextView(leaf)));

		this.addCommand({
			id: 'open-latex-leaf',
			name: 'Open Latex Leaf',
			editorCallback: (editor: Editor, view : MarkdownView) => {
				if(this.latexContextView && this.latexContextView.visible) {
					this.app.workspace.setActiveLeaf(this.latexLeaf);
					return;
				} // only spawn a new view if none is available

				this.latexLeaf = this.app.workspace.getRightLeaf(false);
				this.app.workspace.revealLeaf(this.latexLeaf)
				this.latexLeaf.setViewState({
					type: LatexContextViewType,
					active: true
				});
			},
			hotkeys : [
				{
					key: 'm',
					modifiers: [
						'Ctrl'
					]
				}
			]
		});

	}

	onunload() {
		this.latexContextView = null;
		this.latexLeaf = null;
		this.app.workspace.getLeavesOfType(LatexContextViewType).forEach(leaf => leaf.detach());
	}
}

class LatexContextView extends ItemView {
	// see https://github.com/tgrosinger/advanced-tables-obsidian/blob/28a0a65f71d72666a5d0c422b5ed342bbd144b8c/src/table-controls-view.ts
	editor : Editor;
	visible = false;
	private buttons : HTMLElement[][];

	private focusedRow = -1;
	private focusedCol = -1;

	static LINE_WIDTH = 4; // number of commands per table line

	changeFocus(dx : number, dy : number) {
		console.log('changing focus');
		if(0 <= this.focusedRow 
			&& this.focusedRow < this.buttons.length 
			&& 0 <= this.focusedCol 
			&& this.focusedCol < this.buttons[this.focusedRow].length) {
			this.buttons[this.focusedRow][this.focusedCol].setAttr('color', 'white');
		}

		this.focusedRow = (this.focusedRow + this.buttons.length + dy) % this.buttons.length;
		this.focusedCol = (this.focusedCol + this.buttons[this.focusedRow].length + dx) % this.buttons[this.focusedRow].length;

		this.buttons[this.focusedRow][this.focusedCol].setAttr('color', 'red');

	}

	async onClose() : Promise<void> {
		console.log('closing');
		this.visible = false;
	}

	onunload() : void {
		console.log('unloading');
		this.visible = false;
	}

	getDisplayText() : string {
		return 'TODO: rename display text';
	}

	getViewType() : string {
		return LatexContextViewType;
	}

	onload() : void {
		//super.load();
		console.log('loading');
		this.visible = true;
		
		const leaf = this.app.workspace.activeLeaf;
		if(leaf.view instanceof MarkdownView) {
			this.editor = leaf.view.editor;
			insertText(this.editor, 'sample text')
		} else {
			console.warn('Unable to determine active Editor');
			return;
		}


		this.buttons = [];

		const container = this.containerEl.children[1];
		container.empty();

		const rootEl = container.createEl('div');
		const table = rootEl.createEl('table');

		const remaining = GREEKS;
		while(remaining.length > 0) {
			const tableRow = table.insertRow();
			const buttonRow : HTMLElement[] = [];
			remaining.splice(0, LatexContextView.LINE_WIDTH).forEach((command, i) => {
				const cell = tableRow.insertCell();
				buttonRow.push(drawButton(command, cell, () => insertText(this.editor, `$${command}$`)));
			});
			this.buttons.push(buttonRow);
			//const row = remaining.splice(0, LINE_WIDTH);
		}

		this.registerScopeEvent(this.app.scope.register([], 'ArrowUp', (event, context) => {
			this.changeFocus(0, -1);
		}));
	}
}

function drawButton(latexCommand : string, parent : HTMLElement, callback : () => any) : HTMLElement {
	const button = parent.appendChild(renderMath(latexCommand, true));
	button.onClickEvent(event => {
		if(event.button == 0) { // main (left) mouse button
			callback();
		}
	});
	return button;
}

function insertText(editor : Editor, text : string) {
	const cursorPosition = editor.getCursor('head');
	const lineNr = cursorPosition.line;
	const column = cursorPosition.ch;
	const line = editor.getLine(lineNr);
	const newLine = line.substring(0, column) + text + line.substring(column);
	editor.setLine(lineNr, newLine);
}

type LatexCommandGroup = string[]

const GREEKS : LatexCommandGroup = [
	'\\alpha',
	'\\beta',
	'\\gamma',
	'\\delta',
	'\\epsilon'
]

const MATH_OPERATORS : LatexCommandGroup = [
	'+',
	'*',
	'\\cdot',
	'\\oplus'
]
