import React, { Component, RefObject } from "react"
import { Link } from "react-router-dom"
import { Nav, NavDropdown, Navbar, Container, Dropdown } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconPrefix, IconName } from "@fortawesome/fontawesome-svg-core";
import { Affix } from "rsuite";

import Layout, { Navigation, NavigationItem, NavigationSet, LayoutContext } from "../layout"

export interface ComponentNavbarState {
	scrollPos: number
}

export default class ComponentNavbar extends Component<any, ComponentNavbarState> {
	readonly id: string;
	readonly navbarRef: RefObject<HTMLDivElement>;
	
	constructor(props: any) {
		super(props);
		this.id = Date.now().toString()
		this.state = {
			scrollPos: window.scrollY
		}
		this.navbarRef = React.createRef<HTMLDivElement>();
	}
	
	public componentDidMount() {
		window.addEventListener("scroll", () => this.setState({scrollPos: window.scrollY}))
	}
	
	static fontFromNavigation(navigation: Navigation) {
		if (navigation.icon === undefined) {
			return <React.Fragment/>
		}
		return <FontAwesomeIcon className="icon-navbar icon-text-left" icon={[navigation.iconLibrary !== undefined ? navigation.iconLibrary as IconPrefix: "fas", navigation.icon as IconName]}/>
	}
	
	private getNavbarHeight() : number {
		return this.navbarRef.current ? this.navbarRef.current.offsetHeight : 0
	}
	
	private getNavbarScrollStatus(): boolean {
		return this.state.scrollPos <= this.getNavbarHeight()
	}
	
	render() {
		return (<React.Fragment>
			<LayoutContext.Consumer>{({layout, setLayout}) => (
				<Affix>
					<Navbar collapseOnSelect expand="md" bg={layout.theme} variant={layout.theme} ref={this.navbarRef}>
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
												return (<Dropdown key={index.toString()} as={Nav.Item}>
													<Dropdown.Toggle as={Nav.Link}><React.Fragment>{icon}{navigationSet.label}</React.Fragment></Dropdown.Toggle>
													<Dropdown.Menu variant={layout.theme}>
													{
														navigationSet.items.map(function (subNavigationItem: NavigationItem, subIndex: number) {
															let subIcon = ComponentNavbar.fontFromNavigation(subNavigationItem)
															return (<NavDropdown.Item key={index.toString() + "-" + subIndex.toString()} as="li"><Nav.Link as={Link} to={subNavigationItem.path} href={subNavigationItem.path}>{subIcon}{subNavigationItem.label}</Nav.Link></NavDropdown.Item>)
														})
													}
													
													</Dropdown.Menu>
												</Dropdown>)
											}
											return <React.Fragment/>
										})
									}
								</Nav>
							</Navbar.Collapse>
						</Container>
					</Navbar>
				</Affix>
			)}</LayoutContext.Consumer>
		</React.Fragment>)
	}
}
