# [dd-auth-login](https://github.com/leochan2017/dd-auth-login)

![By Leo](https://img.shields.io/badge/Powered_by-Leo-red.svg?style=flat) 
![凑图标](https://travis-ci.org/Alamofire/Alamofire.svg?branch=master)
![GitHub last commit](https://img.shields.io/github/last-commit/leochan2017/dd-auth-login.svg)
![Hex.pm](https://img.shields.io/hexpm/l/plug.svg)

最好用的钉钉免登签名js库


## :open_file_folder: 目录介绍

```
.
├── dist 编译产出代码
├── src 源代码目录
└── demo.html 示例文件
```

## :rocket: 使用者指南

如果你是浏览器环境

```html
<script src="./dist/dd-auth-login.min.js"></script>
```


如果你是webpack等环境

```js
import ddAuthLogin from 'dd-auth-login';
```

如果你是requirejs环境

```js
requirejs(['./dist/dd-auth-login.min.js'], function (base) {
    // xxx
})
```

## :kissing_heart: 快速开始
```js
ddAuthLogin.login({
  debug: true,
  success: function(res) {
  console.log('免登成功啦啦啦', res)
  },
  fail: function(err) {
  console.log('啊哦，免登失败', err)
  }
})
```


## :bookmark_tabs: AIP文档

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
| ----- | --- | ---- | ----- | --- |
| debug | boolean | 否 | false | 是否开启 debug 模式 |
| getSignUrl | string | 否 | '/data/labc-biz-dingding/dingTalk/getAuthInfo' | 请求签名地址 |
| ssoUrl | string | 否 | '/data/labc-biz-dingding/dingTalk/sso' | 请求sso地址 |
| success | function | 否 | 空 | 成功回调 |
| fail | function | 否 | 空 | 失败回调 |
| jsApiList | array | 否 | 所有钉钉 API | 要签名的功能列表 |


## :bulb: 谁在使用

- Landray

## 相关链接

- [钉钉开放平台](https://open-doc.dingtalk.com/)