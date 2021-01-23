import QueryString from "query-string"


export interface RestResponse {
	error: string | null
	result: any
}

export default class Rest {
	static readonly baseUrl = "http://api.scott.center"
	private props: any
	
	constructor(props: any) {
		this.props = props
	}
	
	static async request(target: string, getData: object | undefined, postData: object | undefined = undefined) {
		return new Promise<RestResponse>((resolve: (value: RestResponse | PromiseLike<RestResponse>) => void, reject: (error: any) => void) => {
			let headers: RequestInit = {
				method: postData === undefined ? "GET" : "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			};
			if (postData) {
				headers.body = QueryString.stringify(postData as Record<string, any>)
			}
			let resource = target;
			if (getData !== undefined) {
				resource += "?" + QueryString.stringify(getData);
			}
			fetch([this.baseUrl, resource].join("/"), headers)
			.then((response: Response) => response.json())
			.then((responseJson) => {
				resolve(responseJson)
			})
			.catch((error) => {
				reject(error)
			})
		})
	}
}
