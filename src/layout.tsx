import React, { Component } from "react"
import { Container } from "react-bootstrap"

import ComponentNavbar from "./components/navbar";

import navigations from "./resources/navigations.json"


export type Navigations = keyof typeof navigations
export interface Navigation {
	label: string
	path: string
	icon: string | undefined
	navbar?: Array<string>
}

export interface Layout {
	theme: "light" | "dark"
	profiles: Array<string>
}
export const layoutDefault: Layout = {
	theme: "light",
	profiles: new Array("default", "loggedOut")
}

export type LayoutContextType = { layout: Layout; setLayout?: (layout: Layout) => void }
export const LayoutContext = React.createContext<LayoutContextType>({ layout: layoutDefault });

export interface LayoutProviderState {
	layout: Layout
}

export default class LayoutProvider extends Component<{}, LayoutProviderState> {
	constructor(props: any) {
		super(props);
		this.state = {
			layout: layoutDefault
		}
	}
	
	static getNavigationsFromProfiles(profiles: Array<string>) {
		let navigable: Navigation[] = [];
		Array.from(navigations).forEach(function (navigation, index) {
			if (navigation.navbar !== undefined) {
				let doBreak = false;
				Array.from(profiles).forEach(function (profile) {
					if (navigation.navbar.includes(profile)) {
						if (doBreak) {
							return;
						}
						navigable.push(navigation);
						doBreak = true;
					}
				});
			}
		});
		return navigable
	}
	
	static getSystemTheme() : "light" | "dark" {
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		return prefersDark ? "dark" : "light"
	}
	
	setLayout = (layout: Layout) => {
		this.setState({
			layout: layout
		})
	}
	
	render() {
		const { layout } = this.state;
		const { setLayout } = this;
		return (<LayoutContext.Provider value={{ layout: layout, setLayout: setLayout }}>
			<ComponentNavbar {...this.props}></ComponentNavbar>
			<br/>
			<Container>
				{this.props.children}
			</Container>
		</LayoutContext.Provider>)
	}
}
