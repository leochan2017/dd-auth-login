# [dd-auth-login](https://github.com/leochan2017/dd-auth-login)

![By Leo](https://img.shields.io/badge/Powered_by-Leo-red.svg?style=flat) 
![npm](https://img.shields.io/npm/dt/dd-auth-login)
![GitHub file size in bytes](https://img.shields.io/github/size/leochan2017/dd-auth-login/dist/dd-auth-login.min.js)
![GitHub last commit](https://img.shields.io/github/last-commit/leochan2017/dd-auth-login.svg)
![GitHub package.json version](https://img.shields.io/github/package-json/v/leochan2017/dd-auth-login)
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

1.1如果你是浏览器环境

```html
<script src="https://g.alicdn.com/dingding/dingtalk-jsapi/2.7.13/dingtalk.open.js"></script>
```

1.2如果你是webpack等环境

```shell
npm install dingtalk-jsapi --save
```

```typescript
import * as dd from 'dingtalk-jsapi'; // 此方式为整体加载，也可按需进行加载
```



### 2. 引入本库

2.1如果你是浏览器环境

```html
<script src="./dist/dd-auth-login.min.js"></script>
```

2.2如果你是webpack等环境

```shell
npm install dd-auth-login --save
```
或者
```shell
yarn add dd-auth-login
```
然后
```js
import ddAuthLogin from 'dd-auth-login'
```

2.3如果你是requirejs环境

```js
requirejs(['./dist/dd-auth-login.min.js'], function (res) {
    // xxx
})
```

### 3. 调用 login 函数进行签名&免登

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
### ddAuthLogin.isDD()
返回当前是否钉钉环境; true: 是, false: 否

### ddAuthLogin.login()
签名&免登过程

#### 传入参数
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

#### 返回参数
| 参数名 | 类型 | 说明 |
| ----- | --- | --- |
| isDD | boolean | 当前是否钉钉环境 |
| isLogin | boolean | 当前是否免登成功 |
| msg | string | 对本次返回进行文字描述 |
| content | object | 失败时的详细信息（仅在失败时返回） |
|  |  |  |


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
- [yarn主页](https://yarn.pm/dd-auth-login)
- [钉钉开放平台](https://open-doc.dingtalk.com/)
