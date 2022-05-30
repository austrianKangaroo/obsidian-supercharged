import MyPlugin from 'main';
import { ItemView, WorkspaceLeaf } from 'obsidian';

export const CanvasContextViewType = 'canvas-context-view'

export class CanvasView extends ItemView {
    plugin : MyPlugin;

    constructor(plugin: MyPlugin, leaf: WorkspaceLeaf) {
        console.log('LOG: constructor for canvasview called');
		super(leaf);
		this.plugin = plugin;
	}

    getDisplayText(): string {
		return 'Obsidian Supercharged';
	}

    getViewType(): string {
		return CanvasContextViewType;
	}

    onunload(): void {
		this.plugin.canvasLeaf = null;
	}

    onload(): void {
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

		const rootEl = container.createDiv({ cls: 'supercharged-canvas' });

        rootEl.textContent = 'SUCCESS';

	}
}