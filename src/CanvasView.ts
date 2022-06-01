import OSC_Plugin from 'src/main';
import { ItemView, Notice, WorkspaceLeaf } from 'obsidian';

export default class CanvasView extends ItemView {
    plugin: OSC_Plugin;

    static TYPE = 'canvas-context-view';

    private painting: boolean = false;

    private canvas: HTMLCanvasElement;

    private canvasWidth = 500;
    private canvasHeight = 500;

    private strokeColor = '#FF0000';
    private strokeWidth = 10;

    constructor(plugin: OSC_Plugin, leaf: WorkspaceLeaf) {
        super(leaf);
        this.plugin = plugin;
    }

    getIcon(): string {
        return 'pencil';
    }

    getDisplayText(): string {
        return 'Obsidian Supercharged - Drawing Canvas';
    }

    getViewType(): string {
        return CanvasView.TYPE;
    }

    onunload(): void {
        this.plugin.canvasLeaf = null;
    }

    onload(): void {

        /* 
        Note that this function may be called before the spawnCanvasView function form main got called.
        This happens if the user closes the app before closing the canvas leaf.
        */


        const container = this.contentEl;

        const rootEl = container.createDiv({ cls: 'supercharged-canvas-div' });

        const buttonDiv = rootEl.createDiv();

        const COPY_BUTTON = buttonDiv.createEl('button');
        COPY_BUTTON.textContent = 'copy to clipboard';
        COPY_BUTTON.onClickEvent(() => { this.copyToClipboard(this.canvas.toDataURL()); });


        const CLEAR_BUTTON = buttonDiv.createEl('button');
        CLEAR_BUTTON.textContent = 'clear canvas';
        CLEAR_BUTTON.onClickEvent(() => {
            var ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        });


        const colorPicker = rootEl.createDiv();
        const colorPickerLabel = colorPicker.createEl('label');
        const colorInput = colorPicker.createEl('input', { type: 'color' });
        const COLOR_PICKER_ID = 'color-picker';
        colorInput.id = COLOR_PICKER_ID;
        colorInput.addEventListener('change', event => { this.strokeColor = colorInput.value; });
        colorInput.value = this.strokeColor;

        colorPickerLabel.setAttribute('for', COLOR_PICKER_ID);
        colorPickerLabel.textContent = 'Color';

        const strokeWidthSlider = rootEl.createDiv();
        const sliderInputLabel = strokeWidthSlider.createEl('label');
        const sliderInput = strokeWidthSlider.createEl('input', { type: 'range' });
        sliderInput.setAttribute('min', '5');
        sliderInput.setAttribute('max', '25');
        sliderInput.value = this.strokeWidth + '';
        const SLIDER_INPUT_ID = 'slider-input';
        sliderInput.id = SLIDER_INPUT_ID;
        sliderInput.oninput = () => { this.strokeWidth = parseInt(sliderInput.value); }
        sliderInputLabel.setAttribute('for', SLIDER_INPUT_ID);
        sliderInputLabel.textContent = 'Pencil width';

        const canvasSizeSelect = rootEl.createDiv();
        const canvasSizeSelectLabel = canvasSizeSelect.createEl('label');
        const sizeSelect = canvasSizeSelect.createEl('select');
        const SIZE_SELECT_ID = 'canvas-size-select';
        sizeSelect.id = SIZE_SELECT_ID;

        const small = sizeSelect.createEl('option');
        small.value = 'small';
        small.text = 'small';
        const medium = sizeSelect.createEl('option');
        medium.value = 'medium';
        medium.text = 'medium';
        const large = sizeSelect.createEl('option');
        large.value = 'large';
        large.text = 'large';
        sizeSelect.oninput = () => {
            switch (sizeSelect.value as CanvasSize) {
                case 'small':
                    this.canvasWidth = 100;
                    this.canvasHeight = 100;
                    break;
                case 'medium':
                    this.canvasWidth = 300;
                    this.canvasHeight = 300;
                    break;
                case 'large':
                    this.canvasWidth = 500;
                    this.canvasHeight = 500;
                    break;
            }
            this.drawCanvas(rootEl);
        };
        canvasSizeSelectLabel.setAttribute('for', SIZE_SELECT_ID);
        canvasSizeSelectLabel.textContent = 'Canvas size'


        this.drawCanvas(rootEl);
    }

    private draw(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
        if (!this.painting) {
            return;
        }

        ctx.lineWidth = this.strokeWidth;
        ctx.lineCap = "round";

        ctx.strokeStyle = this.strokeColor;


        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    }

    private convertToImage(urlData: string) {
        return '\n<div><img src = \"' + urlData + '\"></div>\n';
    }


    private async copyToClipboard(urlData: string): Promise<void> {
        navigator.clipboard.writeText(this.convertToImage(urlData));
        new Notice('Copied to clipboard');
    }

    private drawCanvas(parent: HTMLElement) {
        this.canvas?.remove();
        this.canvas = parent.createEl('canvas', { cls: 'supercharged-canvas' });

        const ctx = this.canvas.getContext('2d');

        this.canvas.height = this.canvasHeight;
        this.canvas.width = this.canvasWidth;

        this.canvas.on('mousedown', '.supercharged-canvas', (event, _target) => {
            this.painting = true;
            this.draw(event, ctx);
        });

        this.canvas.on('mouseup', '.supercharged-canvas', (_event, _target) => {
            this.painting = false;
            ctx.beginPath();
        });

        this.canvas.on('mouseout', '.supercharged-canvas', (_event, _target) => {
            this.painting = false;
            ctx.beginPath();
        })

        this.canvas.on('mousemove', '.supercharged-canvas', (event, _target) => { this.draw(event, ctx); });
    }
}

type CanvasSize = 'small' | 'medium' | 'large';