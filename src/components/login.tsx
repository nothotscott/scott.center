import React, { Component } from "react"
import { Form, Button, Alert } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Redirect } from "react-router";
import * as yup from "yup";
import { Formik, FormikHelpers, FormikProps } from "formik";

import Rest from "../api/rest";
import { AccountLibrary, AccountContext, AccountLogin } from "../api/account";


export interface LoginFormValues {
	username: string
	password: string
}

export interface LoginState {
	redirect?: string
	error?: string | null
}

export default class Login extends Component<any, LoginState> {
	static contextType = AccountContext;
	context!: React.ContextType<typeof AccountContext>

	readonly schema: any;
	readonly initialValues: LoginFormValues;
	
	constructor(props: any) {
		super(props);
		this.state = {
			redirect: undefined,
			error: undefined
		};
		this.schema = yup.object({
			username: yup.string().required("Username required"),
			password: yup.string().required("Password required")
		});
		this.initialValues = {
			username: "",
			password: "",
		};
	}
	
	handleSubmit = async (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {
		Rest.request("login_account.php", undefined, values).then(responseJson => {
			this.setState({error: responseJson.error});
			actions.setSubmitting(false);
			if (!responseJson.error) {
				const accountLogin: AccountLogin = responseJson.result;
				const {setAccount} = this.context;
				const {cookieAge} = this.context;
				AccountLibrary.setTokenCookie(accountLogin.token as string, cookieAge);
				if (setAccount !== undefined) {
					setAccount(accountLogin);
				}
				this.setState({redirect: "/me"})
				// NOTE do not alter state past this point
			}
		})
	};
	
	render() {
		if (this.state.redirect !== undefined) {
			return <Redirect push to={this.state.redirect}/>
		}
		return (<React.Fragment>
			{this.state.error &&
			<Alert variant="danger">{this.state.error}</Alert>
			}
			<Formik validationSchema={this.schema} initialValues={this.initialValues} onSubmit={this.handleSubmit}>{(props: FormikProps<LoginFormValues>) => {
				const {values, touched, errors, handleChange, isSubmitting, handleSubmit, isValid} = props;
				return (
					<Form noValidate onSubmit={handleSubmit}>
						<Form.Group controlId="username">
							<Form.Control name="username" type="text" placeholder="Username" value={values.username} onChange={handleChange} isValid={touched.username && !errors.username} isInvalid={errors.username !== undefined}/>
							<Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
						</Form.Group>
						<Form.Group controlId="password">
							<Form.Control name="password" type="password" placeholder="Password" value={values.password} onChange={handleChange} isValid={touched.username && !errors.password} isInvalid={errors.password !== undefined}/>
							<Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
						</Form.Group>
						<Button variant="primary" type="submit" disabled={isSubmitting || !isValid}><FontAwesomeIcon className="icon-text-left" icon="user"/>Login</Button>
					</Form>
				)
			}}</Formik>
		</React.Fragment>)
	}
}

