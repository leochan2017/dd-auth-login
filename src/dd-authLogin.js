// Dingtalk login function
// by leo  20160219

// console.log = (function() {
//     return function(a, b) {
//         if (b) {
//             alert(a + ':' + JSON.stringify(b));
//         } else {
//             alert(JSON.stringify(a));
//         }
//     }
// })(console.log);

(function(w) {
    var authLogin = authLogin || {};
    var corpid, suiteid, appid, url;
    var dderrorError = false,
        status = 0;

    var getUrlParam = function(param) {
        var reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    };

    var getCookie = function(name) {
        var arr = [];
        var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');

        if (arr = document.cookie.match(reg)) {
            return (arr[2]);
        } else {
            return null;
        }
    };

    var base64_decode = function(str) {
        var c1, c2, c3, c4;
        var base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
            58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
            7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
        ];
        var i = 0,
            len = str.length,
            string = '';

        while (i < len) {
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
            } while (
                i < len && c1 == -1
            );

            if (c1 == -1) break;

            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
            } while (
                i < len && c2 == -1
            );

            if (c2 == -1) break;

            string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return string;

                c3 = base64DecodeChars[c3]
            } while (
                i < len && c3 == -1
            );

            if (c3 == -1) break;

            string += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61) return string;
                c4 = base64DecodeChars[c4]
            } while (
                i < len && c4 == -1
            );

            if (c4 == -1) break;

            string += String.fromCharCode(((c3 & 0x03) << 6) | c4)
        }
        return string;
    };

    var getToken = function(name) {
        var token = getCookie(name);

        if (!token || token == '' || typeof token == 'undefined') {
            return false;
        }

        token = base64_decode(token);

        token = token.substring(0, token.length - 20);

        token = token.substring(20);

        token = JSON.parse(token);

        return token;
    };

    var ajax = function(options) {
        options = options || {};
        options.type = (options.type || 'GET').toUpperCase();
        options.dataType = options.dataType || 'json';
        // var params = formatParams(options.data);
        // console.log(options.data);
        // console.log(params);

        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else {
            var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        }

        if (options.type == 'GET') {
            xhr.open('GET', options.url, true);
            xhr.send(null);
        } else if (options.type == 'POST') {
            xhr.open('POST', options.url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(options.data);
        }
    };

    var formatParams = function(data) {
        var arr = [];

        for (var name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }

        arr.push(('v=' + Math.random()).replace('.', ''));

        return arr.join('&');
    };

    var sign = function(succ, fail) {
        var strhost = '/alid/getJsapiSignature';

        var dataObj = {};

        dataObj.corpid = corpid;
        dataObj.suiteid = suiteid;
        dataObj.appid = appid;
        dataObj.url = url;

        ajax({
            url: strhost,
            type: 'POST',
            data: JSON.stringify(dataObj),
            dataType: 'json',
            success: function(res) {
                res = JSON.parse(res);
                console.log('后台签名数据返回:', res);

                if (!res || typeof res == 'undefined') {
                    var str = 'sign ajax is no result';
                    console.error(str);
                    fail(str);
                    return;
                }

                if (parseInt(res.mess) != 1) {
                    var str = 'sign ajax result mess is not = 1';
                    console.error(str);
                    fail(str);
                    return;
                }

                var _agentId = res.agentId;

                var _timeStamp = res.timeStamp;

                var _nonceStr = res.nonceStr;

                var _signature = res.signature;

                dd.config({
                    agentId: _agentId, // 必填，微应用ID
                    corpId: corpid, //必填，企业ID
                    timeStamp: _timeStamp, // 必填，生成签名的时间戳
                    nonceStr: _nonceStr, // 必填，生成签名的随机串
                    signature: _signature, // 必填，签名
                    jsApiList: [
                        'runtime.permission.requestAuthCode',
                        'biz.util.datepicker',
                        'biz.util.timepicker',
                        'biz.util.datetimepicker',
                        'biz.ding.post',
                        'biz.telephone.call',
                        'biz.user.get',
                        'biz.contact.choose',
                        'biz.contact.createGroup',
                        'biz.contact.complexChoose',
                        'biz.util.chosen',
                        'biz.util.openLink',
                        'biz.util.uploadImage',
                        'biz.util.previewImage',
                        'biz.util.open',
                        'biz.util.share',
                        'biz.navigation.setTitle',
                        'biz.navigation.setLeft',
                        'biz.navigation.setRight',
                        'biz.navigation.close',
                        'biz.chat.pickConversation',
                        'biz.chat.chooseConversation',
                        'biz.chat.toConversation',
                        'biz.chat.chooseConversationByCorpId',
                        'biz.navigation.setIcon',
                        'ui.progressBar.setColors',
                        'ui.webViewBounce.disable',
                        'ui.input.plain'
                    ]
                });

                dd.error(function(error) {
                    dderrorError = error;
                });

                setTimeout(function() {
                    if (dderrorError) {
                        console.error('dd config error:', dderrorError);
                        fail(str);
                    } else if (status != 1) {
                        console.log('签名成功，准备免登');
                        login(succ, fail);
                    } else {
                        console.log('签名成功，不需要免登');

                        var obj = {};

                        obj.auth = '1';

                        succ(obj);
                    }
                }, 1000);

            },
            fail: function(err) {
                var str = 'sign ajax fail' + JSON.stringify(err);
                console.error(str);
                fail(err);
            }
        });
    };

    var login = function(succ, fail) {
        console.log('开始免登');
        if (typeof dd != 'undefined') {
            var api = dd;
        } else if (typeof DingTalkPC != 'undefined') {
            var api = DingTalkPC;
        } else {
            fail('JSAPI is fail');
            return;
        }

        console.log('当前api是:', api);

        api.ready(function() {
            api.runtime.permission.requestAuthCode({
                corpId: corpid,
                onSuccess: function(d) {
                    console.log('钉钉获取code返回:', d);
                    var ajaxURL = '/alid/oauth2?corpid=' + corpid + '&suiteid=' + suiteid + '&code=' + d.code;

                    ajax({
                        url: ajaxURL,
                        type: 'GET',
                        data: null,
                        dataType: 'json',
                        success: function(res) {
                            console.log('后台免登返回:', res);
                            var obj = JSON.parse(res);

                            if (obj.auth != 1) {
                                fail(obj);
                            } else {
                                succ(obj);
                            }

                        },
                        fail: function(res) {
                            console.log('后台免登返回:', res);
                            var obj = JSON.parse(res);
                            fail(obj);
                        }
                    });

                },
                onFail: function(err) {
                    var str = 'Get DingTalk code fail' + JSON.stringify(err);
                    console.error(str);
                    fail(str);
                }
            });
        });

        api.error(function(err) {
            console.log('dd api 又掉链子了');
            console.log(err);
        });

    };

    var init = function(succ, fail) {
        var cookieObj = getToken('LWEQYTOKEN');
        var succ = succ || function() {};
        var fail = fail || function() {};

        corpid = getUrlParam('corpid');
        suiteid = getUrlParam('suiteid');
        appid = getUrlParam('appid');
        url = window.location.href;

        // console.log('corpid:' + corpid);
        // console.log('suiteid:' + suiteid);
        // console.log('appid:' + appid);
        // console.log('url:' + url);

        if (cookieObj) {
            if (cookieObj.c && cookieObj.c == corpid) {
                status = 1;
                console.log('cookie corpid is right , do not login');

                sign(succ, fail);

                var obj = {};

                obj.auth = '1';
            } else {
                status = 2;
                console.log('cookie corpid is not right, need login');
                sign(succ, fail);
                // login(succ, fail);
            }
        } else {
            status = 3;
            console.log('cookie has not corpid, need login');
            sign(succ, fail);
            // login(succ, fail);
        }
    };

    w.authLogin = authLogin;
    authLogin.init = init;

})(window);
