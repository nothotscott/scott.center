import React, { Component } from "react"
import { Link } from "react-router-dom"
import { Nav, NavDropdown, Navbar, Container } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconPrefix, IconName } from "@fortawesome/fontawesome-svg-core";

import Layout, { Navigation, NavigationItem, NavigationSet, LayoutContext } from "../layout"


export default class ComponentNavbar extends Component {
	readonly id: string;
	
	constructor(props: any) {
		super(props);
		this.id = Date.now().toString()
	}
	
	static fontFromNavigation(navigation: Navigation) {
		if (navigation.icon === undefined) {
			return <React.Fragment/>
		}
		return <FontAwesomeIcon className="icon-navbar icon-text-left" icon={[navigation.iconLibrary !== undefined ? navigation.iconLibrary as IconPrefix: "fas", navigation.icon as IconName]}/>
	}
	
	render() {
		return (<React.Fragment>
			<LayoutContext.Consumer>{({ layout, setLayout }) => (
				<Navbar collapseOnSelect expand="md" bg={layout.theme} variant={layout.theme}>
					<Container fluid>
						<Navbar.Brand href="/">s.c</Navbar.Brand>
						<Navbar.Toggle aria-controls={"component-navbar-" + this.id}/>
						<Navbar.Collapse id={"component-navbar-" + this.id}>
							<Nav className="mr-auto">
								{
									Layout.getNavigationsFromProfiles(layout.profiles).map(function (navigation: Navigation, index: number) {
										let icon = ComponentNavbar.fontFromNavigation(navigation)
										if ((navigation as NavigationItem).path !== undefined) {
											let navigationItem = navigation as NavigationItem
											if (navigationItem.path.startsWith("http")) {
												return (<Nav.Item key={index.toString()}><Nav.Link href={navigationItem.path}>{icon}{navigationItem.label}</Nav.Link></Nav.Item>)
											}
											return (<Nav.Item key={index.toString()}><Nav.Link as={Link} to={navigationItem.path} href={navigationItem.path}>{icon}{navigationItem.label}</Nav.Link></Nav.Item>)
										}
										if ((navigation as NavigationSet).items !== undefined) {
											let navigationSet = navigation as NavigationSet
											return (<NavDropdown key={index.toString()} title={<React.Fragment>{icon}{navigationSet.label}</React.Fragment>}>
												{
													navigationSet.items.map(function (subNavigationItem: NavigationItem, subIndex: number) {
														let subIcon = ComponentNavbar.fontFromNavigation(subNavigationItem)
														return (<NavDropdown.Item key={index.toString() + "-" + subIndex.toString()} as="li"><Nav.Link as={Link} to={subNavigationItem.path} href={subNavigationItem.path}>{subIcon}{subNavigationItem.label}</Nav.Link></NavDropdown.Item>)
													})
												}
											</NavDropdown>)
										}
										return <React.Fragment/>
									})
								}
							</Nav>
						</Navbar.Collapse>
					</Container>
				</Navbar>
				)}</LayoutContext.Consumer>
		</React.Fragment>)
	}
}
