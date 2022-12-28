export default {
    writeJson: function(response: any, arg1: any, arg2?: any) {
        var code;
        var payload;

        if (arg1 && arg1.payload && arg1.code) {
            this.writeJson(response, arg1.payload, arg1.code);
            return;
        }

        if (arg2) {
            payload = arg1;
            code = arg2;
        } else if (arg1) {
            if (Number.isInteger(arg1)) {
                code = arg1;
            } else {
                payload = arg1;
            }
        }

        if (!code) {
            // if no response code given, we default to 200
            code = 200;
        }
        if (typeof payload === 'object') {
            payload = JSON.stringify(payload, null, 2);
        }
        response.writeHead(code, {'Content-Type': 'application/json'});
        response.end(payload);
    }
}