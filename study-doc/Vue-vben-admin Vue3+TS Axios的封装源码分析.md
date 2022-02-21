Vue-vben-admin Vue3+TS Axios 的封装源码分析前言一、近期再用 Vue3+TS 重构之前 Vue2 的项目，因此想着借鉴一下业界较为优秀的代码，在 Git 上面找了好久，经过同事推荐，我发现由 anncwd 出品的 Vue-vben-admin 是很不错的，截止目前在 git 上面已经有 5.9k 个 star 了，目前将这个模板看完了，我觉得里面写的最好的莫过于对于 Axios 的封装了，在此我简单对这个源码进行一个分析，里面也涉及一些 TS+Vue3 的知识点，最重要的是，能够发现其中写的特别优秀的地方，我们也可以运用在自己的项目当中。 1.我们先来看一下源码中的目录结构吧

2.目录分析，这个文件夹当中分为 6 个文件，其中 index.ts 是入口文件，Axios 是主要的对于 axios 二次封装的类，axiosCancel 是对于取消请求类 canceler 的封装，axiosTransform.ts 是定义了一个类，涵盖所有对于数据处理无论错误还是失败的钩子函数，checkStatus.ts 是对于后端返回 code 非 200 时的处理函数，helper 是一个处理时间的函数，这 6 个文件相辅相成，构建了一个强大的 axios 的二次封装，接下来我们就来看一看其中每个文件的源码吧

二、index.ts 1.在看 index.ts 的源码之前我必须先带着大家补充几个知识点，以免其中有几个地方比较卡顿

（1）ts 中的 Partial<T>类，实际上在 ts 当中为我们提供了这样的一个类，Partial 它可以将接受一个 T 泛型，可以将 T 中的所有属性变为可选的，换句话说，任意类型的机构，经过 Partial 处理后，所有的内部属性就变为可选的了。

```TS
 interface A {
   a:string
   b:number
 }
 const a:A = {   //  error 因为A类型必须具备两个属性
   a:'张三'
 }

 const b:Partial<A> = {  // successful  经过Partial处理后，所有属性值变为可选
   a:'张三'
 }
 //看一下他的源码
 type Partial<T> = {
    [P in keyof T]?: T[P];
 };

 //其实就是给每一个属性加了一个？操作符而已，将所有属性变为非必须的了而已
```

（2）encodeURIComponent

```TS
//这个是JavaScript的原生Api ,可以把字符串作为 URI 组件进行编码。字母数字保持原来的样子，当时汉字或者其他所有符号都会将其编码为数字，字母或者%，

var uri="http://w3cschool.cc/my test.php?name=ståle&car=saab";
encodeURIComponent(uri)

// 输出：http%3A%2F%2Fw3cschool.cc%2Fmy%20test.php%3Fname%3Dst%C3%A5le%26car%3Dsaab
```

有了上面的补充，接下来就直接来看一下代码吧，我都做了注释，但是下面的代码会依赖一些类型或者函数，大家先过一下，我们主要看一下结构，开始吧

