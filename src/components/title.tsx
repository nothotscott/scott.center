import React, { Component } from "react";
import { Jumbotron } from "react-bootstrap";

export interface TitleProps {
	title: string
	subtitle?: string
}

export default class Title extends Component<TitleProps> {
	constructor(props: any) {
		super(props)
	}
	
	render() {
		return (<React.Fragment>
			<Jumbotron>
				<h1 className="display-4">{this.props.title}</h1>
				{this.props.subtitle !== undefined ? <p className="lead">{this.props.subtitle}</p> : <React.Fragment/>}
			</Jumbotron>
			{this.props.children}
		</React.Fragment>)
	}
}
