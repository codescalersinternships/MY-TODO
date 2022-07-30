import type { SettingsType } from "../../types";
import { SettingsStore } from "../../stores";

class SettingsApi {

    public getSettings(): SettingsType {
        const settings: SettingsType = {
            name: localStorage.getItem("name"),
            email: localStorage.getItem("email"),
            "primary-color": localStorage.getItem("primary-color") || "#aaaa",
            "secondary-color": localStorage.getItem("secondary-color") || "#eee",
            "background-image": localStorage.getItem("background-image") || "url('https://wallpaperaccess.com/full/2159209.jpg')"
        }
        return settings;
    }


    public setSettings(settings: SettingsType): void {
        localStorage.setItem("name", settings.name);
        localStorage.setItem("email", settings.email);
        localStorage.setItem("primary-color", settings["primary-color"]);
        localStorage.setItem("secondary-color", settings["secondary-color"]);
        localStorage.setItem("background-image", settings["background-image"]);
        this.updateSettings();
    }
    public updateSettings(): void {
        const settings: SettingsType = {
            name: localStorage.getItem("name"),
            email: localStorage.getItem("email"),
            "primary-color": localStorage.getItem("primary-color") || "#aaaa",
            "secondary-color": localStorage.getItem("secondary-color") || "#eee",
            "background-image": localStorage.getItem("background-image") || "url('https://wallpaperaccess.com/full/2159209.jpg')"
        }
        SettingsStore.set(settings);
    }
    public isName(): boolean {
        console.log("@localStorage", localStorage.getItem("name"));
        console.log("@localStorage name", localStorage.getItem("name") !== null);
        return localStorage.getItem("name") !== null;
    }
    public getName(): string {
        return localStorage.getItem("name");
    }
}

export default new SettingsApi();