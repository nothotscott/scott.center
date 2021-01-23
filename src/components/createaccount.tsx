import React, { Component } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { Redirect } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as yup from "yup";
import { Formik, FormikProps, FormikHelpers } from "formik"

import Rest from "../api/rest"

export interface CreateAccountFormValues {
	username: string
	password: string
	passwordConfirm: string
}

export interface CreateAccountState {
	redirect?: string
	error?: string | null
}

export default class CreateAccount extends Component<any, CreateAccountState> {
	readonly schema: any;
	readonly initialValues: CreateAccountFormValues;
	
	constructor(props: any) {
		super(props);
		this.state = {
			redirect: undefined,
			error: undefined
		};
		this.schema = yup.object({
			username: yup.string().required("Username required").min(3, "Must be at least 3 characters long").max(20, "Cannot be more than 20 characters long"),
			password: yup.string().required("Password required").min(3, "Must be at least 3 characters long"),
			passwordConfirm: yup.string().required("Password confirmation required").oneOf([yup.ref("password"), null], "Passwords must match")
		});
		this.initialValues = {
			username: "",
			password: "",
			passwordConfirm: ""
		}
	}
	
	handleSubmit = async (values: CreateAccountFormValues, actions: FormikHelpers<CreateAccountFormValues>) => {
		Rest.request("create_account.php", undefined, values).then(resultJSON => {
			this.setState({error: resultJSON.error})
			console.log(resultJSON)
			if (!resultJSON.error) {
			
			}
			actions.setSubmitting(false)
		})
		//this.setState({ redirect: "/me" })
	}
	
	render() {
		if (this.state.redirect !== undefined) {
			return <Redirect to={this.state.redirect}/>
		}
		return (<React.Fragment>
			{this.state.error &&
			<Alert variant="danger">{this.state.error}</Alert>
			}
			<Formik validationSchema={this.schema} initialValues={this.initialValues} onSubmit={this.handleSubmit}>{(props: FormikProps<CreateAccountFormValues>) => {
				const { values, touched, errors, handleChange, isSubmitting, handleSubmit, isValid } = props;
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
						<Form.Group controlId="passwordConfirm">
							<Form.Control name="passwordConfirm" type="password" required placeholder="Confirm Password" value={values.passwordConfirm} onChange={handleChange} isValid={touched.username && !errors.passwordConfirm} isInvalid={errors.passwordConfirm !== undefined}/>
							<Form.Control.Feedback type="invalid">{errors.passwordConfirm}</Form.Control.Feedback>
						</Form.Group>
						<Button variant="primary" type="submit" disabled={isSubmitting || !isValid}><FontAwesomeIcon className="icon-text-left" icon="user-plus"/>Create Account</Button>
					</Form>
				)
			}}</Formik>
		</React.Fragment>)
	}
}
