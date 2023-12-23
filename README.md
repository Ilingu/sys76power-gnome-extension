# Sys76power gnome extension ✨

#### ⇝ A simple gnome extension wrapper for the `system76-power` command

## Origin

I have a system76 laptop. I do not use PopOS. Thus I installed the `system76-power` **CLI** daemon, but it's a bit annoying to open a terminal just to change power profile, as a consequence I installed the [official gnome extension](https://github.com/pop-os/gnome-shell-extension-system76-power) for the `system76-power` CLI. However it's not maintained anymore and only support the old gnome 43, therefore I spend 1h doing this gnome extension that do exactly the same thing but for gnome 44+.

## Installation

> Needless to say that this gnome extension require the `system76-power` **CLI** daemon to be installed and that you need a system76 hardware for the CLI to work

> On **fedora** you can do this (don't know if it's work the same way on other distro, normally yes since it's a gnome related thing but you never know)

```bash
cd ~/.local/share/gnome-shell/extensions
mkdir sys76power@ilingu.io
# then copy "extension.js", "metadata.json" and "stylesheet.css" into the newly created folder 'sys76power@ilingu.io'
# log out of your session, then run:
gnome-extensions enable sys76power@ilingu.io # or if you have the 'extension' app you can also enable it here
```
