import React, { Component } from "react"
import { Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
			<Row>
				<Col><a href="https://github.com/nothotscott" className="h4 text-decoration-none"><FontAwesomeIcon icon={["fab", "github"]}/> Github</a></Col>
				<Col><a href="mailto:scott@ma.day" className="h4 text-decoration-none"><FontAwesomeIcon icon={["fas", "envelope"]}/> Email</a></Col>
			</Row>
		</React.Fragment>)
	}
}
