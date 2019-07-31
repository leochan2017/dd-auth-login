// A auth login js library from Dingtalk
// Author: Leo
// Last update: 2019.07.29
;(function($w) {
  var __NAME__ = 'ddAuthLogin'
  var _noop = function() {}

  var myObj = {
    libName: __NAME__,
    debug: false,
    // 请求签名地址
    getSignUrl: '/data/labc-biz-dingding/dingTalk/getAuthInfo',
    // 请求sso地址
    ssoUrl: '/data/labc-biz-dingding/dingTalk/sso',
    // 成功回调
    success: _noop,
    // 失败回调
    fail: _noop,
    // 要签名的功能列表
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
  }

  var logger =
    typeof console === 'undefined'
      ? {
          log: _noop,
          debug: _noop,
          error: _noop,
          warn: _noop,
          info: _noop
        }
      : console

  if (!logger.debug) logger.debug = _noop

  if (typeof module === 'undefined' || !module.exports) {
    if (typeof $w[__NAME__] !== 'undefined') {
      logger.error(__NAME__ + '已经存在啦啦啦啦~')
      return
    }
  }

  if (typeof dd === 'undefined') {
    logger.error('请先引入 dd.js 再调用本库蛤')
  }

  var _ajax = function(options) {
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

  /**
   * 进行免登
   */
  function _ssoLogin(corpId) {
    dd.ready(function() {
      dd.runtime.permission.requestAuthCode({
        corpId: corpId,
        onSuccess: function(d) {
          if (!d || !d.code) {
            var str = '免登过程中获取钉钉code失败'
            myObj.debug && logger.error(str)
            myObj.fail(str)
            return
          }

          _ajax({
            url: myObj.ssoUrl + '?authCode=' + d.code,
            type: 'GET',
            data: null,
            dataType: 'json',
            success: function(res) {
              if (!res) {
                var str = '免登接口集合返回失败'
                myObj.debug && logger.error(str)
                myObj.fail(str)
                return
              }
              myObj.success('Login Success!')
            },
            fail: function(error) {
              myObj.debug && logger.error(error)
              myObj.fail(error)
            }
          })
        },
        onFail: function(error) {
          myObj.debug && logger.error(error)
          myObj.fail(error)
        }
      })
    })
  }

  /**
   * 获取免登信息 & 签名
   */
  function _getSign() {
    _ajax({
      url: myObj.getSignUrl + '?url=' + location.href,
      type: 'GET',
      data: '',
      dataType: 'json',
      success: function(res) {
        res = JSON.parse(res)
        myObj.debug && logger.log('后台签名数据返回:', res)

        if (!res || typeof res == 'undefined') {
          var str = 'sign ajax is no result'
          myObj.debug && logger.error(str)
          myObj.fail(str)
          return
        }

        const _config = res.content

        if (!_config) {
          var str = 'sign: res.content is no data'
          myObj.debug && logger.error(str)
          myObj.fail(str)
          return
        }

        dd.config({
          agentId: _config.agentId,
          corpId: _config.corpId,
          timeStamp: _config.timeStamp,
          nonceStr: _config.nonceStr,
          signature: _config.signature,
          jsApiList: myObj.jsApiList
        })

        dd.error(function(error) {
          myObj.debug && logger.error(error)
          myObj.fail(error)
        })

        // 如果已经登录，则返回true，此时可以不用调用sso
        if (_config.hasLogin) {
          myObj.success('Login Success!')
          return
        }

        _ssoLogin(_config.corpId)
      },
      fail: function(err) {
        var str = 'sign ajax fail:' + JSON.stringify(err)
        myObj.debug && logger.error(str)
        myObj.fail(err)
      }
    })
  }

  // 初始化函数
  myObj.login = function(options) {
    if (typeof options !== 'object') {
      myObj.debug && logger.error('啥参数都不传嘛?')
      return
    }

    if (typeof options.debug !== 'undefined') {
      myObj.debug = options.debug
    }

    if (options.getSignUrl) {
      myObj.getSignUrl = options.getSignUrl
    }

    if (options.ssoUrl) {
      myObj.ssoUrl = options.ssoUrl
    }

    if (options.jsApiList) {
      myObj.jsApiList = options.jsApiList
    }

    if (options.success) {
      myObj.success = options.success
    }

    if (options.fail) {
      myObj.fail = options.fail
    }

    _getSign()
  }

  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = myObj
  } else if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(function() {
      return myObj
    })
  } else {
    $w[__NAME__] = myObj
  }
})(window)
