import { App, Editor, editorEditorField, ItemView, loadMathJax, MarkdownPreviewView, MarkdownView, Plugin, PluginSettingTab, renderMath, Setting, WorkspaceLeaf } from 'obsidian';

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

	async onload() { //this funtion gets executed once the plugin gets activated
		 await this.loadSettings();

		this.registerView(LatexContextViewType, leaf => (this.latexContextView = new LatexContextView(this, leaf)));

		this.addCommand({
			id: 'open-latex-leaf',
			name: 'Open Latex Leaf',
			editorCallback: (editor: Editor, view : MarkdownView) => {
				this.activeEditor = editor;

				if(this.latexLeaf) {
					app.workspace.setActiveLeaf(this.latexLeaf);
					return;
				}

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

		/*
		//make sure the leaf gets detached when the user changes to a different editor
		this.app.workspace.on('active-leaf-change', (leaf : WorkspaceLeaf) => { 
			// note sg: potential event handler memory leak when extension is repeatedly opened and closed
			console.log(this.activeEditor.getCursor('from'));
		});
		*/
		

		
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
		this.latexLeaf?.detach();
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
	//private buttons : HTMLButtonElement[];

	
	//private focusedCol = -1;
	

	//static LINE_WIDTH = 4; // number of commands per table line

	constructor(plugin : MyPlugin, leaf : WorkspaceLeaf) {
		super(leaf);
		this.plugin = plugin;
	}

	/*
	changeFocus(dx : number) {
		const newCol = (this.focusedCol + dx + this.buttons.length) % this.buttons.length;
		this.focusButton(newCol);
	}

	focusButton(colIndex : number) {
		this.buttons.at(this.focusedCol).blur();

		if(0 <= colIndex && colIndex < this.buttons.length) {
			this.buttons[colIndex].focus();
			this.focusedCol = colIndex;
		}
	}
	*/

	getDisplayText() : string {
		return 'Obsidian Supercharged';
	}

	getViewType() : string {
		return LatexContextViewType;
	}

	async onload() : Promise<void> {
		//const LINE_WIDTH = 2; // number of commands per table line
		await loadMathJax();

		if(!this.plugin.activeEditor) {
			/*
			this happens if the app gets closed and reopened
			in this case, we want to close the leaf as we have no access to an editor.
			this means that our button callbacks can't know where to insert text
			*/
			this.leaf.detach();
			return;
		}


		//this.buttons = [];

		const container = this.contentEl;

		const rootEl = container.createDiv({cls: 'supercharged-table'}); //document.createElement('div');

		
		MATH_OPERATORS.forEach((command, index) => {
			drawButton(command, rootEl, () => {
				//this.focusButton(index);
				insertText(this.plugin.activeEditor, command);
			});
			//this.buttons.push(button);
		});


		// TODO: only react to keyevent if leaf is focused
		/*
		this.registerScopeEvent(this.app.scope.register([], 'ArrowLeft', () => {
			this.changeFocus(-1);
		}));
		this.registerScopeEvent(this.app.scope.register([], 'ArrowRight', () => {
			this.changeFocus(1);
		}));
		*/
	}

	onunload(): void {
		this.plugin.latexLeaf = null;
	}
}

function drawButton(latexCommand : string, parent : HTMLElement, callback : () => any) : HTMLButtonElement {
	/*
	const button = parent.appendChild(renderMath(latexCommand, true));
	button.onClickEvent(event => {
		if(event.button == 0) { // main (left) mouse button
			callback();
		}
	});
	*/
	const button = parent.createEl('button');
	button.appendChild(renderMath(latexCommand, true));
	button.onClickEvent(callback);
	return button;
}

function insertText(editor : Editor, text : string) {
	editor.replaceRange(text, editor.getCursor());
}

type LatexCommandGroup = string[]

const GREEKS : LatexCommandGroup = [
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

const SET_SYMBOLS : LatexCommandGroup = [
	'\\in',
	'\\notin',
	'\\ni',
	'\\notni',
	'\\subseteq',
	'\\supseteq',
	'\\cup',
	'\\cap',
	'\\times'
]

const LOGIC_SYMBOLS : LatexCommandGroup = [
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

const MATH_OPERATORS : LatexCommandGroup = [
	'+',
	'*',
	'\\cdot',
	'\\oplus', 
	'\\sum_{i=1}^n a_i',
	'\\int_a^b f(x)dx'
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
						this.plugin.latexLeaf?.detach();
					}));
			}
	}
}
