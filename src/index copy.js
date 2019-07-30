// A auth login js library from Dingtalk
// Author: Leo
// Last update: 2019.07.29

;(function(w) {
  var authLogin = authLogin || {}

  // 后台需要的参数
  var corpid, url

  // 自己构造的参数
  var dderrorError = false

  // 传入的配置参数
  var _options, _debug, _currApp, succFn, failFn

  var getUrlParam = function(param) {
    var reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  }

  var getCookie = function(name) {
    var arr = []
    var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')

    if ((arr = document.cookie.match(reg))) {
      return arr[2]
    } else {
      return null
    }
  }

  var base64_decode = function(str) {
    var c1, c2, c3, c4
    var base64DecodeChars = [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      62,
      -1,
      -1,
      -1,
      63,
      52,
      53,
      54,
      55,
      56,
      57,
      58,
      59,
      60,
      61,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      -1,
      -1,
      -1,
      -1,
      -1
    ]
    var i = 0,
      len = str.length,
      string = ''

    while (i < len) {
      do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      } while (i < len && c1 == -1)

      if (c1 == -1) break

      do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      } while (i < len && c2 == -1)

      if (c2 == -1) break

      string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4))

      do {
        c3 = str.charCodeAt(i++) & 0xff
        if (c3 == 61) return string

        c3 = base64DecodeChars[c3]
      } while (i < len && c3 == -1)

      if (c3 == -1) break

      string += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2))

      do {
        c4 = str.charCodeAt(i++) & 0xff
        if (c4 == 61) return string
        c4 = base64DecodeChars[c4]
      } while (i < len && c4 == -1)

      if (c4 == -1) break

      string += String.fromCharCode(((c3 & 0x03) << 6) | c4)
    }
    return string
  }

  var getToken = function(name) {
    var token = getCookie(name)

    if (!token || token == '' || typeof token == 'undefined') {
      return false
    }

    token = base64_decode(token)

    token = token.substring(0, token.length - 20)

    token = token.substring(20)

    token = JSON.parse(token)

    return token
  }

  var ajax = function(options) {
    options = options || {}
    options.type = (options.type || 'GET').toUpperCase()
    options.dataType = options.dataType || 'json'

    if (window.XMLHttpRequest) {
      var xhr = new XMLHttpRequest()
    } else {
      var xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var status = xhr.status
        if (status >= 200 && status < 300) {
          options.success && options.success(xhr.responseText, xhr.responseXML)
        } else {
          options.fail && options.fail(status)
        }
      }
    }

    if (options.type == 'GET') {
      xhr.open('GET', options.url, true)
      xhr.send(null)
    } else if (options.type == 'POST') {
      xhr.open('POST', options.url, true)
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      xhr.send(options.data)
    }
  }

  var formatParams = function(data) {
    var arr = []

    for (var name in data) {
      arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))
    }

    arr.push(('v=' + Math.random()).replace('.', ''))

    return arr.join('&')
  }

  // 输出错误信息 到 失败方法
  var consoleErrMsg = function(msg, data) {
    var obj = {}
    obj.errMsg = msg || ''
    if (data) {
      obj.errData = data
    }
    failFn(obj)
  }

  // 钉钉签名
  var dingTalkSign = function(succ) {
    // 20170321
    var strhost = '/yw/ddsuite/dingauth/getjsapisignature' + w.location.search + '&url=' + url
    // var strhost = '/yw/ddsuite/dingauth/getGroupTicket' + w.location.search + '&url=' + url;
    // var strhost = '/yw/ddsuite/dingauth/getJsapiSignature' + w.location.search + '&url=' + url;

    ajax({
      url: strhost,
      type: 'GET',
      data: null,
      dataType: 'json',
      success: function(res) {
        _debug && console.log('后台签名数据返回:', res)

        if (!res || typeof res == 'undefined') {
          consoleErrMsg('dingTalkSign ajax is no result')
          return
        }

        res = JSON.parse(res)

        if (parseInt(res.mess) != 1) {
          consoleErrMsg('dingTalkSign ajax result mess is not = 1')
          return
        }

        var _agentId = res.agentId,
          _timeStamp = res.timeStamp.toString(),
          _nonceStr = res.nonceStr,
          _signature = res.signature,
          // _version = res.vercookie,
          // cookieObj = getToken('LWEQYTOKEN'),
          _auth = parseInt(res.auth)

        // console.log('cookieObj', cookieObj);
        // console.log('_version', _version);

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
        })

        dd.error(function(error) {
          dderrorError = error
        })

        if (dderrorError) {
          consoleErrMsg('dd config error', dderrorError)
          return
        }

        if (_auth == 0) {
          _debug && console.log('签名成功，准备免登')
          dingTalkLogin(succ)
          return
        }

        // if (cookieObj && typeof cookieObj != 'undefined' && cookieObj != null) {
        //     var localVersion = cookieObj.v || '';
        //     if (localVersion == '' || localVersion != _version) {
        //         _debug && console.log('版本旧了，需要免登');
        //         // dingTalkLogin(succ);
        //         return;
        //     }
        // }

        // auth != 0
        _debug && console.log('签名成功，不需要免登')

        var obj = {}

        obj.auth = '1'

        succ(obj)

        // setTimeout(function() {
        // }, 1000);
      },
      fail: function(err) {
        consoleErrMsg('dingTalkSign ajax fail', err)
      }
    })
  }

  // 钉钉免登
  var dingTalkLogin = function(succ) {
    _debug && console.log('开始钉钉免登')
    if (typeof dd != 'undefined') {
      var api = dd
    } else if (typeof DingTalkPC != 'undefined') {
      var api = DingTalkPC
    } else {
      consoleErrMsg('DingTalk JSAPI is not load')
      return
    }

    _debug && console.log('当前钉钉的api是:', api)

    api.ready(function() {
      api.runtime.permission.requestAuthCode({
        corpId: corpid,
        onSuccess: function(d) {
          _debug && console.log('钉钉获取code返回:', d)

          var ajaxURL = '/yw/ddsuite/dingauth/oauth2' + w.location.search + '&url=' + url + '&code=' + d.code

          ajax({
            url: ajaxURL,
            type: 'GET',
            data: null,
            dataType: 'json',
            success: function(res) {
              _debug && console.log('后台免登返回:', res)

              var obj = JSON.parse(res)

              if (obj.auth != 1) {
                consoleErrMsg('auth is not :1', obj)
              } else {
                succ(obj)
              }
            },
            fail: function(res) {
              consoleErrMsg('后台免登失败', JSON.parse(res))
            }
          })
        },
        onFail: function(err) {
          consoleErrMsg('Get DingTalk code fail', err)
        }
      })
    })

    api.error(function(err) {
      consoleErrMsg('dd api error', err)
    })
  }

  // 微信签名
  var wechatSign = function(succ) {
    if (_options.ajaxURL && typeof _options.ajaxURL != 'undefined' && _options.ajaxURL != '') {
      var ajaxURL = _options.ajaxURL
    } else {
      var ajaxURL = '/yw/lancloud/mp/api/getJsapiSignature'
    }

    if (ajaxURL.indexOf('?') > -1) {
      ajaxURL += '&url=' + url
    } else {
      ajaxURL += '?url=' + url
    }

    _debug && console.log('wechat签名', ajaxURL)

    ajax({
      url: ajaxURL,
      type: 'GET',
      data: null,
      dataType: 'json',
      success: function(res) {
        res = JSON.parse(res)
        _debug && console.log('后台签名数据返回:', res)

        if (!res || typeof res == 'undefined') {
          consoleErrMsg('wechat sign ajax is no result')
          return
        }

        if (parseInt(res.errcode) != 200 && parseInt(res.errcode) != 0) {
          consoleErrMsg('wechat sign ajax result errcode is not = 200 or not = 0')
          return
        }

        if (res.errcode == 0) {
          res = res.appId ? res : res.data
        }

        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.appId, // 必填，公众号的唯一标识
          timestamp: res.timestamp || res.timeStamp, // 必填，生成签名的时间戳
          nonceStr: res.nonceStr, // 必填，生成签名的随机串
          signature: res.signature, // 必填，签名，见附录1
          jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'onVoicePlayEnd',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'translateVoice',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })

        wx.error(function(err) {
          consoleErrMsg('wx.error', err)
        })

        wx.ready(function(res) {
          _debug && console.log('wx签名成功')
          succ(res)
        })
      },
      fail: function(err) {
        consoleErrMsg('wechat sign ajax fail', err)
      }
    })
  }

  var init = function(succ, fail, options) {
    var succ = succ || function() {}

    _options = options || {}

    _debug = _options.debug || false

    _currApp = _options.currApp

    // 如果没值 默认微信
    if (!_currApp || _currApp == '' || typeof _currApp == 'undefined') {
      _currApp = getUrlParam('app') || 'wechat'
    }

    url = encodeURIComponent(window.location.href.split('#')[0])

    // 全局成功失败方法
    succFn = succ || function(res) {}
    failFn = fail || function(res) {}

    if (_currApp.indexOf('wechat') != -1) {
      wechatSign(succ)
    } else if (_currApp.indexOf('dingtalk') != -1) {
      corpid = getUrlParam('corpid')

      dingTalkSign(succ)
    } else {
      consoleErrMsg('获取app的值失败，当前为：' + _currApp)
    }
  }

  w.authLogin = authLogin
  authLogin.init = init
})(window)
