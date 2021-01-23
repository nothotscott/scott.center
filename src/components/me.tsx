import React, { Component } from "react"

import AccountEnforcer, { AccountContext } from "../api/account";

export default class Me extends Component {
	public static contextType = AccountContext;
	public context!: React.ContextType<typeof AccountContext>;
	
	constructor(props: any) {
		super(props)
	}
	
	render() {
		const {account} = this.context;
		return (<AccountEnforcer>
			<h1>Welcome, {account.username}</h1>
		</AccountEnforcer>)
	}
}