```JSX
import { AxiosTransform } from './axiosTransform'
import { AxiosResponse, AxiosRequestConfig } from 'axios'
import { Result, RequestOptions, CreateAxiosOptions } from './types'
import { errorResult } from './const'
import { ResultEnum, RequestEnum, ContentTypeEnum,} from '../../../enums/httpEnum'
import { useMessage } from '@/hooks/web/useMessage'
import { isString, isObject, isBlob } from '@/utils/is'
import { formatRequestDate } from './helper'
import { setObjToUrlParams, deepMerge } from '@/utils'
import { getToken } from '@/utils/auth'
import { checkStatus } from './checkStatus'
import VAxios from './Axios'
const { createMessage, createErrorModal } = useMessage()
/**
 * 请求处理
   */
   const transform: AxiosTransform = {   // 所谓transform 本质上就是  transform  这个对象中拥有 多个处理数据的钩子
     /**

   * 请求成功处理
   * 但依然要根据后端返回code码进行判断
     */
     transformRequestData: (  //  对后端返回的数据做处理， 这是在http状态码为200的时候
      res: AxiosResponse<Result>,
      options: RequestOptions
     ) => {
      const { isTransformRequestResult } = options
      if (!isTransformRequestResult) return res.data  // 不处理 直接返回res.data
      const { data } = res
      if (!data) return errorResult // 错误处理
      const { code, msg: message } = data
      if (code === ResultEnum.UNLOGIN) {
      const msg = '请重新登陆!'
      createMessage.error(msg)
      Promise.reject(new Error(msg))
      location.replace('/login')
      return errorResult
      }
      if (code === ResultEnum.BACKERROR) {
      const msg = '操作失败,系统异常!'
      createMessage.error(msg)
      Promise.reject(new Error(msg))
      return errorResult
      }

    const hasSuccess =
      data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS  // 200
    if (!hasSuccess) {  // 非200 非 401 非500 的情况 直接返回后端提示的错误
      if (message) {
        if (options.errorMessageMode === 'modal') {
          createErrorModal({ title: '错误提示', content: message })
        } else {
          createMessage.error(message)
        }
      }
      Promise.reject(new Error(message))
      return errorResult
    }

    if (code === ResultEnum.SUCCESS) return data  // 200 返回data

    if (code === ResultEnum.TIMEOUT) {
      const timeoutMsg = '登录超时,请重新登录!'
      createErrorModal({
        title: '操作失败',
        content: timeoutMsg,
      })
      Promise.reject(new Error(timeoutMsg))
      return errorResult
    }
    return errorResult
     },

  /*
 	* 请求发送之前的钩子 说白了，本质上这个函数就是在处理发送之前的参数  用户永远只需要传params就可以传参数了
	*/
    *   beforeRequestHook: (config: AxiosRequestConfig, options: RequestOptions) => {
    const { apiUrl, joinParamsToUrl, formatDate } = options
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }

    if (config.method?.toUpperCase() === RequestEnum.GET) {  // 对get方法做处理，避免浏览器缓存数据，导致数刷新不及时
      const now = new Date().getTime()
      if (!isString(config.params)) {
        config.params = Object.assign(config.params || {}, { _t: now })
      } else {
        config.url = config.url + '/' + encodeURIComponent(config.params)
        config.params = undefined
      }
    } else {
      // 这个是post 或者 其他的非get方式的固定写法 必须将参数放在data当中
      if (!isString(config.params)) {
        formatDate && formatRequestDate(config.params)
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, config.params)
        } else {
          config.data = config.params
        }
        config.params = undefined
      } else {
        config.url = config.url + '/' + encodeURIComponent(config.params)
        config.params = undefined
      }
    }
    return config
      },

  // 请求拦截， 添加token  没什么说的
  requestInterceptors: (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },

  // 当http状态码非200时的错误处理
  responseInterceptorsCatch: (error: any) => {
    //todo
    const { response, code, message } = error || {}
    const err: string = error.toString()
    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        createMessage.error('接口请求超时,请刷新页面重试!')
      }
      if (err && err.includes('Network Error')) {
        createErrorModal({
          title: '网络异常',
          content: '网络异常,请检查您的网络连接是否正常!',
        })
      }
    } catch (error) {
      throw new Error(error)
    }
    let msg = `服务器发生异常!`
    // 这是处理http状态码发生异常时的可能，使用服务器返回的msg提示，但状态取决于http状态码
    if (
      response &&
      response.data &&
      isObject(response.data) &&   // 假如data是个一般对象，说明可以判断
      response.data.code === ResultEnum.ERROR
    ) {
      msg = response.data.msg
      checkStatus(error.response && error.response.status, msg)
    } else if (response && response.data && isBlob(response.data)) {
      const text = new FileReader()
      text.readAsText(response.data)
      text.onload = function () {   //  本质还是解析再进行处理
        const obj = JSON.parse(text.result as string)
        msg = obj.code === ResultEnum.ERROR ? obj.msg : '服务器发生异常!'
        checkStatus(error.response && error.response.status, msg)
      }
    } else {
      // 使用默认的message提示
      checkStatus(error.response && error.response.status, msg)
    }
    return Promise.reject(error)
  },
}
function createAxios(opt?: Partial<CreateAxiosOptions>) {  // 把CreateAxiosOptions 中的每个属性变为可选的
  return new VAxios(   // 这个http会返回一个Vaxios的实例对象  在不传任何参数的情况下 默认传递以下的参数
    deepMerge(
      {
        timeout: 6 * 10 * 1000,
        headers: { 'Content-type': ContentTypeEnum.JSON },
        transform,
        requestOptions: {
          isTransformRequestResult: true, //是否转换结果
          joinParamsToUrl: false, //是否将参数添加到url
          formatDate: true, //是否格式化时间参数
          errorMessageMode: 'none', //错误消息的提示模式
          apiUrl: process.env.VUE_APP_API_URL, //api前缀
        },
      },
      opt || {}
    )
  )
}
export const http = createAxios()
```

