import "axios";
import type { ApiRequestMeta } from "@/api/requestPolicy";

declare module "axios" {
  interface AxiosRequestConfig<D = unknown> {
    appMeta?: ApiRequestMeta;
    _retry?: boolean;
  }

  interface InternalAxiosRequestConfig<D = unknown> {
    appMeta?: ApiRequestMeta;
    _retry?: boolean;
  }
}
