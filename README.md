# dotfiles
Collection of Dotfiles for the Lovely Members of r/UnixPorn

![](/screenshot.png "")

## Contents ##
1. [Details](#details)
2. [Dependencies](#dependencies)
3. [Cool Things to Install](#coolinstall)
4. [Application Theming](#application-theming)
5. [Latte Dock](#dock)
6. [Vim Configuration](#vim)

<a name="details"></a>
## Details ##
- **OS**: Arch Linux
- **DE**: KDE Plasma
- **WM**: i3-gaps
- **Theme**: Arc Dark Transparent
- **Icons**: [McMojave-circle](https://store.kde.org/p/1305429/)
- **Shell**: ZSH
- **Terminal**: Konsole
- **Compositor**: [Compton (tryone)](https://aur.archlinux.org/packages/compton-tryone-git/)
- [**Wallpaper**](https://www.fabuloussavers.com/new_wallpaper/anime_sky_clouds_sunset-wallpapers-2560x1440.shtml)

<a name="dependencies"></a>
## Dependencies ##

**[Set Up KDE For i3](https://medium.com/@vishnu_mad/using-i3-window-manager-with-kde-plasma-c2ac70594d8): Best DE + best WM**
  - Must have splash screen set to "None" in KDE settings, otherwise i3/feh will take a long time to set wallpaper
  - Remember to remove KDE shortcuts to avoid conflict with i3 shortcuts

| Dependency    | Description             | Usage               |
|:-------------:|:-----------------------:| :------------------:|
| `plasma`      | Best DE, imo            | Desktop Environment |
| `i3-gaps`     | Best WM of a generation | Window Manager      |
| `rofi`        | Beatiful application launcher | Application Launcher |
|[oh-my-zsh](https://aur.archlinux.org/packages/oh-my-zsh-git/)|ZSH is a better looking bash alternative|Shell|
|[Latte Dock](https://store.kde.org/p/1169519)|Panel|Best dock / panel|
|[Source Code Pro Font](https://www.fontsquirrel.com/fonts/source-code-pro)|Beautiful terminal / text editor / IDE font|Monospace Font|
|[San Francisco Font](https://aur.archlinux.org/packages/otf-san-francisco/)|Minimial, clean font used in macOS|System Font|
|[feh](https://wiki.archlinux.org/index.php/feh)|Sets Background|Background Setter|
|[feh-blur](https://github.com/rstacruz/feh-blur-wallpaper)|Blurs background when a window is opened|Draws Focus to Windows|

<a name="coolinstall"></a>
## Cool Things to Install ##
- [Conky-Cairo](https://aur.archlinux.org/packages/conky-cairo/): Cool Desktop system monitor tool
  - Conky theme in dotfiles is set up to apear on a high DPI laptop display, may appear too large on 1920 x 1080 displays
- [Flashfocus](https://github.com/fennerm/flashfocus): Makes windows flash once when switched to active
- [Install Unimatrix](https://github.com/will8211/unimatrix): Cool terminal matrix text flow animation
- [Install pipes](https://aur.archlinux.org/packages/bash-pipes/): Cool pipe terminal animation
- [Install redshift](https://wiki.archlinux.org/index.php/Redshift): Changes screen tones for evening viewing

<a name="application-theming"></a>
## Application Theming: ##
  - [Install Spicetify](https://github.com/khanhas/spicetify-cli): Make spotify sexy
  - [Install My Good Looking Custom Transparent vscode](https://github.com/WillPower3309/vscode-transparent)
  - [Install Slack Desktop with Patched Dark Theme](https://aur.archlinux.org/packages/slack-desktop-dark/)
  - [Set up This Firefox Theme](https://github.com/muckSponge/MaterialFox)

### OhMyZsh ###
- Install Powerline Fonts
  - `git clone https://github.com/powerline/fonts.git`
  - `cd fonts`
  - `./install.sh`
  - set font
- Change theme to agnoster
  -`open ~/.zshrc`
  - Set ZSH_THEME="agnoster" and save the file
- Install Plugins (Note That ~/.zshrc edits are in repo)
  - Syntax Hilighting
    - `git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting`
    - Edit `~/.zshrc`, add `zsh-syntax-highlighting` to the plugins section
    - Reread config `source ~/.zshrc`
  - Autosuggestion
    - `git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions`
    - Edit `~/.zshrc`, add `zsh-autosuggestions` to the plugins section
    - Reread config `source ~/.zshrc`
- [More Theming Info](https://www.freecodecamp.org/news/jazz-up-your-zsh-terminal-in-seven-steps-a-visual-guide-e81a8fd59a38/)

### Spotify ###
1. Ensure [spicetify](https://github.com/khanhas/spicetify-cli) is installed
2. chown spotify directory: `sudo chown $USER -R /opt/spotify`
3. run `spicetify` once to generate config
4. `spicetify backup apply enable-devtool` to enable devtools
5. Place your color.ini and user.css in `~/.config/spicetify/Themes/<your theme name, whatever you want>` and edit `~/.config/spicetify/config.ini` to reflect this name
6. run `spicetify update restart`

<a name="dock"></a>
## Latte Dock Setup ##
**Top Panel:**
- Mode: panel
- Widgets (in order):
  - Active Window Control
  - Global Menu
    - GTK / Electron Global Menu Panel Support:
      - `sudo pacman -S appmenu-gtk-module appmenu-gtk-module`
      - `sudo pacman -S appmenu-gtk-module libdbusmenu-glib`
  - Spacer
  - Digital Clock
  - Spacer
  - Application Icons (Drag icons from application launcher to panel to add)
  - System Tray
  - User Switcher

<a name="vim"></a>
## Vim ##
- Plugin Manager: [Vundle](https://aur.archlinux.org/packages/vundle-git/)

### Plugins: ###
- [NerdTree (File Browser)](https://github.com/scrooloose/nerdtree)
- [Devicons (Adds icons to nerdtree browser)](https://github.com/ryanoasis/vim-devicons)
