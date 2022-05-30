import MyPlugin from 'main';
import { ItemView, WorkspaceLeaf } from 'obsidian';

export const CanvasContextViewType = 'canvas-context-view'

export class CanvasView extends ItemView {
    plugin : MyPlugin;

    private painting : boolean = false;

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

		const rootEl = container.createDiv({ cls: 'supercharged-canvas-div' });

        rootEl.textContent = 'SUCCESS';

        const canvas = rootEl.createEl('canvas', {cls: 'supercharged-canvas'});

        const ctx = canvas.getContext("2d");

        //resizing
        canvas.height = container.scrollHeight;//window.innerHeight;
        canvas.width = container.scrollWidth;

        canvas.on('mousedown', '.supercharged-canvas', (event, _target) => {
            this.painting = true;
            console.log('LOG: Mouse down');
            this.draw(event, ctx);
        });

        canvas.on('mouseup', '.supercharged-canvas', (event, _target) => {
            this.painting = false;
            ctx.beginPath();
        });

        canvas.on('mousemove', '.supercharged-canvas', (event, _target) => {
            this.draw(event, ctx);
        });

        const DOWNLOAD_BUTTON = rootEl.createEl('button');
        DOWNLOAD_BUTTON.textContent = 'use';
        DOWNLOAD_BUTTON.onClickEvent(() => {
            //var canvas = document.querySelector("#canvas");
            console.log(canvas.toDataURL());
            const link = rootEl.createEl('a');
            link.download = 'download.png';
            link.href = canvas.toDataURL();
            link.click();
            //link.delete;
          });
          

          const CLEAR_BUTTON = rootEl.createEl('button');
          CLEAR_BUTTON.textContent = 'clear';
          CLEAR_BUTTON.onClickEvent(() => {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          });
	}

    onResize() : void {
        console.log('LOG: resize');
        console.log(this.containerEl.scrollWidth);
    }

    private draw(event : MouseEvent, ctx : CanvasRenderingContext2D) : void {
        if(!this.painting){
            return;
        }

        ctx.lineWidth = 10;
        ctx.lineCap = "round";


        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
        /*
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.clientX, event.clientY);
        */
    }
}