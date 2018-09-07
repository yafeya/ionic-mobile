import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HttpClient {

    private headers: Headers;
    private errorHandler: (error: any) => void;
    OutputDebugging = true;

    constructor(private http: Http) {

        this.errorHandler = (error) => {
            console.error(error);
        };

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }

    /*
     * Post data to given url
     * @param url Post url
     * @param data  post data
     */
    Post(url: string, data: any): Promise<any> {
        const self = this;
        return new Promise(function (resolve, reject) {

            const body = JSON.stringify(data);

            if (self.OutputDebugging) {
                console.log(`Post data url: ${url}\n${body}`);
            }

            self.http.post(url, body, { headers: self.headers })
                .toPromise()
                .then(response => {
                    resolve(response.json());
                })
                .catch(error => {
                    if (self.errorHandler) {
                        self.errorHandler(error);
                    }
                    reject(error);
                }
                );
        });
    }
    /**
     * Post raw string to given url
     * @param url url to post data
     * @param data data in string format
     */
    PostRaw(url: string, data: string): Promise<any> {
        const self = this;
        return new Promise(function (resolve, reject) {

            if (self.OutputDebugging) {
                console.log(`Post data url: ${url}\n${data}`);
            }

            self.http.post(url, data, { headers: self.headers })
                .toPromise()
                .then(response => {
                    resolve(response.json());
                })
                .catch(error => {
                    if (self.errorHandler) {
                        self.errorHandler(error);
                    }
                    reject(error);
                }
                );
        });
    }
    /**
     * Delete reques
     * @param url the url for delete
     */
    Delete(url: string): Promise<any> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.http.delete(url)
                .toPromise()
                .then(response => {
                    resolve(response.json());
                })
                .catch(error => {
                    if (self.errorHandler) {
                        self.errorHandler(error);
                    }
                    reject(error);
                });
        });
    }
    /**
     * Get data from given url in async mode
     * @param url the url to get data.
     */
    Get(url: string, useRaw = false): Promise<any> {
        const self = this;
        return new Promise(function (resolve, reject) {
            if (self.OutputDebugging) {
                console.log(`Get data url: ${url}`);
            }
            self.http.get(url)
                .toPromise()
                .then(response => {
                    if (useRaw) {
                        resolve(response);
                    } else {
                        resolve(response.json());
                    }
                })
                .catch(error => {
                    if (self.errorHandler) {
                        self.errorHandler(error);
                    }
                    reject(error);
                });
        });
    }

    /**
     * Create a new header with given token
     * @param token bearer token value
     */
    UseToken(token: string): HttpClient {
        const headers = this.CreateDefaultHeader();
        if (token) {
            headers.append('Authorization', `bearer ${token}`);
        }
        this.headers = headers;
        return this;
    }
    /**
     * User given header or the default header with content type set to json
     * @param headers given header
     */
    UseHeader(headers: Headers = this.CreateDefaultHeader()): HttpClient {
        if (!headers) {
            throw new Error('Given http header is null.');
        }
        this.headers = headers;
        return this;
    }

    private CreateDefaultHeader(): Headers {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return headers;
    }
}
