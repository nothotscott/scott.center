import React, { Component } from "react"

import Title from "./title";
import { AccountLibrary, AccountContext } from "../api/account";


export default class Home extends Component {
	public static contextType = AccountContext;
	public context!: React.ContextType<typeof AccountContext>;
	
	constructor(props: any) {
		super(props)
	}
	
	
	render() {
		const {account} = this.context;
		return (<React.Fragment>
			<Title title="Home" subtitle={AccountLibrary.accountIsUndefined(account) ? "Welcome to Scott's official website" : "Hello " + account.username + "! Welcome back to Scott's official website"}/>
			<p>scott.center is currently under development in ReactJS.</p>
		</React.Fragment>)
	}
}
