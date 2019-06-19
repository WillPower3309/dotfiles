# dotfiles
Collection of Dotfiles for the Lovely Members of r/UnixPorn

![](/screenshot.jpg "")

## Details ##
- **OS**: Arch Linux
- **DE**: KDE Plasma
- **WM**: i3-gaps
- **Theme**: [Arc Dark Transparent](https://store.kde.org/p/1243914/)
- **Icons**: [Papirus-Dark](https://www.archlinux.org/packages/community/any/papirus-icon-theme/)
- **Shell**: ZSH
- **Terminal**: Termite
- **Compositor**: [Compton (tryone)](https://aur.archlinux.org/packages/compton-tryone-git/)

## Things to Do / Install ##
- [Set Up KDE For i3](https://medium.com/@vishnu_mad/using-i3-window-manager-with-kde-plasma-c2ac70594d8)
- [Install oh-my-zsh](https://aur.archlinux.org/packages/oh-my-zsh-git/)
- [Install Latte Dock](https://store.kde.org/p/1169519)
- [Conky-Cairo](https://aur.archlinux.org/packages/conky-cairo/)
- [Source Code Pro Font](https://www.fontsquirrel.com/fonts/source-code-pro)
- [San Francisco Font](https://aur.archlinux.org/packages/otf-san-francisco/)
- [Flashfocus](https://github.com/fennerm/flashfocus)
- [Unimatrix](https://github.com/will8211/unimatrix) (Not required but looks dope!)
- [feh](https://wiki.archlinux.org/index.php/feh) (To Set Background)
- [pipes](https://aur.archlinux.org/packages/bash-pipes/)
- [redshift](https://wiki.archlinux.org/index.php/Redshift)

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

### Generic Theming ###
- Terminal / VSCode Font: [Source Code Pro](https://www.fontsquirrel.com/fonts/source-code-pro)
- System, Application Font: [San Francisco](https://aur.archlinux.org/packages/otf-san-francisco/)

### Note ###
- VSCode dotfiles settings.json goes in folder "User" in vscode config folder
  - [How To Theme VSCode With Custom CSS](https://github.com/be5invis/vscode-custom-css)
- Use Breeze Dark as KDE look and feel theme to get transparent right click menus
- [Wallpaper](https://wallpaperhunt.net/wallpaper/under-the-horizon-144)
- Must have splash screen set to "None" in KDE settings, otherwise i3/feh will take a long time to set wallpaper
- Conky theme is set up to apear on a high DPI laptop display, may appear too large on 1920 x 1080 displays
- [Make Applications appear nice on high DPI displays](https://wiki.archlinux.org/index.php/HiDPI#Spotify)

## Vim ##
- Plugin Manager: [Vundle](https://aur.archlinux.org/packages/vundle-git/)

### Plugins: ###
- [NerdTree (File Browser)](https://github.com/scrooloose/nerdtree)
- [Devicons (Adds icons to nerdtree browser)](https://github.com/ryanoasis/vim-devicons)
