import axios from 'axios';

export const axiosInstance = axios.create({
    // baseURL : 'http://localhost:8000/api/',
    // timeout : 5000,
    // headers : {
    //     Authorization : localStorage.getItem('token') ? `Token ${JSON.parse(localStorage.getItem('token'))}` : null,
    //     'Content-Type' : 'application/json',
    //     accept : 'application/json',
    // },
});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method : `${method}`,
        url : `${url}`,
        data : bodyData ? bodyData : null,
        headers : headers ? headers : null,
        params : params ? params : null,
    })
}
