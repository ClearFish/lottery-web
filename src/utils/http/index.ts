import Axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig
} from "axios";
import { ContentTypeEnum, ResultEnum } from "@/enums/requestEnum";
import NProgress from "../progress";
import { showFailToast } from "vant";
import "vant/es/toast/style";
import { $t, $locale } from '@/locales';

// 默认 axios 实例请求配置
const configDefault = {
  headers: {
    "Content-Type": ContentTypeEnum.JSON
  },
  timeout: 10000,
  baseURL: import.meta.env.VITE_BASE_API,
  data: {}
};

class Http {
  // 当前实例
  private static axiosInstance: AxiosInstance;
  // 请求配置
  private static axiosConfigDefault: AxiosRequestConfig;

  // 请求拦截
  private httpInterceptorsRequest(): void {
    Http.axiosInstance.interceptors.request.use(
      config => {
        NProgress.start();
        // 自动添加token到请求头
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = 'Bearer ' + token;
        }
        

        if(config.url.includes('fileUpload') && config.headers['Content-Type'] !== ContentTypeEnum.FORM_URLENCODED) {
          config.headers['Content-Type'] = ContentTypeEnum.FORM_URLENCODED;
        }
        
        // 自动添加lang参数（使用i18n当前语言，确保语言切换后立即生效）
        const currentLang = $locale.value;
        
        // 不管什么请求方式，都将lang参数拼到URL后面
        config.params = {
          ...config.params,
          // lang: currentLang
        };
        
        return config;
      },
      (error: AxiosError) => {
        showFailToast(error.message);
        return Promise.reject(error);
      }
    );
  }

  // 响应拦截
  private httpInterceptorsResponse(): void {
    Http.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        NProgress.done();
        // 与后端协定的返回字段
        const { code, msg, data } = response.data;
        // 判断请求是否成功
        const isSuccess = code === ResultEnum.SUCCESS;
        console.log(response.data)
        if (isSuccess) {
          // if(data) {
          //   return data
          // }else {
          //   return response.data
          // }
          
          return response.data;
        } else {
          // 处理请求错误
          // showFailToast(message);
          return Promise.reject(response.data);
        }
      },
      (error: AxiosError) => {
        NProgress.done();
        // 处理 HTTP 网络错误
        let message = "";
        // HTTP 状态码
        const status = error.response?.status;
        switch (status) {
          case 400:
            message = $t('http.badRequest');
            break;
          case 401:
            message = $t('http.unauthorized');
            // token过期，清除本地token
            localStorage.removeItem('token');
            // 清除登录用户的IM链接缓存
            try {
              import('@/utils/im-cache').then(({ clearUserIMCache }) => {
                clearUserIMCache();
              });
            } catch (error) {
              console.error('清除IM缓存失败:', error);
            }
            // 跳转到登录页面
            if (window.location.hash !== '#/auth') {
              window.location.href = '#/auth';
            }
            break;
          case 403:
            message = $t('http.forbidden');
            break;
          case 404:
            message = `请求地址出错: ${error.response?.config?.url}`;
            break;
          case 408:
            message = $t('http.requestTimeout');
            break;
          case 500:
            message = $t('http.internalServerError');
            break;
          case 501:
            message = $t('http.notImplemented');
            break;
          case 502:
            message = $t('http.badGateway');
            break;
          case 503:
            message = $t('http.serviceUnavailable');
            break;
          case 504:
            message = $t('http.gatewayTimeout');
            break;
          case 505:
            message = "HTTP版本不受支持";
            break;
          default:
            message = $t('http.networkError');
        }

        showFailToast(message);
        return Promise.reject(error);
      }
    );
  }

  constructor(config: AxiosRequestConfig) {
    Http.axiosConfigDefault = config;
    Http.axiosInstance = Axios.create(config);
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  // 通用请求函数
  public request<T>(paramConfig: AxiosRequestConfig): Promise<T> {
    const config = { ...Http.axiosConfigDefault, ...paramConfig };
    return new Promise((resolve, reject) => {
      Http.axiosInstance
        .request(config)
        .then((response: any) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export const http = new Http(configDefault);

// 默认导出
export default http;
