# dotfiles
Collection of Dotfiles for the Lovely Members of r/UnixPorn

## Details ##
- **OS**: Arch Linux
- **DE**: KDE Plasma
- **WM**: i3-gaps
- **Theme**: [Arc Dark Transparent](https://store.kde.org/p/1243914/)
- **Icons**: [Papirus-Dark](https://www.archlinux.org/packages/community/any/papirus-icon-theme/)
- **Shell**: ZSH
- **Terminal**: Termite
- **Compositor**: Compton (tryone)

## Requirements ##
- [Set Up KDE For i3](https://medium.com/@vishnu_mad/using-i3-window-manager-with-kde-plasma-c2ac70594d8)
- [Install oh-my-zsh](https://aur.archlinux.org/packages/oh-my-zsh-git/)
- [Source Code Pro Font](https://www.fontsquirrel.com/fonts/source-code-pro)

### Theming OhMyZsh ###
- Install Powerline Fonts
  - `git clone https://github.com/powerline/fonts.git$ cd fonts$ ./install.sh`
  - set font
- Change theme to agnoster `open ~/.zshrcSet ZSH_THEME="agnoster" and save the file`
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

### Generic Theming ###
- Terminal / VSCode Font: [Source Code Pro](https://www.fontsquirrel.com/fonts/source-code-pro)

### Note ###
- VSCode dotfiles settings.json goes in folder "User" in vscode config folder
