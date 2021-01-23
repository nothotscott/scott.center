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
	
	getRouterSwitch(layout) {
		return (<React.Fragment>
			<Suspense fallback={<div className="d-flex justify-content-center"><Spinner animation="grow"/></div>}>
				<Switch>
					{
						Array.from(navigations).map(function (navigation, index) {
							let component = components[navigation["label"]]
							return <Route exact={navigation["path"] === "/" ? true : false} key={index} path={navigation["path"]} component={component} />
						})
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
							<React.Fragment>{this.getRouterSwitch(layout)}</React.Fragment>
						</AccountProvider>
					)}</LayoutContext.Consumer>
				</LayoutProvider>
			</Router>
		</React.Fragment>)
	}
}
