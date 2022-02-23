import React, { Component } from "react"
import { Form, Button, Alert, InputGroup, FormControl, Row, Col } from "react-bootstrap"
import * as yup from "yup";
import { Formik, FormikHelpers, FormikProps } from "formik";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Rest from "../api/rest";
import Title from "./title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface ShortenerState {
	error: string | null
	showError: boolean
	returnSlug: string | null
	returnTarget: string | null
	slugSnapshotRequest?: string
}

export interface ShortenerFormValues {
	slug: string
	target: string
	key: string
	action: string
}

export default class Shortener extends Component<any, ShortenerState> {
	readonly schema: any;
	readonly initialValues: ShortenerFormValues;
	
	constructor(props: any) {
		super(props)
		this.state = {
			error: null,
			showError: false,
			returnSlug: null,
			returnTarget: null
		}
		this.schema = yup.object({
			slug: yup.string().required("Slug required"),
			target: yup.string().url("Must be a valid URL").required("Target URL required")
		})
		this.initialValues = {
			slug: "",
			key: "demo",
			action: "add",
			target: ""
		}
	}
	
	handleSubmit = async (values: ShortenerFormValues, actions: FormikHelpers<ShortenerFormValues>) => {
		Rest.request(values.slug, undefined, values, "https://ma.day").then(responseJson => {
			this.setState({error: responseJson.error, showError: true})
			if (!responseJson.error) {
				this.setState({returnSlug: responseJson.result.slug, returnTarget: responseJson.result.target, slugSnapshotRequest: values.slug})
			}
		})
	}
	
	render() {
		return (<React.Fragment>
			<Title title="URL Shortener" subtitle="Create memorable URLs"/>
			<Formik validationSchema={this.schema} initialValues={this.initialValues} onSubmit={this.handleSubmit}>{(props: FormikProps<ShortenerFormValues>) => {
				const {values, touched, errors, handleChange, isSubmitting, handleSubmit, isValid} = props;
				return (<React.Fragment>
					{this.state.error && this.state.showError &&
					<Alert variant="danger" dismissible onClose={() => this.setState({showError: false})}>{this.state.error}</Alert>
					}
					<Form noValidate onSubmit={handleSubmit} autoComplete="off">
						<Form.Group controlId="slug" as={Row}>
							<Form.Label column md="2">Slug</Form.Label>
							<InputGroup hasValidation as={Col}>
								<InputGroup.Text id="slug">https://ma.day/</InputGroup.Text>
								<FormControl name="slug" type="text" placeholder="pick-something-memorable" value={values.slug} onChange={handleChange} isValid={touched.slug && !errors.slug} isInvalid={errors.slug !== undefined}/>
								<FormControl.Feedback type="invalid">{errors.slug}</FormControl.Feedback>
							</InputGroup>
						</Form.Group>
						<Form.Group controlId="target" as={Row}>
							<Form.Label column md="2">Target</Form.Label>
							<Col>
								<FormControl name="target" type="url" placeholder="https://www.google.com/" value={values.target} onChange={handleChange} isValid={touched.target && !errors.target} isInvalid={errors.target !== undefined}/>
								<FormControl.Feedback type="invalid">{errors.target}</FormControl.Feedback>
							</Col>
						</Form.Group>
						<Form.Group controlId="key" as={Row}>
							<Form.Label column md="2">Key</Form.Label>
							<Col>
								<FormControl name="key" type="text" placeholder="demo" value={values.key} onChange={handleChange} isValid={touched.key && !errors.key} isInvalid={errors.key !== undefined}/>
								<FormControl.Feedback type="invalid">{errors.target}</FormControl.Feedback>
							</Col>
						</Form.Group>
						<Button variant="primary" type="submit" disabled={isSubmitting || !isValid}><FontAwesomeIcon className="icon-text-left" icon="file-zipper"/>Shorten</Button>
					</Form>
					{values.slug &&
					<InputGroup>
						<CopyToClipboard text={"https://ma.day/" + values.slug}>
							<Button variant={values.slug === this.state.slugSnapshotRequest ? "outline-success" : "outline-dark"} disabled={isSubmitting}>
								<FontAwesomeIcon icon={["far", "clipboard"]}/>
							</Button>
						</CopyToClipboard>
						<FormControl readOnly value={"https://ma.day/" + values.slug}/>
					</InputGroup>
					}
					</React.Fragment>)
			}}</Formik>
		</React.Fragment>)
	}
}
