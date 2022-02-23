import React, {Component, Suspense, lazy} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { Spinner } from "react-bootstrap";

import { AccountProvider } from "./api/account";
import LayoutProvider, { LayoutContext } from "./layout";
import loadFonts from "./fonts"
import NotFound from "./components/notfound"

import navigations from "./resources/navigations.json";
import "./App.scss"

const components = {
	"Home": lazy(() =>import("./components/home")),
	"Projects": lazy(() =>import("./components/projects")),
	"URL Shortener": lazy(() =>import("./components/shortener")),
	"Login": lazy(() =>import("./components/login")),
	"Create Account": lazy(() => import("./components/createaccount")),
	"Me": lazy(() => import("./components/me"))
}

//TODO <Helmet><title>the title</title></Helmet>

export default class App extends Component {
	constructor(props) {
		super(props)
		loadFonts()
	}
	
	static routeFromNavigation(navigation, key) {
		return (<React.Fragment key={key}>
			{
				Array.from(navigation).map(function (subNavigation, index) {
					let component = components[subNavigation["label"]]
					if (component !== undefined) {
						return <Route exact={subNavigation["path"] === "/"} key={key + "-" + index.toString()} path={subNavigation["path"]} component={component}/>
					} else if (subNavigation["items"] !== undefined) {
						return App.routeFromNavigation(subNavigation["items"], key + "-" + index.toString())
					}
				})
			}
		</React.Fragment>)
	}
	
	static getRouterSwitch() {
		return (<React.Fragment>
			<Suspense fallback={<div className="d-flex justify-content-center"><Spinner animation="grow"/></div>}>
				<Switch>
					{
						App.routeFromNavigation(navigations, "route")
					}
					<Route component={NotFound}/>
				</Switch>
			</Suspense>
		</React.Fragment>)
	}
	
	render() {
		return (<React.Fragment>
			<Router>
				<LayoutProvider>
					<LayoutContext.Consumer>{({layout, setLayout}) => (
						<AccountProvider layout={layout} setLayout={setLayout}>
							<React.Fragment>{App.getRouterSwitch()}</React.Fragment>
						</AccountProvider>
					)}</LayoutContext.Consumer>
				</LayoutProvider>
			</Router>
		</React.Fragment>)
	}
}
