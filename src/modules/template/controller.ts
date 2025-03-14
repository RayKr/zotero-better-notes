import YAML = require("yamljs");
import { getPref } from "../../utils/prefs";
import { showHint } from "../../utils/hint";
import { config } from "../../../package.json";

export {
  getTemplateKeys,
  getTemplateText,
  setTemplate,
  removeTemplate,
  initTemplates,
  importTemplateFromClipboard,
};

function initTemplates() {
  addon.data.template.data = new ztoolkit.LargePref(
    `${config.prefsPrefix}.templateKeys`,
    `${config.prefsPrefix}.template.`,
    "parser",
  );
  // Convert old template keys to new format
  const raw = getPref("templateKeys") as string;
  let keys = raw ? JSON.parse(raw) : [];
  if (keys.length > 0 && typeof keys[0] !== "string") {
    keys = keys.map((t: { name: string }) => t.name);
    setTemplateKeys(keys);
  }
  // Add default templates
  const templateKeys = getTemplateKeys();
  for (const defaultTemplate of addon.api.template.DEFAULT_TEMPLATES) {
    if (!templateKeys.includes(defaultTemplate.name)) {
      setTemplate(defaultTemplate, false);
    }
  }
  addon.hooks.onUpdateTemplatePicker();
}

function getTemplateKeys(): string[] {
  return addon.data.template.data?.getKeys() || [];
}

function setTemplateKeys(templateKeys: string[]): void {
  addon.data.template.data?.setKeys(templateKeys);
}

function getTemplateText(keyName: string): string {
  return addon.data.template.data?.getValue(keyName) || "";
}

function setTemplate(
  template: NoteTemplate,
  updatePrompt: boolean = true,
): void {
  addon.data.template.data?.setValue(template.name, template.text);
  if (updatePrompt) {
    addon.hooks.onUpdateTemplatePicker();
  }
}

function removeTemplate(
  keyName: string | undefined,
  updatePrompt: boolean = true,
): void {
  if (!keyName) {
    return;
  }
  addon.data.template.data?.deleteKey(keyName);
  if (updatePrompt) {
    addon.hooks.onUpdateTemplatePicker();
  }
}

function importTemplateFromClipboard() {
  const templateText = Zotero.Utilities.Internal.getClipboard("text/unicode");
  if (!templateText) {
    return;
  }
  let template: Record<string, string>;
  try {
    template = YAML.parse(templateText);
  } catch (e) {
    try {
      template = JSON.parse(templateText);
    } catch (e) {
      template = { name: "", text: "" };
    }
  }
  if (!template.name) {
    showHint("The copied template is invalid");
    return;
  }
  if (!window.confirm(`Import template "${template.name}"?`)) {
    return;
  }
  setTemplate({ name: template.name, text: template.content });
  showHint(`Template ${template.name} saved.`);
}
