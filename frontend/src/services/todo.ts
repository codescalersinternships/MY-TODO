import { SettingsStore } from '../stores';
import http from "./http-common";
import type { TodoType } from "../types";
import SettingsApi from "../components/settings/SettingsApi";
class TodosDataService {

    public async getAll(): Promise<{ data: TodoType[] }> {
        return http.get(`/todo`);
    }
    public async getById(id: number): Promise<{ data: TodoType[] }> {
        return http.get(`/todo?id=${id}`);
    }
    public async getByAuthor(author: string): Promise<{ data: TodoType[] }> {
        if (author === null) {
            SettingsApi.updateSettings();
            author = SettingsStore['name'];
            console.log("author was null", author);
        }
        return await http.get(`/todo?author=${author.toLowerCase().replace("#", '')}`);
    }
    public async create(data: TodoType): Promise<{ data: TodoType }> {
        if (data.author === null) {
            SettingsApi.updateSettings();
            data.author = SettingsStore['name'];
        }
        data.author = data.author.toLowerCase().replace("#", '');
        return http.post(`/todo`, data);
    }
    public async update(id: number, data: TodoType): Promise<{ data: TodoType[] }> {
        if (data.author === null) {
            SettingsApi.updateSettings();
            data.author = SettingsStore['name'];
        }
        console.log("in api status : ",data.status)
        data.author = data.author.toLowerCase().replace("#", '');
        return http.put(`/todo?id=${id}`, data);
    }
    public async delete(id: number): Promise<{ data: TodoType[] }> {
        return http.delete(`/todo?id=${id}`);
    }
}

export default new TodosDataService();