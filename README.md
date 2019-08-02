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

## :rocket: 快速开始
### 1. 引入钉钉JSAPI

如果你是浏览器环境

```html
<script src="https://g.alicdn.com/dingding/dingtalk-jsapi/2.7.13/dingtalk.open.js"></script>
```


如果你是webpack等环境

```shell
npm install dingtalk-jsapi --save
```

```typescript
import * as dd from 'dingtalk-jsapi'; // 此方式为整体加载，也可按需进行加载
```



### 2. 引入本库

如果你是浏览器环境

```html
<script src="./dist/dd-auth-login.min.js"></script>
```


如果你是webpack等环境
```shell
npm install dd-auth-login --save
```


```js
import ddAuthLogin from 'dd-auth-login'
```

如果你是requirejs环境

```js
requirejs(['./dist/dd-auth-login.min.js'], function (res) {
    // xxx
})
```

### 3. 调用本库

```js
ddAuthLogin.login({
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
| signUrl | string | 否 | '/data/labc-biz-dingding/dingTalk/getAuthInfo' | 请求签名地址 |
| signParamName | string | 否 | 'url' | 请求签名参数名称 |
| ssoUrl | string | 否 | '/data/labc-biz-dingding/dingTalk/sso' | 请求sso地址 |
| ssoParamName | string | 否 | 'authCode' | 请求sso参数名称 |
| jsApiList | array | 否 | 所有钉钉 API | 要签名的功能列表 |
| success | function | 否 | 空 | 成功回调 |
| fail | function | 否 | 空 | 失败回调 |


## :loudspeaker: 接口说明(给后端同学看)
#### signUrl接口
请求类型: GET
传入参数: url = 'xxxxx(当前页面url)'
返回数据:

```js
{
  content: {
    agentId: '微应用ID',
    corpId: '企业ID',
    timeStamp: '生成签名的时间戳',
    nonceStr: '生成签名的随机串',
    signature: '签名',
    hasLogin: '如果已经登录，则返回true，此时不会调用sso'
  },
  message: '接口调用成功',
  code: 200
}
```

#### ssoUrl接口
请求类型: GET
传入参数: authCode = 'xxxx(从dd.runtime.permission.requestAuthCode得到的code)'
返回数据如下:

```js
{
  content: {},
  message: '接口调用成功',
  code: 200
}
```


## :couple: 谁在使用

- [Landray](http://www.landray.com.cn)


## :see_no_evil: 相关链接

- [Github Pages](https://leochan2017.github.io/dd-auth-login/)
- [仓库地址](https://github.com/leochan2017/dd-auth-login)
- [NPM主页](https://www.npmjs.com/package/dd-auth-login)
- [钉钉开放平台](https://open-doc.dingtalk.com/)
