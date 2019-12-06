import React, { Component } from "react";
import ChannelListItem from "../components/ChannelListItem";
import Notifier from "react-desktop-notification";
import UserPopUp from "../components/UserPopUp";
import { ChannelSettings } from "../components/ChannelSettings";
import Channel from "../components/Channel";
import NewChannelModal from "../components/NewChannelModal";
import { JoinChannelModal } from "../components/JoinChannelModal";
import MessageField from "../components/MessageField";
import { SearchMessage } from "../components/SearchMessage";
import Cable from "../components/Cables";
import { API_ROOT } from "../constants/index";
import { fetchJson } from "../util/request";
export default class ChannelsContainer extends Component {
  constructor() {
    super();
    if (this.getToken()) {
      this.getProfile();
    }

    this.state = {
      userConversations: [],
      conversations: [],
      conversation: null,
      messages: [],
      thread: null,
      threadVisible: false,
      searchQuery: "",
      searched: false,
      deleteOptions: []
    };
  }

  componentDidMount() {
    this.scrollToBottom();
    this.getChannelsAndMessages();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  getChannelsAndMessages = async () => {
    const conversations = await fetchJson(`${API_ROOT}/channels`);

    let userConvos = [];
    conversations.map(conv => {
      conv.users.map(user => {
        if (user.id === this.state.user.id) {
          userConvos.push(conv);
        }
      });

      this.setState({
        conversations: conversations,
        userConversations: userConvos
      });
    });
  };

  getToken() {
    return localStorage.getItem("jwt");
  }

  changeChannel = channel => {
    this.setState({
      conversation: channel
    });
  };

  toggleThread = message => {
    this.setState({
      thread: message,
      threadVisible: !this.state.threadVisible,
      searched: false
    });
  };

  postMessage = ev => {
    ev.preventDefault();
    let content = ev.target[0].value;
    fetchJson(`${API_ROOT}/messages`, {
      method: "POST",
      body: JSON.stringify({
        content: content,
        user_id: this.state.user.id,
        channel_id: this.state.conversation.id,
        likes: 0
      })
    });
    ev.target.reset();
  };

  getProfile = async () => {
    const response = await fetchJson(`${API_ROOT}/profile`);
    this.setState({ user: response.user });
  };

  handleChannelCreate = channel => {
    this.handleAddingUsersToChannels(channel);
    let name = "#" + channel.channelName;
    let token = this.getToken();
    fetch(`${API_ROOT}/channels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        name: name
      })
    })
      .then(res => res.json())
      .then(json => {
        this.setState(prevState => {
          return {
            conversations: prevState.conversations.concat(json.channel),
            userConversations: prevState.userConversations.concat(json.channel)
          };
        });
        this.handleAddingUsersToChannels(channel, json.channel.id);
      });
  };

  handleAddingUsersToChannels = (channel, id) => {
    let token = this.getToken();
    let allUsers = channel.channelUsers.concat(this.state.user);
    allUsers.map(user => {
      fetch(`${API_ROOT}/user_channels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          user_id: user.id,
          channel_id: id
        })
      });
    });
  };

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: "smooth" });
  }

  // handleReceivedConversation = response => {
  //   const { conversation } = response;
  //   if (conversation !== undefined) {
  //     this.setState({
  //       conversations: [...this.state.conversations, conversation.channel]
  //     });
  //   }
  // };

  handleReceivedMessage = response => {
    const { message } = response;
    console.log(response);
    const conversations = [...this.state.conversations];
    const conversation = conversations.find(
      conversation => conversation.id === message.channel_id
    );

    conversation.messages = [...conversation.messages, message];
    this.setState({ conversations });
    if (this.state.userConversations.includes(conversation)) {
      Notifier.start(
        conversation.name,
        message.content,
        "/",
        "https://static.thenounproject.com/png/30135-200.png"
      );
    }
  };

  handleMessageSearch = event => {
    this.setState({
      searchQuery: event.target.value,
      searched: true
    });
    let searchResults = [];
    this.state.conversations.forEach(conversation => {
      conversation.messages.forEach(message => {
        if (
          message.content
            .toLowerCase()
            .includes(this.state.searchQuery.toLowerCase())
        ) {
          searchResults.push(message);
        }
      });
    });
    this.setState({
      filtered: searchResults
    });
  };

  handleMessageSearchSubmit = event => {
    event.preventDefault();
    this.setState({ searchQuery: "" });
  };

  handleSearchClear = () => {
    this.setState({ searched: false });
  };

  addUserChannels = channel => {
    let user = this.state.user;
    fetchJson(`${API_ROOT}/user_channels`, {
      method: "POST",
      body: JSON.stringify({ channel_id: channel.id, user_id: user.id })
    }).then(
      this.setState(prevState => {
        return {
          userConversations: prevState.userConversations.concat(channel)
        };
      })
    );
  };

  getUserChannels = async () => {
    const userChannels = await fetchJson(`${API_ROOT}/user_channels`);
    const filtered = userChannels.filter(
      userChannel => userChannel.user_id == this.state.user.id
    );
    this.setState({
      deleteOptions: filtered
    });
  };

  handleChannelDelete = () => {
    this.getUserChannels();
    let association;
    setTimeout(() => {
      let userChans = this.state.deleteOptions;
      association = userChans.filter(uc => {
        return uc.channel_id === this.state.conversation.id;
      });

      fetchJson(`${API_ROOT}/user_channels/${association[0].id}`, {
        method: "DELETE"
      }).then(
        this.setState({
          conversation: null
        })
      );
    }, 500);
  };

  render() {
    let width = this.state.threadVisible ? "seven" : "twelve";

    return (
      <>
        <div className="ui secondary menu user-header">
          <div>
            <UserPopUp />
          </div>
          <div className="right menu">
            <form onSubmit={this.handleMessageSearchSubmit}>
              <div className="item">
                <div className="ui icon input">
                  <input
                    type="text"
                    placeholder="Search Messages..."
                    value={this.state.searchQuery}
                    onChange={this.handleMessageSearch}
                  />
                  {!this.state.searched && this.state.searchQuery === "" ? (
                    <i className="search link icon"></i>
                  ) : (
                    <i
                      onClick={this.handleSearchClear}
                      className="chevron up link icon"
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="ui grid">
          <div className="four wide column channel-nav">
            <div className="ui vertical fluid tabular menu">
              <h2 className="header">#Channels</h2>
              <br></br>

              <NewChannelModal
                handleSubmit={this.handleChannelCreate}
                currentUser={this.state.user}
              />
              {this.state.conversations.length ? (
                <Cable
                  conversations={this.state.conversations}
                  handleReceivedMessage={this.handleReceivedMessage}
                />
              ) : null}

              {this.state.userConversations.map(chan => (
                <ChannelListItem
                  key={chan.id}
                  conversation={this.state.conversation}
                  channelSelect={this.changeChannel}
                  channel={chan}
                />
              ))}
              <JoinChannelModal
                currentUser={this.state.user}
                handleUserChannelAdd={this.addUserChannels}
                channels={this.state.conversations}
              />
            </div>
          </div>
          <div className={`${width} wide right floated column`}>
            <div className="channel-container">
              {this.state.conversation ? (
                <div className="header">
                  <div className="ui secondary menu">
                    <h3>{this.state.conversation.name}</h3>
                    <div className="right menu">
                      <ChannelSettings
                        deleteChannel={this.handleChannelDelete}
                        channelUsers={this.state.conversation.users}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="scroll-feed">
                <div className="channel-window">
                  {this.state.conversation ? (
                    <Channel
                      convertTime={this.convertTime}
                      toggleThread={this.toggleThread}
                      messages={this.state.conversation.messages}
                      currentChannel={this.state.conversation}
                    />
                  ) : null}
                  <div
                    ref={el => {
                      this.el = el;
                    }}
                  />
                  <div />
                </div>
              </div>
              {this.state.conversation ? (
                <MessageField
                  placeholder={"Message " + this.state.conversation.name}
                  handleSubmit={this.postMessage}
                  channel={this.state.conversation}
                />
              ) : null}
            </div>
          </div>
          {this.state.searched && this.state.searchQuery != "" ? (
            <SearchMessage messages={this.state.filtered} />
          ) : null}
          {}
        </div>
      </>
    );
  }
}
