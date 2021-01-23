import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
import cookie from "react-cookies";

import Rest from "./rest";
import { Redirect } from "react-router";
import { LayoutContextType} from "../layout";

const defaultCookieAge = 3600 * 24 * 7;

export interface Account {
	account_id?: number
	username?: string
	register_date?: string
}
export interface AccountLogin extends Account {
	token?: string
}

export const accountLoginDefault: AccountLogin = {
}

export type AccountLoginContextType = { account: AccountLogin; setAccount?: (account: AccountLogin) => void, cookieAge: number }
export const AccountContext = React.createContext<AccountLoginContextType>({ account: accountLoginDefault, cookieAge: defaultCookieAge });

export interface AccountProviderState {
	account: AccountLogin
	cookieAge: number,
	retrievalAttempted: boolean;
}

export class AccountProvider extends Component<LayoutContextType, AccountProviderState> {
	constructor(props: any) {
		super(props);
		this.state = {
			account: accountLoginDefault,
			cookieAge: defaultCookieAge,
			retrievalAttempted: false
		}
	}
	
	componentDidMount() {
		AccountLibrary.fromCookie().then(this.setAccount)
	}
	
	setAccount = (account: AccountLogin | undefined) => {
		if (account === undefined) {
			this.setState({retrievalAttempted: true})
			if (this.props.setLayout !== undefined) {
				this.props.setLayout({
					profiles: new Array<string>("default", "loggedOut"),
					theme: this.props.layout.theme
				})
			}
			return
		}
		if (this.props.setLayout !== undefined) {
			this.props.setLayout({
				profiles: new Array<string>("default", "loggedIn"),
				theme: this.props.layout.theme
			})
		}
		this.setState({
			account: account,
			retrievalAttempted: true
		})
	};
	
	render() {
		if (this.state.retrievalAttempted === false) {
			return (<div className="frame-center">
				<Spinner animation="border" className="spinner-big" />
			</div>)
		}
		const {account, cookieAge} = this.state;
		const {setAccount} = this;
		return (<AccountContext.Provider value={{ account, setAccount, cookieAge }}>
			{this.props.children}
		</AccountContext.Provider>)
	}
}


export class AccountLibrary {
	static accountIsUndefined(account: Account | undefined) : boolean{
		return account === undefined || account.account_id === undefined || account.account_id === 0;
	}
	
	static async fromToken(token: string) {
		return Rest.request("get_account.php", {token: token}).then(responseJson => {
			if (responseJson.error === undefined) {
				return undefined;
			}
			let accountLogin: AccountLogin = responseJson.result;
			return accountLogin;
		});
	}
	
	static async fromCookie() {
		const token = cookie.load("token");
		if (token === undefined) {
			return;
		}
		return AccountLibrary.fromToken(token).then(account => {
			if (AccountLibrary.accountIsUndefined(account)) {
				AccountLibrary.clearTokenCookie()
			}
			return account
		})
	}
	
	static clearTokenCookie() {
		cookie.remove("token");
	}
	
	static setTokenCookie(token: string, cookieAge: number) {
		cookie.save("token", token, { path: "/", maxAge: cookieAge })
	}
}


export default class AccountEnforcer extends Component {
	public static contextType = AccountContext;
	public context!: React.ContextType<typeof AccountContext>;
	
	constructor(props: any) {
		super(props)
	}
	
	render() {
		const {account} = this.context
		if (AccountLibrary.accountIsUndefined(account)) {
			return <Redirect to="/login"/>
		}
		return (<React.Fragment>
			{this.props.children}
		</React.Fragment>)
	}
}

