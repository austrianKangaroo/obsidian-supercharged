import { App, Editor, ItemView, loadMathJax, MarkdownView, Plugin, PluginSettingTab, renderMath, Setting, WorkspaceLeaf } from 'obsidian';

// Remember to rename these classes and interfaces!



//gives the User the opportunity to choose their 5 latex codes for their interface
interface MyPluginSettings {
	custom_commands : string[];
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	custom_commands : [
		'command',
		'command',
		'command',
		'command',
		'command'
	]
}

const LatexContextViewType = 'latex-context-view'

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	latexContextView : LatexContextView;
	latexLeaf : WorkspaceLeaf;
	activeEditor : Editor;

	async onload() { //this funtion gets excecuted once the plugin gets activated
		await this.loadSettings();

		this.registerView(LatexContextViewType, leaf => (this.latexContextView = new LatexContextView(this, leaf)));

		this.addCommand({
			id: 'open-latex-leaf',
			name: 'Open Latex Leaf',
			editorCallback: (editor: Editor, view : MarkdownView) => {
				if(this.latexLeaf) {
					app.workspace.setActiveLeaf(this.latexLeaf);
					return;
				}

				this.activeEditor = editor;

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

		//make sure the leaf gets detached when the user changes to a different editor
		this.app.workspace.on('active-leaf-change', (leaf : WorkspaceLeaf) => { 
			// note sg: potential event handler memory leak when extension is repeatedly opened and closed
			console.log('1');
			if(this.latexLeaf) {
				this.latexLeaf.detach();
			}
		});

		
		//This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

/*	
		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
		*/
	}

	onunload() {
		if(this.latexLeaf) {
			this.latexLeaf.detach();
		}
	}

	
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class LatexContextView extends ItemView {
	plugin : MyPlugin;

	// see https://github.com/tgrosinger/advanced-tables-obsidian/blob/28a0a65f71d72666a5d0c422b5ed342bbd144b8c/src/table-controls-view.ts
	visible = false;
	private buttons : HTMLButtonElement[];

	
	private focusedCol = -1;
	//private focusedCol = -1;
	

	static LINE_WIDTH = 4; // number of commands per table line

	constructor(plugin : MyPlugin, leaf : WorkspaceLeaf) {
		console.log('new latexcontextview constructed');
		super(leaf);
		this.plugin = plugin;
	}

	changeFocus(dx : number) {
		//const newRow = (this.focusedRow + dy + this.buttons.length) % this.buttons.length;
		const newCol = (this.focusedCol + dx + this.buttons.length) % this.buttons.length;
		this.focusButton(newCol);
		/*console.log('changing focus');
		if(0 <= this.focusedRow 
			&& this.focusedRow < this.buttons.length 
			&& 0 <= this.focusedCol 
			&& this.focusedCol < this.buttons[this.focusedRow].length) {
			this.buttons[this.focusedRow][this.focusedCol].blur(); // remove focus
		}

		this.focusedRow = (this.focusedRow + this.buttons.length + dy) % this.buttons.length;
		this.focusedCol = (this.focusedCol + this.buttons[this.focusedRow].length + dx) % this.buttons[this.focusedRow].length;

		this.buttons[this.focusedRow][this.focusedCol].focus();*/
	}

	focusButton(colIndex : number) {
		/*if(0 <= this.focusedRow 
			&& this.focusedRow < this.buttons.length 
			&& 0 <= this.focusedCol 
			&& this.focusedCol < this.buttons[this.focusedRow].length) {
			this.buttons[this.focusedRow][this.focusedCol].blur(); // remove focus
		}*/
		this.buttons.at(this.focusedCol).blur();

		if(0 <= colIndex && colIndex < this.buttons.length) {
			this.buttons[colIndex].focus();
			this.focusedCol = colIndex;
		}
	}

	/*async onClose() : Promise<void> {
		console.log('closing');
		this.visible = false;
	}*/

	getDisplayText() : string {
		return 'Obsidian Supercharged';
	}

	getViewType() : string {
		return LatexContextViewType;
	}

	onload() : void {
		const LINE_WIDTH = 2; // number of commands per table line
		console.log('latexcontextview loaded'); 
		
		/*const leaf = this.app.workspace.activeLeaf;
		if(leaf.view instanceof MarkdownView) {
			this.editor = leaf.view.editor;
			insertText(this.editor, 'here could be your ad!')
		} else {
			console.warn('Unable to determine active Editor');
			return;
		}*/
		if(!this.plugin.activeEditor) {
			console.warn('unable to determine active editor');
			return;
		}


		this.buttons = [];

		const container = this.contentEl;

		const rootEl = container.createDiv({cls: 'supercharged-table'}); //document.createElement('div');
		//const table = rootEl.createEl('table');

		
		GREEKS.forEach((command, index) => {
			const button = drawButton(command, rootEl, () => {
				this.focusButton(index);
				insertText(this.plugin.activeEditor, command);
			});
			this.buttons.push(button);
		});
		/*while(remaining.length > 0) {
			const tableRow = table.insertRow();
			const buttonRow : HTMLButtonElement[] = [];
			remaining.splice(0, LatexContextView.LINE_WIDTH).forEach((command, colIndex) => {
				const cell = tableRow.insertCell();
				const button = drawButton(command, cell, () => {
					this.focusButton(rowIndex, colIndex);
					insertText(this.plugin.activeEditor, `${command}`);
				});
				buttonRow.push(button);
			});
			this.buttons.push(buttonRow);
			//const row = remaining.splice(0, LINE_WIDTH);
			rowIndex++;
		}*/


		// TODO: only react to keyevent if leaf is focused
		this.registerScopeEvent(this.app.scope.register([], 'ArrowLeft', () => {
			this.changeFocus(-1);
		}));
		this.registerScopeEvent(this.app.scope.register([], 'ArrowRight', () => {
			this.changeFocus(1);
		}));
	}

	onunload(): void {
		this.plugin.latexLeaf = null;
	}
}

function drawButton(latexCommand : string, parent : HTMLElement, callback : () => any) : HTMLButtonElement {
	/*const button = parent.appendChild(renderMath(latexCommand, true));
	button.onClickEvent(event => {
		if(event.button == 0) { // main (left) mouse button
			callback();
		}
	});*/
	const button = parent.createEl('button');
	button.appendChild(renderMath(latexCommand, true));
	button.onClickEvent(callback);
	return button;
}

function insertText(editor : Editor, text : string) {
	editor.replaceRange(text, editor.getCursor());
	/*const cursorPosition = editor.getCursor('head');
	const lineNr = cursorPosition.line;
	const column = cursorPosition.ch;
	const line = editor.getLine(lineNr);
	const newLine = line.substring(0, column) + text + line.substring(column);
	editor.setLine(lineNr, newLine);*/
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

/*
class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
*/


class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();
		containerEl.createEl('h2', {text: 'Define your own latex commands'});

		for (let i=0; i<this.plugin.settings.custom_commands.length; i++) {
			new Setting(containerEl)
				.setName('Command_'+i)
				//.setDesc('It\'s a secret')
				.addText(text => text
					.setPlaceholder('command')
					.setValue(this.plugin.settings.custom_commands[i])
					.onChange(async (value) => {
						//console.log('Secret: ' + value);
						this.plugin.settings.custom_commands[i] = value;
						await this.plugin.saveSettings();
					}));
			}
	}
}
