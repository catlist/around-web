import React from 'react';
import { UploadWindow } from './PostForm';
import { Button, Modal, message } from 'antd';
import { POS_KEY, TOKEN_KEY, API_ROOT } from '../constants';

export class CreatePostButton extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = (e) => {
        e.preventDefault();
        this.form.validateFields((err, values) => {
            if (!err) {
                const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
                const token = localStorage.getItem(TOKEN_KEY);
                const formData = new FormData();
                formData.set('lat', lat);
                formData.set('lon', lon);
                formData.set('message', values.message);
                formData.set('image', values.image[0].originFileObj);
                this.setState({
                    confirmLoading: true,
                });

                fetch(`${API_ROOT}/post`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                })
                    .then((response) => {
                        if (response.ok) {
                            this.form.resetFields();
                            this.setState({
                                visible: false,
                                confirmLoading: false
                            });
                            return response;
                        }
                        throw new Error(response.statusText);
                    })
                    .then(() => {
                        this.props.loadNearbyPosts();
                        message.success("Upload Succeeded!")
                    })
                    .catch((err) => {
                        message.error("Upload Failed!");
                        console.log(err);
                    });
            } else {
                console.log(err);
            }
        });
    };

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
            confirmLoading: false,
        });
    };

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Post"
                    className="modal"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    okText="Create"
                >
                    <UploadWindow
                        ref={(formInstance) => {
                            this.form = formInstance;
                        }}
                    />
                </Modal>
            </div>
        );
    }
}