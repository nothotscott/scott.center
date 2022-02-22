import React, { Component } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";

import projects from "../resources/projects.json"
import Title from "./title";

const defaultLinkText = "Learn More"

export interface Project {
	title: string
	description: string
	image?: string
	link?: string
	linkText?: string
}

export interface ProjectProps {
	project: Project
}
export class ProjectComponent extends Component<ProjectProps> {
	constructor(props: ProjectProps) {
		super(props)
	}
	
	render() {
		return (<Card className="mt-4">
			<Card.Body>
				<Card.Title>{this.props.project.title}</Card.Title>
				{/* TODO images, probably with lazy loading and states :( project.image !== undefined ? <Card.Img variant="top" src={require("../assets/VisualOS_256x256_White.png").default}/> : <React.Fragment /> */}
				<Card.Text>{this.props.project.description}</Card.Text>
				{this.props.project.link !== undefined ? <Button variant="primary" href={this.props.project.link}>{this.props.project.linkText !== undefined ? this.props.project.linkText : defaultLinkText}</Button> : <React.Fragment />}
			</Card.Body>
		</Card>)
	}
}

export default class Projects extends Component {
	constructor(props: any) {
		super(props)
	}
	
	render() {
		return (<React.Fragment>
			<Title title="Projects" subtitle="A list of official scott.center projects" />
			<Row xs="1" sm="2" xl="2">
			{
				projects.map(function (project: Project, index) {
					return <Col key={index}><ProjectComponent key={index} project={project}/></Col>
				})
			}
			</Row>
		</React.Fragment>)
	}
}