我大概总结一下这个 index 到底做了什么

导出了一个函数的调用，实际上是导出了一个 VAxios 的实例对象，并且 默认情况下传递了一大堆的参数，参数就是这些东西

```TS
{
  timeout: 6 * 10 * 1000,
   headers: { 'Content-type': ContentTypeEnum.JSON },
   transform,
   requestOptions: {
     isTransformRequestResult: true, //是否转换结果
     joinParamsToUrl: false, //是否将参数添加到url
     formatDate: true, //是否格式化时间参数
     errorMessageMode: 'none', //错误消息的提示模式
     apiUrl: process.env.VUE_APP_API_URL, //api前缀
   },
 }
```

后面它会根据这些参数的值，来决定如何处理数据，我们最重要还是要看一下，transform 的内容，这个是重点。

tansform 这个是一个对象，里面实际上包含了多个钩子函数，请求前处理数据的 beforeRequestHook，请求拦截器 requestInterceptors 添加 token,请求成功后的 transformRequestData,也就是对于响应成功回来的时候如何返回数据，因为有的时候我们需要返回整个 response，比如下载文件的时候,有的时候只需要返回 response.data 就好了，responseInterceptorsCatch ，当 http 状态码非 200 时的错误处理 。通俗来讲，可以理解为，transform 对象中就是一堆钩子函数，用于处理数据。或者根据数据情况来做不同逻辑的操作。最终实际上这个时候我们就知道要去看看 VAxios 到底是个什么东西了，也就是最核心的文件。

一起来看一下！！！！

二、Axios.ts

```ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CreateAxiosOptions, UploadFileParams, RequestOptions, Result } from './types';
import { isFunction } from '@/utils/is';
import { ContentTypeEnum } from '../../../enums/httpEnum';
import { cloneDeep } from 'lodash-es';
import { errorResult } from './const';
import { AxiosCanceler } from './axiosCancel';
export default class VAxios {
  private axiosInstance: AxiosInstance; // axios实例本身
  private readonly options: CreateAxiosOptions; // 传递进来的 options

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors(); //  将当前实例添加响应拦截
  }

  private createAxios(config: CreateAxiosOptions): void {
    //  更新实例
    this.axiosInstance = axios.create(config);
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance;
  }

  //重新配置axios
  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) {
      return;
    }
    this.createAxios(config);
  }

  setHeader(headers: any): void {
    if (!this.axiosInstance) return;
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  private getTransform() {
    const { transform } = this.options;
    return transform;
  }
  /**

   * 拦截器配置
     */
  private setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) return;
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform;

    const axiosCanceler = new AxiosCanceler();

    //请求拦截器
    this.axiosInstance.interceptors.request.use(
      // 本项目中这里实际上是在添加token
      (config: AxiosRequestConfig) => {
        const { headers: { ignoreCancelToken } = { ignoreCancelToken: false } } = config;
        !ignoreCancelToken && axiosCanceler.addPending(config);
        if (requestInterceptors && isFunction(requestInterceptors)) {
          config = requestInterceptors(config);
        }
        return config;
      },
      undefined,
    );
    //请求拦截器错误捕获
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      // 本项目中这里其实没有任何处理
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);
    //响应拦截器
    // 本项目中没啥用
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      res && axiosCanceler.removePending(res.config);
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);
    //响应拦截器错误捕获
    // http状态码为非200时的错误捕获
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
  }
  //文件上传
  uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
    const formData = new window.FormData();
    const { useBean = true } = params;
    if (useBean && params.data) {
      formData.append('bean', JSON.stringify(params.data));
    } else if (!useBean && params.data) {
      Object.keys(params.data).forEach((key) => {
        if (!params.data) return;
        const value = params.data[key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }
        formData.append(key, params.data[key]);
      });
    }
    params.file =
      Object.prototype.toString.call(params.file) === '[object File]' ? params.file : '';
    formData.append(params.name || 'file', params.file);
    const { requestOptions } = this.options;
    if (requestOptions?.apiUrl) {
      config.url = requestOptions.apiUrl + config.url;
    }
    const opt: RequestOptions = Object.assign({}, requestOptions);
    const transform = this.getTransform();
    const { requestCatch, transformRequestData } = transform || {};
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>({
          ...config,
          data: formData,
          headers: {
            'Content-type': ContentTypeEnum.FORM_DATA,
          },
        })
        .then((res: AxiosResponse<Result>) => {
          if (transformRequestData && isFunction(transformRequestData)) {
            const ret = transformRequestData(res, opt);
            ret !== errorResult ? resolve(ret) : reject(new Error(ret));
            return;
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error) => {
          if (requestCatch && isFunction(requestCatch)) {
            reject(requestCatch(e));
            return;
          }
          reject(e);
        });
    });
  }

  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: AxiosRequestConfig = cloneDeep(config);
    const transform = this.getTransform();
    const { requestOptions } = this.options;
    const opt: RequestOptions = Object.assign({}, requestOptions, options);
    const { beforeRequestHook, requestCatch, transformRequestData } = transform || {};
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt); // conf 就是真正发送请求的url对象 || opt 就是原始对象和传递进来的对象的合集
    }
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformRequestData && isFunction(transformRequestData)) {
            const ret = transformRequestData(res, opt);
            ret !== errorResult ? resolve(ret) : reject(new Error(ret));
            return;
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error) => {
          if (requestCatch && isFunction(requestCatch)) {
            reject(requestCatch(e));
            return;
          }
          reject(e);
        });
    });
  }
}
```

我也大概来总结一下这到底做了什么事情

一句话总结，首先定义了一个类 VAxios , 这个类拥有一些私有属性，一些方法，结束。这些属性分别是 基本配置项，也就是上面我提到的那个 Options, 第二个属性就是根据这些配置项创建的 axios 实例对象，所有的请求发送，实际上都是用这个实例对象来进行发送的。有一部分方法基本不用看，比如获取当前实例，改变 options 配置，基本用不到的，也很简单，最终要就是那个 setInterceptor 方法，request 方法和 upload 方法要看一下。其中最核心的就是之前在 transform 中配置的那些方法，都会一一运用在这个 axios 发送请求的这一套流程之中。因此我们可以将其理解为扩展了一些钩子函数。三、 总结这个 axios 封装的思想我总结下来就是它暴露出去的东西是比较简单的，因此使用起来很好用，将上传都做了一个封装，而且扩展了多个钩子，这个目录结构就比较请求，维护起来也就比较清晰方便了，当然前提是要看懂，总之一起加油。
