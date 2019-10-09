import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
    API_ROOT;
    STAGE;
    constructor(private httpClient: HttpClient,
        private googlePlus: GooglePlus) {
        this.API_ROOT = 'https://5ix15o3e92.execute-api.us-west-2.amazonaws.com';
        this.STAGE = '/prod' // Put your API Stage path here
    }

    async setCredentials(id_token) {
        try {
            let options = {
                headers: {
                    Authorization: id_token
                }
            };
            let endpoint = this.API_ROOT + this.STAGE + '/auth';
            let credentials = await this.httpClient.get(endpoint, options).toPromise();
            localStorage.setItem('id_token', id_token);
            localStorage.setItem('aws', JSON.stringify(credentials));
            console.log(JSON.stringify(credentials));
            return;
        } catch(err) {
            localStorage.removeItem('id_token');
            localStorage.removeItem('aws');
            throw err;
        }
    }

    getCredentials() {
        return localStorage.getItem('aws');
    }

    getIdToken() {
        return localStorage.getItem('id_token');
    }

    async login() {
        try {
            let res = await this.googlePlus.login({
                scope: 'profile email',
                webClientId: '699154144065-voqenqfgim5hkfq3osr0mojflr3cl5h0.apps.googleusercontent.com'
            });
            console.log("RESPONSE", JSON.stringify(res));
            await this.setCredentials(res.idToken);
            return res;
        } catch (err) {
            localStorage.removeItem('id_token');
            localStorage.removeItem('aws');
            throw err;
        }
    }

    async logout() {
        await this.googlePlus.logout();
        localStorage.removeItem('id_token');
        localStorage.removeItem('aws');
    }

}