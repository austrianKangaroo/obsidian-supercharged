import { ItemView, WorkspaceLeaf, loadMathJax, finishRenderMath, renderMath } from 'obsidian';
import OSC_Plugin from 'main';
import { COMMAND_GROUPS } from 'latexCommands';

export default class LatexContextView extends ItemView {
	plugin: OSC_Plugin;
    static TYPE = 'latex-context-view';

	// see https://github.com/tgrosinger/advanced-tables-obsidian/blob/28a0a65f71d72666a5d0c422b5ed342bbd144b8c/src/table-controls-view.ts

	constructor(plugin: OSC_Plugin, leaf: WorkspaceLeaf) {
		super(leaf);
		this.plugin = plugin;
	}


	getDisplayText(): string {
		return 'Obsidian Supercharged - Latex';
	}

	getViewType(): string {
		return LatexContextView.TYPE;
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
	}
}