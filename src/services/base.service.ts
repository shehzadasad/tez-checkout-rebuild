import axios, { CancelTokenStatic, CancelTokenSource, AxiosRequestConfig } from "axios";
// const Config = process.env.REACT_APP_API_KEY;

export class HttpService {
    CancelToken: CancelTokenStatic;
    source: CancelTokenSource;
    baseUrl: string

    constructor(baseUrl: string = "") {
        this.CancelToken = axios.CancelToken;
        this.source = this.CancelToken.source();
        this.baseUrl = baseUrl;
    }

    /**
     * Set Token On Header
     * @param token
     */
    static setToken(token: string): void {
        axios.defaults!.headers.common["Authorization"] = `Bearer ${token}`;
    }

    /**
     * Fetch data from server
     * @param url Endpoint link
     * @return Promise
     */
    protected get = async (url: string, params?: any, options: AxiosRequestConfig = {}): Promise<any> => {
        const res = await axios.get(`${this.baseUrl}/${url}`, {
            params,
            cancelToken: this.source.token,
            ...options
        });
        return res.data;
    }

    /**
     * Write data over server
     * @param url Endpoint link
     * @param body Data to send over server
     * @return Promise
     */
    protected post = async (url: string, body: any, options: AxiosRequestConfig = {}): Promise<any> => {
        const res = await axios.post(`${this.baseUrl}/${url}`, body, {
            ...options,
            cancelToken: this.source.token,
        });
        return res.data;
    }


    /**
     * Delete Data From Server
     * @param url Endpoint link
     * @param params Embed as query params
     * @return Promise
     */
    protected delete = async (url: string, params?: any, data?: any, options: AxiosRequestConfig = {}): Promise<any> => {
        const res = await axios.delete(`${this.baseUrl}/${url}`, { params, data, ...options });
        return res;
    }

    /**
     * Update data on server
     * @param url Endpoint link
     * @param body Data to send over server
     * @param params Embed as query params
     * @return Promise
     */
    protected put = async (url: string, body?: any, params?: any, options: AxiosRequestConfig = {}): Promise<any> => {
        const res = await axios.put(`${this.baseUrl}/${url}`, body, {
            ...params,
            cancelToken: this.source.token,
        });
        return res;
    }

    private updateCancelToken() {
        this.source = this.CancelToken.source();
    }

    cancel = () => {
        this.source.cancel("Explicitly cancelled HTTP request");
        this.updateCancelToken();
    };


}