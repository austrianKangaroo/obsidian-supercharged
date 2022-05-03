import { waitForDebugger } from 'inspector';
import { App, Editor, editorEditorField, EditorPosition, ItemView, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { cursorTo } from 'readline';

// Remember to rename these classes and interfaces!

/*
interface MyPluginSettings {
	mySetting: string;
} 
*/

/*
const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}
*/

const LatexContextViewType = 'latex-context-view'

export default class MyPlugin extends Plugin {
	//settings: MyPluginSettings;

	latexContextView : LatexContextView;

	async onload() {
		//await this.loadSettings();

		this.registerView(LatexContextViewType, leaf => (this.latexContextView = new LatexContextView(leaf)));

		/*
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});
		*/
		this.addCommand({
			id: 'open-latex-overlay',
			name: 'Open Latex Overlay',
			editorCallback: (editor: Editor, view : MarkdownView) => {
				//console.log('Active line:' + editor.getCursor('from'));
				//editor.setLine(editor.getCursor('from').line, 'you got hacked');
				const activeEditor = editor;
				const cursorPosition = editor.getCursor('head');
				var lineNr = cursorPosition.line;
				var column = cursorPosition.ch;
				var line = editor.getLine(lineNr);
				var newLine = line.substring(0, column) + 'test' + line.substring(column);
				
				//console.log('from: ' + editor.getCursor('from').line + ', ' + editor.getCursor('from').ch + 'to: ' + editor.getCursor('to').line + ', ' + editor.getCursor('to').ch + 'anchor: ' + editor.getCursor('anchor').line + ', ' + editor.getCursor('anchor').ch +'head: ' + editor.getCursor('head').line + ', ' + editor.getCursor('head').ch );
				editor.setLine(lineNr, newLine);
				editor.setCursor(cursorPosition);

				const leaf = this.app.workspace.getRightLeaf(false);
				this.app.workspace.revealLeaf(leaf)
				leaf.setViewState({
					type: LatexContextViewType,
					active: true
				});
				//this.app.workspace.getLeavesOfType(LatexContextViewType);
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
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

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

	}

	/*
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		//await this.saveData(this.settings);
	}
	*/
}

class LatexContextView extends ItemView {
	// see https://github.com/tgrosinger/advanced-tables-obsidian/blob/28a0a65f71d72666a5d0c422b5ed342bbd144b8c/src/table-controls-view.ts
	getDisplayText(): string {
		return 'TODO: rename display text';
	}

	getViewType(): string {
		return LatexContextViewType;
	}

	load() : void {
		super.load();
		console.log('LatexContextView loaded');
		const container = this.containerEl.children[1];
		const rootEl = document.createElement('div');
		rootEl.innerHTML = '$\\dots$';
		rootEl.onClickEvent((event) => {
			const leaf = this.app.workspace.activeLeaf;
			if(leaf.view instanceof MarkdownView) {
				const editor = leaf.view.editor;
				const cursorPosition = editor.getCursor('head');
				var lineNr = cursorPosition.line;
				var column = cursorPosition.ch;
				var line = editor.getLine(lineNr);
				var newLine = line.substring(0, column) + 'change text from leaf' + line.substring(column);
				editor.setLine(lineNr, newLine);
			} else {
				console.warn('Unable to determine active Editor');
			}
		})
		


		container.empty();
		container.appendChild(rootEl);
	}
}

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

/*
class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
*/