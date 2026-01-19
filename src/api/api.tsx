import envVar from "../services/env";
import axios from "axios";

class API_SERVICE {
    private serverUrl:string;
    private axios: any;

    constructor() {
        this.serverUrl = envVar('SERVER_URL') || window.location.href;

        this.axios = axios.create({
            validateStatus: () => true // Always resolve, never reject for HTTP codes
        });
    }

    async createFetch(urlParams:string, method:string, body:any = null, headers:any = null, stringifyBody = true) {
        const apiUrl = `${this.serverUrl}${urlParams}`;

        if (!headers) {
            headers = { // default
                'Content-Type': 'application/json',
            };
        }

        let requestParams:any = {
            url: apiUrl,
            method: method,
        }

        if (Object.keys(headers).length > 0)
            requestParams['headers'] = headers;

        if (body) {
            if (stringifyBody)
                requestParams['data'] = JSON.stringify(body);
            else
                requestParams['data'] = body;
        }

        let result = null;
        try {
            result = await this.axios(requestParams);

            return result.data;
        }
        catch (e) {
            return { success: false };
        }
    }

    async dbAvailable() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/db/available', 'get');

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async getAllEvents(data:object) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/event/get', 'post', data);

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async getUpdateHebEvents() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/event/update-heb', 'get');

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async getMonthEvents(data:object) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/event/month', 'post', data);

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async getYearlyEvents(data:object) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/event/yearly', 'post', data);

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async addEvent(data:object) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/event/add', 'post', data);

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async deleteEvent(eventId:number) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/event/delete', 'delete', {id: eventId});

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async getAllUsers() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/user/all', 'get');

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }

    async setDefaultUser(userId:number) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.createFetch('/user/default', 'post', {user_id:userId});

                resolve(response);
            }
            catch (e:unknown) {
                reject({ success: false, message: (e as Error).message })
            }
        })
    }
}

const api = new API_SERVICE();

export default api;
