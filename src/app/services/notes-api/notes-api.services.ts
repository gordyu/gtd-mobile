import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { RequestSigner } from 'aws4';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class NotesApiService {

    API_ROOT;
    STAGE;
    options;

    constructor(private httpClient: HttpClient,
        private authService: AuthService) {
        this.API_ROOT = 'https://5ix15o3e92.execute-api.us-west-2.amazonaws.com';
        this.STAGE = '/prod' // Put your API Stage path here
        this.setOptions();
    }

    setOptions(path = '/', method = '', body = '') {

        const host = new URL(this.API_ROOT);

        let args = {
            service: 'execute-api',
            region: 'us-west-2',
            hostname: host.hostname,
            path: path,
            method: method,
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }; 

        if(method == 'GET') {
            delete args.body;
        }

        this.options = {};
        try {
            let savedCredsJson = this.authService.getCredentials();

            if(savedCredsJson) {
                let savedCreds = JSON.parse(savedCredsJson);
                let creds = {
                    accessKeyId: savedCreds.Credentials.AccessKeyId,
                    secretAccessKey: savedCreds.Credentials.SecretKey,
                    sessionToken: savedCreds.Credentials.SessionToken
                };
                
                let signer = new RequestSigner(args, creds);
                let signed = signer.sign();
                
                this.options.headers = signed.headers;
                delete this.options.headers.Host;
                this.options.headers.app_user_id = savedCreds.IdentityId;
                this.options.headers.app_user_name = savedCreds.user_name;
            }
        } catch (error) {
            // do nothing
        }        
    }

    addNote(item) {
        let path = this.STAGE + '/note';
        let endpoint = this.API_ROOT + path;

        let itemData;
        itemData = {
            content: item.content,
            cat: item.cat
        };

        if (item.title != "") {
            itemData.title = item.title;
        }

        let reqBody = {
            Item: itemData
        };

        this.setOptions(path, 'POST', JSON.stringify(reqBody));
        return this.httpClient.post(endpoint, reqBody, this.options);
    }

    updateNote(item) {
        let path = this.STAGE + '/note';
        let endpoint = this.API_ROOT + path;


        let itemData;
        itemData = {
            content: item.content,
            cat: item.cat,
            timestamp: parseInt(item.timestamp),
            note_id: item.note_id
        };

        if (item.title != "") {
            itemData.title = item.title;
        }

        let reqBody = {
            Item: itemData
        };

        this.setOptions(path, 'PATCH', JSON.stringify(reqBody));
        return this.httpClient.patch(endpoint, reqBody, this.options);
    }

    deleteNote(timestamp): Observable<any> {
        let path = this.STAGE + '/note/t/' + timestamp;
        let endpoint = this.API_ROOT + path;

        this.setOptions(path, 'DELETE');
        return this.httpClient.delete(endpoint, this.options);
    }

    getNotes(start?): Observable<any> {
        let path = this.STAGE + '/notes?limit=24';
        let endpoint = this.API_ROOT + path;

        if (start > 0) {
            endpoint += '&start=' + start;
        }
        this.setOptions(path, 'GET');
        return this.httpClient.get(endpoint, this.options);
    }

}