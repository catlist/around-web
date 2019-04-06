import React from 'react';
import { Link } from 'react-router-dom';

import {
    Form, Input, Button, message
} from 'antd';
import { API_ROOT } from '../constants';

class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
            // Fire api call
            fetch(`${API_ROOT}/signup`, {
                method: 'POST',
                body: JSON.stringify({
                    username: values.username,
                    password: values.password
                })
            })
                .then((response) => {
                    if (response.ok) {
                        return response;
                    }
                    throw new Error(response.statusText);
                })
                .then(() => {
                    message.info("Registeration suceeded!")
                    this.props.history.push("/login");
                })
                .catch((err) => {
                    message.error("Registeration Failed!");
                    console.log(err);
                })
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className='register'>
                <Form.Item label="Username">
                    {getFieldDecorator('username', {
                        rules: [{
                            required: true, message: 'Please input your username!',
                        }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="Password">
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: 'Please input your password!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password" />
                    )}
                </Form.Item>
                <Form.Item label="Confirm Password">
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: 'Please confirm your password!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">Register</Button>
                    <p>Alread registered? <Link to="/login">Back to login</Link></p>
                </Form.Item>
            </Form>
        );
    }
}

export const Register = Form.create({ name: 'register' })(RegistrationForm);
