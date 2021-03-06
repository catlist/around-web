import React from 'react';
import { Marker, InfoWindow } from 'react-google-maps';
import blueMarkerUrl from '../assets/images/blue-marker.svg'

export class AroundMarker extends React.Component {
    defaultCenter = { lat: 40.758699, lng: -73.985542 };

    state = {
        isOpen: false,
        clickOpen: false
    }

    toggleOpen = () => {
        this.setState((prevState) => {
            return {
                isOpen: !prevState.isOpen
            }
        });
    }
    clickOpen = () => {
        this.setState((prevState) => {
            return {
                clickOpen: !prevState.clickOpen
            }
        });
    }

    onCloseClick = () => {
        this.setState((prevState) => {
            return {
                isOpen: false,
                clickOpen: false
            }
        });
    }

    render() {
        const isImagePost = this.props.post.type === 'image';
        const icon = isImagePost ? null : {
            url: blueMarkerUrl,
            scaledSize: new window.google.maps.Size(50, 40)
        };
        const { location: { lat, lon: lng }, user, message, url } = this.props.post;
        return (
            <Marker
                position={{ lat, lng }}
                onMouseOver={isImagePost ? this.toggleOpen : null}
                onMouseOut={isImagePost ? this.toggleOpen : null}
                onClick={this.clickOpen}
                icon={icon}
            >
                {
                    this.state.isOpen || this.state.clickOpen ?
                        (
                            <InfoWindow onCloseClick={this.onCloseClick}>
                                {
                                    isImagePost ?
                                        (
                                            <div>
                                                <img
                                                    className="around-marker-image"
                                                    src={url}
                                                    alt={message}
                                                />
                                                <p />
                                                {`${user} : ${message}`}
                                            </div>
                                        ) :
                                        (
                                            <div>
                                                <video
                                                    className="around-marker-video"
                                                    src={url}
                                                    alt={message}
                                                    controls
                                                />
                                                <p />
                                                {`${user} : ${message}`}
                                            </div>
                                        )
                                }
                            </InfoWindow>
                        ) : null
                }

            </Marker >
        );
    }
}