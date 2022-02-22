import React, { Component } from "react"
import { Link } from "react-router-dom"
import { Nav, Navbar } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconPrefix, IconName } from "@fortawesome/fontawesome-svg-core";

import Layout, { Navigation, LayoutContext } from "../layout"


export default class ComponentNavbar extends Component {
	readonly id: string;
	
	constructor(props: any) {
		super(props);
		this.id = Date.now().toString()
	}
	
	render() {
		return (<React.Fragment>
			<LayoutContext.Consumer>{({ layout, setLayout }) => (
				<Navbar collapseOnSelect expand="sm" bg={layout.theme} variant={layout.theme}>
					<Navbar.Brand href="/">s.c</Navbar.Brand>
					<Navbar.Toggle aria-controls={"component-navbar-" + this.id}/>
					<Navbar.Collapse id={"component-navbar-" + this.id}>
						<Nav className="mr-auto">
							{
								Layout.getNavigationsFromProfiles(layout.profiles).map(function (navigation: Navigation, index: number) {
									let icon = <React.Fragment/>
									if (navigation.icon !== undefined) {
										icon = <FontAwesomeIcon className="icon-navbar icon-text-left" icon={[navigation.iconLibrary !== undefined ? navigation.iconLibrary as IconPrefix: "fas", navigation.icon as IconName]}/>
									}
									if (navigation.path.startsWith("http")) {
										return (<Nav.Item key={index.toString()}><Nav.Link href={navigation.path}>{icon}{navigation.label}</Nav.Link></Nav.Item>)
									}
									return (<Nav.Item key={index.toString()}><Nav.Link as={Link} to={navigation.path} href={navigation.path}>{icon}{navigation.label}</Nav.Link></Nav.Item>)
								})
							}
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				)}</LayoutContext.Consumer>
		</React.Fragment>)
	}
}
