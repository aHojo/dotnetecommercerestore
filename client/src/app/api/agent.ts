import axios, {AxiosError, AxiosResponse} from "axios";

axios.defaults.baseURL = "http://localhost:5000/api/";

const responseBody = (response: AxiosResponse) => {
    return response.data;
};

axios.interceptors.response.use(response => {
    return response;
}, (error: AxiosError) => {
    console.log("caught by interceptor")
    return Promise.reject(error.response);
})
const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Catalog = {
    // in the get the request is pre-peneded with the baseURL up on line 3
    list: () => requests.get('products'),
    details: (id: number) => requests.get(`products/${id}`)
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unathorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),

}

const agent = {
    Catalog,
    TestErrors,
}

export default agent;
