import OSC_Plugin from 'src/main';
import { PluginSettingTab, App, Setting } from 'obsidian';


export class OSC_SettingTab extends PluginSettingTab {
	plugin: OSC_Plugin;

	constructor(app: App, plugin: OSC_Plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	// display() gets called every time the tab is selected within the settings menu
	display(): void {
		this.reload();
	}

	// reload() gets called whenever the obsidian settings tab is selected or a setting box gets removed
	private reload(): void {
		const { containerEl } = this;
		containerEl.empty(); // clear all previously defined elements
		containerEl.createEl('h2', { text: 'Define your own latex commands' });

		for (let i = 0; i < this.plugin.settings.custom_commands.length; i++) {
			new Setting(containerEl) // create a new Setting and append it to the HTML element of the Settings tab
				.setName('Command ' + (i + 1))
				.addText(text => text
					.setPlaceholder('command')
					.setValue(this.plugin.settings.custom_commands[i])
					.onChange(async (value) => {
						this.plugin.settings.custom_commands[i] = value;
						await this.plugin.saveSettings();
						this.plugin.latexLeaf?.detach();
					}))
				.addButton(button => {
					button.setButtonText('-');
					button.onClick(async () => {
						/*
						this gets executed when the user presses the '-' button on the setting
						we remove the corresponding command from the list of custom commands
						and reload.
						Merely removing the HTML element associated to the setting 
						and removing the element from custom_commands
						would not be enough because our callbacks rely on
						indices which become invalid one an element has been removed.
						*/
						this.plugin.settings.custom_commands.splice(i, 1);
						await this.plugin.saveSettings();
						/* 
						Close the latex leaf if one is present. 
						This is necessary because otherwise it would have to reload with the new custom commands
						every time one is deleted
						*/
						this.plugin.latexLeaf?.detach();
						this.reload();
					})
				});
		}

		// create a button for adding new commands
		const addCommandButton = containerEl.createEl('button');
		addCommandButton.textContent = '+';
		addCommandButton.onClickEvent(async () => {
			// we add a new command by appending the empty string and reloading.
			this.plugin.settings.custom_commands.push('');
			await this.plugin.saveSettings();
			this.plugin.latexLeaf?.detach();
			this.reload();
		});
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