import React, { Component } from "react";
import { Helmet } from "react-helmet"

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
			<Helmet>
				<title>s.c - {this.props.title}</title>
			</Helmet>
			<div className="container-fluid bg-light text-dark p-5 mb-3">
				<h1 className="display-4">{this.props.title}</h1>
				{this.props.subtitle !== undefined ? <p className="lead">{this.props.subtitle}</p> : <React.Fragment/>}
			</div>
			{this.props.children}
		</React.Fragment>)
	}
}
