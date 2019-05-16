import React from 'react';
import { Upload, Icon, Form, Input } from 'antd';

const Dragger = Upload.Dragger;

class NormUploadWindow extends React.Component {
    normFile = (e) => {
        console.log("Upload Event: ", e);
        // if (Array.isArray(e)) {
        //     console.log("is array.");
        //     return e;
        // }
        return e && e.fileList;
    };

    beforeUpload = () => false;

    render () {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const props = {
            name: 'file',
            multiple: true,
            beforeUpload: this.beforeUpload
        };

        return (
            <Form>
                <Form.Item {...formItemLayout} label='Message:'>
                    {getFieldDecorator('message', {
                        rules: [{ required: true, message: 'Please input your message!' }],
                    })(
                        <Input placeholder="Please input your message" />
                    )}
                </Form.Item>

                <Form.Item {...formItemLayout} label='Upload:'>
                    {getFieldDecorator('upload', {
                        getValueFromEvent: this.normFile,
                        rules: [{ required: true, message: 'Please upload a file!' }],
                    })(
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                        </Dragger>
                    )}
                </Form.Item>
            </Form >

        );
    }
}
export const UploadWindow = Form.create({ name: 'UploadWindow' })(NormUploadWindow);