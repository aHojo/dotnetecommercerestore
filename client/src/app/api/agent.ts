import axios, { AxiosError, AxiosResponse } from "axios";
import { request } from "http";
import { toast } from "react-toastify";
import { history } from "../../index";

const sleep = () => {

  return new Promise(resolve => setTimeout(resolve, 500));
}
axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => {
  return response.data;
};

axios.interceptors.response.use(async response => {
  await sleep();
  return response;
}, (error: AxiosError) => {

  const { data, status } = error.response! as any;
  console.log(data);
  switch (status) {
    case 400:
      // for validation errors which is also a 400
      if (data.errors) {
        const modelStateErrors: string[] = [];
        for (const key in data.errors) {
          if (data.errors[key]) {
            modelStateErrors.push(data.errors[key]);
          }
        }
        throw modelStateErrors.flat();
      }
      toast.error(data.title);
      break;
    case 401:
      toast.error(data.title);
      break;
    case 500:
      history.push({
        pathname: '/server-error',

      }, { error: data });
      break;
    default:
      break;
  }
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
  get401Error: () => requests.get('buggy/unauthorized'),
  get404Error: () => requests.get('buggy/not-found'),
  get500Error: () => requests.get('buggy/server-error'),
  getValidationError: () => requests.get('buggy/validation-error'),

}

const Basket = {
  get: () => requests.get('basket'),
  //http://localhost:5000/api/Basket?productId=1&quantity=1
  addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number, quantity = 1) => requests.delete(`baseket?productId=${productId}&quantity=${quantity}`),
}

const agent = {
  Catalog,
  TestErrors,
  Basket
}

export default agent;
