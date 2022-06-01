import { App, Editor, finishRenderMath, ItemView, loadMathJax, MarkdownView, Notice, Plugin, PluginSettingTab, renderMath, Setting, WorkspaceLeaf } from 'obsidian';
import { CanvasContextViewType, CanvasView } from 'canvas';
import LatexContextView from 'LatexContextView';

// Remember to rename these classes and interfaces!

//gives the User the opportunity to choose their 5 latex codes for their interface
interface MyPluginSettings {
	custom_commands: string[];
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	custom_commands: [
		'command',
		'command',
		'command',
		'command',
		'command'
	]
}


export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	latexLeaf: WorkspaceLeaf;
	activeEditor: Editor;

	canvasLeaf : WorkspaceLeaf;

	async onload() { // this funtion gets executed once the plugin gets activated
		await this.loadSettings();

		this.registerView(LatexContextView.LatexContextViewType, leaf => new LatexContextView(this, leaf));

		this.addCommand({
			id: 'open-latex-leaf',
			name: 'Open Latex Leaf',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.activeEditor = editor;

				if (this.latexLeaf) {
					app.workspace.setActiveLeaf(this.latexLeaf);
					return;
				}

				this.latexLeaf = this.app.workspace.getRightLeaf(false);
				this.app.workspace.revealLeaf(this.latexLeaf)
				this.latexLeaf.setViewState({
					type: LatexContextView.LatexContextViewType,
					active: true
				});
			},
			hotkeys: [ // can be changed by the user
				{
					key: 'm',
					modifiers: [
						'Ctrl'
					]
				}
			]
		});

		this.registerView(CanvasContextViewType, leaf => new CanvasView(this, leaf));
		this.addCommand({
			id: 'open-supercharged-canvas',
			name: 'Open Canvas',
			editorCallback: (editor : Editor, _view : MarkdownView) => {
				this.activeEditor = editor;

				if(this.canvasLeaf) {
					this.app.workspace.setActiveLeaf(this.canvasLeaf);
					return;
				}

				this.canvasLeaf = this.app.workspace.getRightLeaf(false);
				this.app.workspace.revealLeaf(this.canvasLeaf);
				this.canvasLeaf.setViewState({
					type : CanvasContextViewType,
					active : true
				});
			},
			hotkeys : [
				{
					key : 'j',
					modifiers : [
						'Ctrl'
					]
				}
			]
		})

		//This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {
		this.latexLeaf?.detach();
		this.canvasLeaf?.detach();
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	insertText(editor : Editor, text : string) : void {
		const line = editor.getCursor().line;
		const ch = editor.getCursor().ch;
	
		editor.replaceRange(text, editor.getCursor());
		editor.setCursor({ line: line, ch: ch + text.length });
	}
}



class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('h2', { text: 'Define your own latex commands' });

		for (let i = 0; i < this.plugin.settings.custom_commands.length; i++) {
			new Setting(containerEl)
				.setName('Command_' + i)
				.addText(text => text
					.setPlaceholder('command')
					.setValue(this.plugin.settings.custom_commands[i])
					.onChange(async (value) => {
						this.plugin.settings.custom_commands[i] = value;
						await this.plugin.saveSettings();
						this.plugin.latexLeaf?.detach();
					}));
		}
	}
}
