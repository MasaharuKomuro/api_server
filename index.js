// expressモジュールを読み込む
const express = require('express');

const request = require('request');

const CryptoJS = require('crypto-js');

// expressアプリを生成する
const app = express();

// ルート（http://localhost/）にアクセスしてきたときに「Hello」を返す
app.get('/', (req, res) => {
    var result = AAtest(res);
});

const AAtest = (res) => {
    const api = 'https://api4.omniture.com/admin/1.4/rest/?method=Company.GetReportSuites';
    const username = ''; // please enter your username
    const secret = '';   // please enter your secret

    var uuid = function () {};
    uuid.v4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    var WSSE = function (username, secret) {
        this.username = username;
        this.secret = secret;
    };

    WSSE.prototype.getHeader = function () {
        var nonce = uuid.v4();
        var created = new Date().toISOString();

        var hashString = nonce + created + this.secret;
        var digest = CryptoJS.SHA256(hashString).toString(CryptoJS.enc.Base64);
        var b64nonce = CryptoJS.enc.Latin1.parse(nonce).toString(CryptoJS.enc.Base64);

        var header = "UsernameToken";
        header += " Username=\"" + this.username + "\",";
        header += " PasswordDigest=\"" + digest + "\",";
        header += " Nonce=\"" + b64nonce + "\",";
        header += " Created=\"" + created + "\",";
        header += " Algorithm=\"SHA256\"";

        return {'X-WSSE': header};
    };

    var wsse = new WSSE(username, secret);
    wsse = wsse.getHeader()['X-WSSE'];

    console.log(wsse);

    //res.send();
    //return;

    const request_options = {
        url: api,
        method: 'POST',
        headers: {
            'X-WSSE': wsse,
        },
        strictSSL: false
    };

    request(request_options, function (error, response, body) {
        console.log(error);
        console.log(body);
        if (!error) {
            console.log('response status: ' + response.statusCode);
            console.log('response headers content-type: ' + response.headers['content-type']);
            console.log(response.message);
            //console.log( response );
            res.send(response);
        } else {
            console.log('error: ' + error.message);
            res.status(500);
            res.end('Internal Server Error'); // これがないとレスポンスが返らない
        }
    });
};

// ポート3000でサーバを立てる
app.listen(3000, () => console.log('Listening on port 3000'));