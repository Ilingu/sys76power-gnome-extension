import GObject from "gi://GObject";
import GLib from "gi://GLib";
import St from "gi://St";

import {
  Extension,
  gettext as _,
} from "resource:///org/gnome/shell/extensions/extension.js";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";
import * as PopupMenu from "resource:///org/gnome/shell/ui/popupMenu.js";

import * as Main from "resource:///org/gnome/shell/ui/main.js";

let reload_ext;

const execCmd = (cmd) => {
  try {
    const output = GLib.spawn_command_line_sync(cmd)[1];
    return imports.byteArray.toString(output).trim();
  } catch (err) {
    Main.notify(_(`${err}`));
    return null;
  }
};

const queryPowerProfile = () => {
  const resp = execCmd("system76-power profile");
  if (typeof resp !== "string") return null;
  return resp.split("\n")[0].split(": ")[1].toLocaleLowerCase();
};

const setPowerProfile = (profile) => {
  const resp = execCmd(`system76-power profile ${profile}`);
  if (resp !== null) reload_ext();
};

const powerProfileToIcon = (profile) => {
  if (profile === "battery") return "security-low-symbolic";
  if (profile === "balanced") return "security-medium-symbolic";
  if (profile === "performance") return "security-high-symbolic";
  return "dialog-error-symbolic";
};

const isSwitchableGraphics = () =>
  execCmd("system76-power graphics switchable") !== "not switchable";

const setGraphicsProfile = (profile) => {
  const resp = execCmd(`system76-power graphics ${profile}`);
  if (resp !== null) reload_ext();
};

const queryGraphicsProfile = () => execCmd("system76-power graphics");

const PowerIndicator = GObject.registerClass(
  class Indicator extends PanelMenu.Button {
    _init() {
      super._init(0.0, _("Sys76Power Indicator"));

      const currProfile = queryPowerProfile();
      const currGraphics = queryGraphicsProfile();
      const canEditGraphics = isSwitchableGraphics();

      this.add_child(
        new St.Icon({
          icon_name: powerProfileToIcon(currProfile),
          style_class: "system-status-icon",
        })
      );

      // Profiles Menu
      {
        const profileMenu = new PopupMenu.PopupSubMenuMenuItem(
          "Profiles",
          true
        );

        profileMenu.label.text = "Profiles";
        profileMenu.icon.icon_name = "battery-missing-symbolic";

        profileMenu.menu.addAction(
          `${currProfile === "battery" ? "✅ " : ""}battery`,
          () => setPowerProfile("battery")
        );
        profileMenu.menu.addAction(
          `${currProfile === "balanced" ? "✅ " : ""}balanced`,
          () => setPowerProfile("balanced")
        );
        profileMenu.menu.addAction(
          `${currProfile === "performance" ? "✅ " : ""}performance`,
          () => setPowerProfile("performance")
        );

        this.menu.addMenuItem(profileMenu);
      }

      this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

      // Graphics Menu
      {
        const graphicsMenu = new PopupMenu.PopupSubMenuMenuItem(
          "Graphics",
          true
        );

        graphicsMenu.label.text = "Graphics";
        graphicsMenu.icon.icon_name = "computer-symbolic";

        let options = ["compute", "hybrid", "integrated", "nvidia"];
        if (!canEditGraphics)
          options = options.filter((opt) => opt === currGraphics);

        for (const opt of options)
          graphicsMenu.menu.addAction(
            `${currGraphics === opt ? "✅ " : ""}${opt}`,
            () => canEditGraphics && setGraphicsProfile(opt)
          );

        this.menu.addMenuItem(graphicsMenu);

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
      }

      // Refresh Datas button
      {
        const RefreshBtn = new PopupMenu.PopupMenuItem(_("Refresh"));
        RefreshBtn.connect("activate", () => reload_ext());
        this.menu.addMenuItem(RefreshBtn);
      }
    }
  }
);

export default class PowerExtension extends Extension {
  enable() {
    this._indicator = new PowerIndicator();
    Main.panel.addToStatusArea(this.uuid, this._indicator);
    reload_ext = () => {
      this._indicator.destroy();
      this._indicator = new PowerIndicator();
      Main.panel.addToStatusArea(this.uuid, this._indicator);
    };
  }

  disable() {
    this._indicator.destroy();
    this._indicator = null;
  }
}
