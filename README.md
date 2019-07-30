# dotfiles
Collection of Dotfiles for the Lovely Members of r/UnixPorn

![](/screenshot.png "")

## Contents ##
1. [Details](#details)
2. [Install](#install)
3. [Notes](#notes)
4. [ZSH Theming](#zsh)
5. [Latte Dock Theming](#dock)
6. [Vim Configuration](#vim)

<a name="details"></a>
## Details ##
- **OS**: Arch Linux
- **DE**: KDE Plasma
- **WM**: i3-gaps
- **Theme**: [Arc Dark Transparent](https://store.kde.org/p/1243914/)
- **Icons**: [McMojave-circle](https://store.kde.org/p/1305429/)
- **Shell**: ZSH
- **Terminal**: Termite
- **Compositor**: [Compton (tryone)](https://aur.archlinux.org/packages/compton-tryone-git/)

<a name="install"></a>
## Things to Do / Install ##
- [Set Up KDE For i3](https://medium.com/@vishnu_mad/using-i3-window-manager-with-kde-plasma-c2ac70594d8): Best DE + best WM
- [Install oh-my-zsh](https://aur.archlinux.org/packages/oh-my-zsh-git/): Make terminal look amazing
- [Install Latte Dock](https://store.kde.org/p/1169519): Best dock / panel
- [Install Conky-Cairo](https://aur.archlinux.org/packages/conky-cairo/): Desktop system monitor tool
- [Add Source Code Pro Font](https://www.fontsquirrel.com/fonts/source-code-pro): Beautiful terminal / text editor / IDE font
- [Add San Francisco Font](https://aur.archlinux.org/packages/otf-san-francisco/): Minimial, clean font used in macOS that will be used as a system font
- [Install Flashfocus](https://github.com/fennerm/flashfocus): Makes windows flash once when switched to active
- [Install feh](https://wiki.archlinux.org/index.php/feh): Sets Background
- [Install feh-blur](https://github.com/rstacruz/feh-blur-wallpaper): Blurs background when a window is opened
- [Install Unimatrix](https://github.com/will8211/unimatrix): Cool terminal matrix text flow animation
- [Install pipes](https://aur.archlinux.org/packages/bash-pipes/): Cool pipe terminal animation
- [Install redshift](https://wiki.archlinux.org/index.php/Redshift): Changes screen tones for evening viewing
- [Wallpaper](https://wallpaperhunt.net/wallpaper/under-the-horizon-144): **WARNING: SITE NSFW WITHOUT AD BLOCKER**

<a name="notes"></a>
### Notes ###
- Use Breeze Dark as KDE look and feel theme to get transparent right click menus
- Must have splash screen set to "None" in KDE settings, otherwise i3/feh will take a long time to set wallpaper
- GTK / Electron Global Menu Support:
   `sudo pacman -S appmenu-gtk-module appmenu-gtk-module`
   `sudo pacman -S appmenu-gtk-module libdbusmenu-glib`
- Conky theme is set up to apear on a high DPI laptop display, may appear too large on 1920 x 1080 displays
- Bluetooth setup:
  - install bluez and bluez utils
  - install pulseaudio-bluetooth
  - start and enable bluetooth.service with systemctl
  - reboot

<a name="zsh"></a>
### Theming OhMyZsh ###
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

<a name="dock"></a>
### Latte Dock Setup ###
**Top Panel:**
- Mode: panel
- Widgets (in order):
  - Active Window Control
  - Global Menu
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
