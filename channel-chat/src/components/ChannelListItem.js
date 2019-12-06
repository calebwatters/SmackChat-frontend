import React, { Component } from "react";

export default class ChannelListItem extends Component {
  state = {
    channel: this.props.channel
  };

  handleClick = ev => {
    this.props.channelSelect(this.state.channel);
  };

  render() {
    return (
      <a
        onClick={this.handleClick}
        className={
          this.state.channel === this.props.conversation
            ? "active item"
            : "item"
        }
      >
        {this.state.channel.name}{" "}
      </a>
    );
  }
}
