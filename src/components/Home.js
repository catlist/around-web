import React from 'react';
import { GEO_OPTIONS, API_ROOT, TOKEN_KEY, POS_KEY } from '../constants';
import { Tabs, Button, Spin } from 'antd';
import { Gallery } from './Gallery';

const TabPane = Tabs.TabPane;
const operations = <Button>Extra Action</Button>;

export class Home extends React.Component {
    state = {
        error: "",
        isLoadingGeolocation: false,
        isLoadingPosts: false,
        posts: []
    };

    componentDidMount() {
        if ("geolocation" in navigator) {
            this.setState({
                isLoadingGeolocation: true,
            })
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeolocation,
                this.onFailedLoadGeolocation,
                GEO_OPTIONS
            )
        } else {
            this.setState({
                error: "Geolocation is not supported by browser."
            });
        }
    }

    onSuccessLoadGeolocation = (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({
            lat: latitude,
            lon: longitude
        }));
        this.setState({
            isLoadingGeolocation: false
        });
        this.loadNearbyPosts();
    }

    d = (error) => {
        this.setState({
            isLoadingGeolocation: false,
            error: "Error in getting geolocation."
        });
        console.log(error);

    }

    getImagePosts = () => {
        const { error, posts, isLoadingGeolocation, isLoadingPosts } = this.state;
        if (error) {
            return error;
        } else if (isLoadingGeolocation) {
            return <Spin tip="Loading Geolocation..." />;
        } else if (isLoadingPosts) {
            return <Spin tip="Loading Post" />;
        } else if (posts && posts.length > 0) {
            const images = posts.map(({ user, url, message }) => ({
                user,
                src: url,
                thumbnail: url,
                caption: message,
                thumbnailWidth: 400,
                thumbnailHeight: 300
            }));
            return <Gallery images={images} />;
        } else {
            return "Image Posts";
        }
    }

    loadNearbyPosts = () => {
        this.setState({
            isLoadingPosts: true
        });
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        const token = localStorage.getItem(TOKEN_KEY);
        fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Failed to load posts.");
            })
            .then((data) => {
                this.setState({
                    isLoadingPosts: false,
                    posts: data ? data : []
                });
            })
            .catch((e) => {
                this.setState({
                    isLoadingPosts: false,
                    error: e.message
                });
            });
    }

    render() {
        return (
            <Tabs className='main-tabs' defaultActiveKey="1" tabBarExtraContent={operations}>
                <TabPane tab="Image Posts" key="1">
                    {this.getImagePosts()}
                </TabPane>
                <TabPane tab="Video Posts" key="2">Video Posts</TabPane>
                <TabPane tab="Map" key="3">Map</TabPane>
            </Tabs>
        );
    }
}