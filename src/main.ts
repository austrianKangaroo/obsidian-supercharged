import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
import CanvasView from 'src/CanvasView';
import LatexContextView from 'src/LatexContextView';

//gives the User the opportunity to choose their 5 latex codes for their interface
interface OSC_PluginSettings {
	custom_commands: string[];
}

const DEFAULT_SETTINGS: OSC_PluginSettings = {
	custom_commands: [
		'command',
		'command',
		'command',
		'command',
		'command'
	]
}


export default class OSC_Plugin extends Plugin {
	settings: OSC_PluginSettings;

	latexLeaf: WorkspaceLeaf;
	activeEditor: Editor;

	canvasLeaf : WorkspaceLeaf;

	async onload() { // this funtion gets executed once the plugin gets activated
		await this.loadSettings();

		this.registerView(LatexContextView.TYPE, leaf => new LatexContextView(this, leaf));

		this.addCommand({
			id: 'open-latex-leaf',
			name: 'Open Latex Leaf',
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				this.spawnLatexView(editor);
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

		this.registerView(CanvasView.TYPE, leaf => new CanvasView(this, leaf));
		this.addCommand({
			id: 'open-supercharged-canvas',
			name: 'Open Canvas',
			editorCallback: (_editor : Editor, _view : MarkdownView) => {
				this.spawnCanvasView();
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
		this.addSettingTab(new OSC_SettingTab(this.app, this));
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

	private spawnCanvasView() : void {
		if(this.canvasLeaf) {
			this.app.workspace.setActiveLeaf(this.canvasLeaf);
			return;
		}

		this.canvasLeaf = this.app.workspace.getRightLeaf(false);
		this.app.workspace.revealLeaf(this.canvasLeaf);
		this.canvasLeaf.setViewState({
			type : CanvasView.TYPE,
			active : true
		});
	}

	private spawnLatexView(editor : Editor) : void {
		this.activeEditor = editor;

		if (this.latexLeaf) {
			app.workspace.setActiveLeaf(this.latexLeaf);
			return;
		}

		this.latexLeaf = this.app.workspace.getRightLeaf(false);
		this.app.workspace.revealLeaf(this.latexLeaf)
		this.latexLeaf.setViewState({
			type: LatexContextView.TYPE,
			active: true
		});
	}
}



class OSC_SettingTab extends PluginSettingTab {
	plugin: OSC_Plugin;

	constructor(app: App, plugin: OSC_Plugin) {
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
