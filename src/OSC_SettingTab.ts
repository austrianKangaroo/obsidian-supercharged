import OSC_Plugin from 'src/main';
import { PluginSettingTab, App, Setting } from 'obsidian';


export class OSC_SettingTab extends PluginSettingTab {
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

//gives the User the opportunity to choose their 5 latex codes for their interface
export interface OSC_PluginSettings {
	custom_commands: string[];
}

export const DEFAULT_SETTINGS: OSC_PluginSettings = {
	custom_commands: [
		'command',
		'command',
		'command',
		'command',
		'command'
	]
}