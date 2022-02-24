import React, { Component } from "react";

export interface GithubUser {
	username?: string
}

export interface GithubProfileContext {

}

export interface GithubProfileState {

}

export const GithubProfileContext = React.createContext<GithubProfileContext>({  });

export class GithubProfileProvider extends Component<any, GithubProfileState> {
	constructor(props: any) {
		super(props);
	}
	
	setProfile = (user: GithubUser) => {
	
	}
	
	/*render() {
		return (<GithubProfileContext.Provider>
			{this.props.children}
		</GithubProfileContext.Provider>)
	}*/
}
