import { Editor, MarkdownView, Plugin, WorkspaceLeaf } from 'obsidian';
import CanvasView from 'src/CanvasView';
import LatexContextView from 'src/LatexContextView';
import { OSC_SettingTab, OSC_PluginSettings, DEFAULT_SETTINGS } from 'src/OSC_SettingTab';




export default class OSC_Plugin extends Plugin {
	settings: OSC_PluginSettings;

	latexLeaf: WorkspaceLeaf;
	canvasLeaf: WorkspaceLeaf;

	activeEditor: Editor;

	async onload() { // this funtion gets executed once the plugin gets activated
		await this.loadSettings(); // loads the settings (custom commands)

		// register a new view type to obsidian. 
		//The callback gets executed whenever setViewState({type : LatexContextView.TYPE, ...}); gets called
		this.registerView(LatexContextView.TYPE, leaf => new LatexContextView(this, leaf));

		// register the command for opening the latex leaf.
		// it can be executed under the specified name using the launchpad or the specified keyboard shortcut.
		this.addCommand({
			id: 'open-latex-leaf',
			name: 'Open Latex Leaf',
			// this callback gets called whenever the command is executed within an editor.
			// requiring this is necessary because otherwise we have no way of knowing where to insert the latex commands
			// since no other callbacks are provided, the command is a no-op if executed outside the editor
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

		// see above for an explanation of registerView
		this.registerView(CanvasView.TYPE, leaf => new CanvasView(this, leaf));
		this.addCommand({
			id: 'open-supercharged-canvas',
			name: 'Open Canvas',
			editorCallback: (_editor: Editor, _view: MarkdownView) => {
				this.spawnCanvasView();
			},
			hotkeys: [
				{
					key: 'j',
					modifiers: [
						'Ctrl'
					]
				}
			]
		})

		// This adds a tab to the settings menu so the user can configure various aspects of the plugin
		this.addSettingTab(new OSC_SettingTab(this.app, this));
	}

	/*
	This function gets executed when the plugin is disabled. 
	Note that this function does not get executed when the obsidian app is closed
	*/
	onunload() {
		this.latexLeaf?.detach();
		this.canvasLeaf?.detach();
	}

	// read settings from data.json or fall back to default settings
	private async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	// save current settings to data.json
	async saveSettings() {
		await this.saveData(this.settings);
	}

	insertText(editor: Editor, text: string): void {
		const line = editor.getCursor().line;
		const ch = editor.getCursor().ch;

		editor.replaceRange(text, editor.getCursor());
		editor.setCursor({ line: line, ch: ch + text.length });
	}

	private spawnCanvasView(): void {
		if (this.canvasLeaf) {
			this.app.workspace.setActiveLeaf(this.canvasLeaf);
			return;
		}

		this.canvasLeaf = this.app.workspace.getRightLeaf(false);
		this.app.workspace.revealLeaf(this.canvasLeaf);
		this.canvasLeaf.setViewState({
			type: CanvasView.TYPE,
			active: true
		});
	}

	private spawnLatexView(editor: Editor): void {
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