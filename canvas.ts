import MyPlugin from 'main';
import { ItemView, WorkspaceLeaf } from 'obsidian';

export const CanvasContextViewType = 'canvas-context-view'

export class CanvasView extends ItemView {
    plugin : MyPlugin;

    private painting : boolean = false;

    private canvas : HTMLCanvasElement;

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

        this.canvas = rootEl.createEl('canvas', {cls: 'supercharged-canvas'});

        const ctx = this.canvas.getContext("2d");

        //resizing
        this.canvas.height = container.scrollHeight;//window.innerHeight;
        this.canvas.width = container.scrollWidth;

        this.canvas.on('mousedown', '.supercharged-canvas', (event, _target) => {
            this.painting = true;
            console.log('LOG: Mouse down');
            this.draw(event, ctx);
        });

        this.canvas.on('mouseup', '.supercharged-canvas', (event, _target) => {
            this.painting = false;
            ctx.beginPath();
        });

        this.canvas.on('mousemove', '.supercharged-canvas', (event, _target) => {
            this.draw(event, ctx);
        });

        const DOWNLOAD_BUTTON = rootEl.createEl('button');
        DOWNLOAD_BUTTON.textContent = 'insert image';
        DOWNLOAD_BUTTON.onClickEvent(() => { this.insertImage(this.canvas.toDataURL()); });
          

          const CLEAR_BUTTON = rootEl.createEl('button');
          CLEAR_BUTTON.textContent = 'clear';
          CLEAR_BUTTON.onClickEvent(() => {
            var ctx = this.canvas.getContext("2d");
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

    private insertImage(urlData : string) : void {
        if(this.canvas && this.plugin?.activeEditor) {
            this.plugin.insertText(this.plugin.activeEditor, '<img src = \"' + urlData + '\">');
        }
    }

    private download() : void {
        console.log(this.canvas.toDataURL());
        const link = this.containerEl.createEl('a');
        link.download = 'download.png';
        link.href = this.canvas.toDataURL();
        link.click();
        //this.insertImage(this.canvas.toDataURL());
      }
}