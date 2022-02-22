import React, { Component } from "react";
import { Card } from "react-bootstrap";

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
			<Card>
				<h1 className="display-4">{this.props.title}</h1>
				{this.props.subtitle !== undefined ? <p className="lead">{this.props.subtitle}</p> : <React.Fragment/>}
			</Card>
			{this.props.children}
		</React.Fragment>)
	}
}
