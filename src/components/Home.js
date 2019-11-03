import React from 'react';
import { GEO_OPTIONS, API_ROOT, TOKEN_KEY, POS_KEY, GOOGLE_MAPS_API_KEY } from '../constants';
import { CreatePostButton } from './CreatePostButton';
import { Gallery } from './Gallery';
import { Tabs, Spin } from 'antd';
import { AroundMap } from './AroundMap';

const TabPane = Tabs.TabPane;

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

    getPanelContent = (type) => {
        const { error, posts, isLoadingGeolocation, isLoadingPosts } = this.state;
        if (error) {
            return error;
        } else if (isLoadingGeolocation) {
            return <Spin tip="Loading Geolocation..." />;
        } else if (isLoadingPosts) {
            return <Spin tip="Loading Post" />;
        } else if (posts && posts.length > 0) {
            return type === 'image' ? this.getImagePosts() : this.getVideoPosts();
        } else {
            return null;
        }
    }

    getImagePosts = () => {
        const images = this.state.posts
            .filter(({ type }) => type === 'image')
            .map(({ user, url, message }) => ({
                user,
                src: url,
                thumbnail: url,
                caption: message,
                thumbnailWidth: 400,
                thumbnailHeight: 300
            }));
        return <Gallery images={images} />;
    }

    getVideoPosts = () => {
        const videos = this.state.posts
            .filter(({ type }) => type === 'video')
            .map(({ user, url, message }) => {
                return (
                    <div style={{ margin: '10px' }}>
                        <video src={url} controls className="video-block" />
                        <p>  {`${user}" ${message}"`}</ p >
                    </div>
                );
            });
        return (
            <div style={{ display: 'flex' }}>
                {videos}
            </div >
        );
    }

    loadNearbyPostsOnMap = () => {
        if (localStorage.getItem(POS_KEY) != null) {
            return (
                <AroundMap
                    googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_MAPS_API_KEY + "&v=3.exp&libraries=geometry,drawing,places"}
                    loadingElement={
                        < div style={{
                            height: `100%`
                        }
                        } />
                    }
                    containerElement={
                        < div style={{ height: `400px` }} />
                    }
                    mapElement={
                        < div style={{ height: `100%` }} />
                    }
                    posts={this.state.posts}
                    loadNearbyPosts={this.loadNearbyPosts}
                />
            )
        } else {
            return "Map";
        }
    }

    loadNearbyPosts = (center, radius = 20) => {
        this.setState({
            isLoadingPosts: true
        });
        const { lat, lon } = center ? center : JSON.parse(localStorage.getItem(POS_KEY));
        const token = localStorage.getItem(TOKEN_KEY);
        fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${radius}`, {
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
        const operations = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts} />;
        return (
            <Tabs className='main-tabs' defaultActiveKey="1" tabBarExtraContent={operations} >
                <TabPane tab="Image Posts" key="1">
                    {this.getPanelContent('image')}
                </TabPane>
                <TabPane tab="Video Posts" key="2">
                    {this.getPanelContent('video')}
                </TabPane>
                <TabPane tab="Map" key="3">
                    {this.loadNearbyPostsOnMap()}
                </TabPane>
            </Tabs>
        );
    }
}