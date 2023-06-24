import qs from "qs";
import { admin_app_api_base_url } from "./admin/config";


function request<T>(url: string, options: any) {
    return new Promise<T>((resolve, reject) => {
        // uni-request
        const token = uni.getStorageSync("token")?.token;
        if (url != `${admin_app_api_base_url}/api/Auth/login`){
            if (!token) {
				uni.showToast({
					title: "登录过期请重新登录!",
					icon: "none",
				});
				uni.redirectTo({
					url: "/pages/login",
				});
			}
        }	
        const params = qs.stringify(options.params);
		if (params !== "") {
			url = url + "?" + params;
		}
        uni.request({
			url: url,
			method: options.method,
			data: options.data,
			header: { ...options.headers, Authorization: "Bearer " + token },
			success: (res) => {
				resolve(res.data as T);
			},
			fail: (err) => {
				reject(err);
			},
		});
    });
}

export default request;
