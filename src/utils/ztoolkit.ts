import { config } from "../../package.json";

export { createZToolkit };

function createZToolkit() {
  const _ztoolkit = new MyToolkit();
  /**
   * Alternatively, import toolkit modules you use to minify the plugin size.
   * You can add the modules under the `MyToolkit` class below and uncomment the following line.
   */
  // const _ztoolkit = new MyToolkit();
  initZToolkit(_ztoolkit);
  return _ztoolkit;
}

function initZToolkit(_ztoolkit: ReturnType<typeof createZToolkit>) {
  const env = __env__;
  _ztoolkit.basicOptions.log.prefix = `[${config.addonName}]`;
  _ztoolkit.basicOptions.log.disableConsole = env === "production";
  _ztoolkit.UI.basicOptions.ui.enableElementJSONLog = __env__ === "development";
  _ztoolkit.UI.basicOptions.ui.enableElementDOMLog = __env__ === "development";
  _ztoolkit.basicOptions.debug.disableDebugBridgePassword =
    __env__ === "development";
  _ztoolkit.ProgressWindow.setIconURI(
    "default",
    `chrome://${config.addonRef}/content/icons/favicon.png`,
  );
}

import { BasicTool, unregister } from "zotero-plugin-toolkit/dist/basic";
import { UITool } from "zotero-plugin-toolkit/dist/tools/ui";
import { PreferencePaneManager } from "zotero-plugin-toolkit/dist/managers/preferencePane";
import { ClipboardHelper } from "zotero-plugin-toolkit/dist/helpers/clipboard";
import { DialogHelper } from "zotero-plugin-toolkit/dist/helpers/dialog";
import { FilePickerHelper } from "zotero-plugin-toolkit/dist/helpers/filePicker";
import { ProgressWindowHelper } from "zotero-plugin-toolkit/dist/helpers/progressWindow";
import { VirtualizedTableHelper } from "zotero-plugin-toolkit/dist/helpers/virtualizedTable";
import { LibraryTabPanelManager } from "zotero-plugin-toolkit/dist/managers/libraryTabPanel";
import { MenuManager } from "zotero-plugin-toolkit/dist/managers/menu";
import { PromptManager } from "zotero-plugin-toolkit/dist/managers/prompt";
import { ReaderInstanceManager } from "zotero-plugin-toolkit/dist/managers/readerInstance";
import { ReaderTabPanelManager } from "zotero-plugin-toolkit/dist/managers/readerTabPanel";
import { LargePrefHelper } from "zotero-plugin-toolkit/dist/helpers/largePref";

class MyToolkit extends BasicTool {
  UI: UITool;
  Prompt: PromptManager;
  LibraryTabPanel: LibraryTabPanelManager;
  ReaderTabPanel: ReaderTabPanelManager;
  ReaderInstance: ReaderInstanceManager;
  Menu: MenuManager;
  PreferencePane: PreferencePaneManager;
  Clipboard: typeof ClipboardHelper;
  FilePicker: typeof FilePickerHelper;
  ProgressWindow: typeof ProgressWindowHelper;
  VirtualizedTable: typeof VirtualizedTableHelper;
  Dialog: typeof DialogHelper;
  LargePref: typeof LargePrefHelper;

  constructor() {
    super();
    this.UI = new UITool(this);
    this.Prompt = new PromptManager(this);
    this.LibraryTabPanel = new LibraryTabPanelManager(this);
    this.ReaderTabPanel = new ReaderTabPanelManager(this);
    this.ReaderInstance = new ReaderInstanceManager(this);
    this.Menu = new MenuManager(this);
    this.PreferencePane = new PreferencePaneManager(this);
    this.Clipboard = ClipboardHelper;
    this.FilePicker = FilePickerHelper;
    this.ProgressWindow = ProgressWindowHelper;
    this.VirtualizedTable = VirtualizedTableHelper;
    this.Dialog = DialogHelper;
    this.LargePref = LargePrefHelper;
  }

  unregisterAll() {
    unregister(this);
  }
}
