import { App, Editor, finishRenderMath, ItemView, loadMathJax, MarkdownView, Plugin, PluginSettingTab, renderMath, Setting, WorkspaceLeaf } from 'obsidian';
import { COMMAND_GROUPS } from 'latexCommands';
import { CanvasContextViewType, CanvasView } from 'canvas';

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

function collapse() {
	var coll = document.getElementsByClassName("collapsible");
	var i;
	
	for (i = 0; i < coll.length; i++) {
	  coll[i].addEventListener("click", function() {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.maxHeight){
			content.style.maxHeight = null;
		} else {
			content.style.maxHeight = 0 + "px";
		//	content.style.maxHeight = content.scrollHeight + "px";
		}
	  });
	}}

const LatexContextViewType = 'latex-context-view'

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	latexLeaf: WorkspaceLeaf;
	activeEditor: Editor;

	canvasLeaf : WorkspaceLeaf;

	async onload() { // this funtion gets executed once the plugin gets activated
		await this.loadSettings();

		this.registerView(LatexContextViewType, leaf => new LatexContextView(this, leaf));

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
					type: LatexContextViewType,
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
					key : 'k',
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

class LatexContextView extends ItemView {
	plugin: MyPlugin;

	// see https://github.com/tgrosinger/advanced-tables-obsidian/blob/28a0a65f71d72666a5d0c422b5ed342bbd144b8c/src/table-controls-view.ts

	constructor(plugin: MyPlugin, leaf: WorkspaceLeaf) {
		super(leaf);
		this.plugin = plugin;
	}


	getDisplayText(): string {
		return 'Obsidian Supercharged';
	}

	getViewType(): string {
		return LatexContextViewType;
	}

	async onload(): Promise<void> {
		await loadMathJax();

		if (!this.plugin.activeEditor) {
			/*
			this happens if the app gets closed and reopened
			in this case, we want to close the leaf as we have no access to an editor.
			this means that our button callbacks can't know where to insert text
			*/
			this.leaf.detach();
			return;
		}

		const container = this.contentEl;

		const rootEl = container.createDiv({ cls: 'supercharged-table' });

		const commandGroups = [{
			name: 'custom commands',
			commands: this.plugin.settings.custom_commands
		}].concat(COMMAND_GROUPS);

		commandGroups.forEach((group, i) => {
			const groupDiv= rootEl.createDiv();
			const header = groupDiv.createEl('h2',{cls:'collapsible'});
			header.textContent = group.name;
			const content = groupDiv.createDiv({cls:'content'});
			group.commands.forEach((command, index) => {
				drawButton(command, content, () => {
					this.plugin.insertText(this.plugin.activeEditor, command);
					this.plugin.activeEditor.focus(); // return focus to editor after the button has been pressed
				});
			})
		});
		collapse();
		await finishRenderMath();
	}

	onunload(): void {
		this.plugin.latexLeaf = null;
		this.plugin.canvasLeaf = null;
	}
}

function drawButton(latexCommand: string, parent: HTMLElement, callback: () => any): HTMLButtonElement {
	const button = parent.createEl('button');
	button.appendChild(renderMath(latexCommand, true));
	button.onClickEvent(callback);
	return button;
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
