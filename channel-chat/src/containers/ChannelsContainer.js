import React, {Component} from 'react'
import ChannelListItem from '../components/ChannelListItem'

import UserPopUp from '../components/UserPopUp'
import ChannelUsersModal from '../components/ChannelUsersModal'
import Channel from '../components/Channel'
import NewChannelModal from '../components/NewChannelModal'
import AddChannelModal from '../components/AddChannelModal'
import MessageField from '../components/MessageField'
import Thread from '../components/Thread'
import Cable from '../components/Cables';
import { API_ROOT } from '../constants/index';
import { ActionCable } from 'react-actioncable-provider';


export default class ChannelsContainer extends Component {


    constructor() {
        super()
        this.username = React.createRef()
        this.password = React.createRef()

        if (this.getToken()) {
            this.getProfile()
        
        }

        this.state = {
            conversations: [],
            conversation: null,
            messages: [],
                thread: null
        }
    }
    
    
    convertTime = (time) => {
        const months = {
          "01": "Jan",
          "02": "Feb",
          "03": "Mar",
          "04": "Apr",
          "05": "May",
          "06": "Jun",
          "07": "Jul",
          "08": "Aug",
          "09": "Sep",
          "10": "Oct",
          "11": "Nov",
          "12": "Dec",
        }
        const rn = new Date()
        let today = `${String(rn.getFullYear())}-${String(rn.getMonth() + 1).length===2?String(rn.getMonth() + 1):"0"+String(rn.getMonth() + 1)}-${String(rn.getDate())}`;
        const date = time.split("T")[0]
        time = time.split("T")[1]
        let hour = time.split(":")[0]
        let minute = time.split(":")[1]
        if (date === today) {
          return `Today at ${hour}:${minute}`
        }else{
          return `${months[date.split("-")[1]]} ${date.split("-")[2]} at ${hour}:${minute}`
        }
      }

    toggleThread = (message) => {

        this.setState({
            thread: message
        })

        
    }



    componentDidMount() {
        this.scrollToBottom();
        this.getChannelsAndMessages();
    }

    getChannelsAndMessages = () => {
        fetch(`${API_ROOT}/channels`)
            .then(res => res.json())
            .then(conversations => {
                this.setState({ conversations })
            });
    }


    getToken() {
        return localStorage.getItem('jwt')
    } 

   
    changeChannel = (channel) => {
        this.setState({
            conversation: channel,
        })

        
    }

    
    postMessage = (ev) => {
        ev.preventDefault()
       let content =  ev.target[0].value
        let token = this.getToken()
        fetch(`${API_ROOT}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                content: content,
                user_id: this.state.user.id,
                channel_id: this.state.conversation.id
            }),
        })
            .then(res => res.json() )
            .then(json => {
                this.setState(prevState => {
                return { messages: prevState.messages.concat(json.message)} 
            })}
            )
        

         
    }   


    getProfile = () => {
        let token = this.getToken()
        fetch(`${API_ROOT}/profile`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(json => {
                this.setState({ user: json.user })
            })
    }

    handleChannelCreate = (channel) => {
        this.handleAddingUsersToChannels(channel)
        let name = '#' + channel.channelName
        let token = this.getToken()
        fetch(`${API_ROOT}/channels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
              name: name
            }),
        }).then(res => res.json())
            .then(json => {
                this.setState(prevState => {
                    return { conversations: prevState.conversations.concat(json.channel) }
                })
                this.handleAddingUsersToChannels(channel, json.channel.id)
            }
            )
    }

    channelPost = () => {
        
    }

    handleAddingUsersToChannels = (channel, id) => {
        let token = this.getToken()
        let allUsers = channel.channelUsers.concat(this.state.user)
        allUsers.map(user => {
            fetch(`${API_ROOT}/user_channels`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    user_id: user.id,
                    channel_id: id
                }),
            })
        })
    }



    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.el.scrollIntoView({ behavior: 'smooth' });
    }


    handleReceivedConversation = response => {
        const { conversation } = response;
        if(conversation !== undefined) {
            this.setState({
                conversations: [...this.state.conversations, conversation.channel]
            });
        }
       
    };

    handleReceivedMessage = response => {
        const { message } = response;
        const conversations = [...this.state.conversations];
        const conversation = conversations.find(
            conversation => conversation.id === message.channel_id
        );
        conversation.messages = [...conversation.messages, message];
        let userConversations = conversations.filter(convo => convo.users.includes(this.state.user))
        console.log("user conversations: ", userConversations)
        
        this.setState({ conversations });
    };


    render(){
        let width = this.state.thread ? 'seven' : 'twelve'
        return (
            <div><br></br>


                <div className="ui grid">
                    <div className="four wide column">
                        <div className="ui vertical fluid tabular menu">
                            <UserPopUp />
                            <h1>#Channels</h1>
                                <br></br>

                            <NewChannelModal handleSubmit={this.handleChannelCreate} />
                            <AddChannelModal />
                            <br></br>
                            <br></br>
                            <ActionCable
                                channel={{ channel: 'ChannelsChannel' }}
                                onReceived={this.handleReceivedConversation}
                            />
                            {this.state.conversations.length ? (
                                <Cable
                                    conversations={this.state.conversations}
                                    handleReceivedMessage={this.handleReceivedMessage}
                                />
                            ) : null}

                            

                            {

                            this.state.conversations.map(chan => {
                              return <ChannelListItem key={chan.id} conversation={this.state.conversation} channelSelect={this.changeChannel} channel={chan}  />
                            })}

                        </div>
                    </div>
                    <div className={`${width} wide right floated column`} >
                        <div className="ui segment">
                            {this.state.conversation ? <div className="header"><h3>{this.state.conversation.name}</h3><ChannelUsersModal channelUsers={this.state.conversation.users}/></div> : null}
                            <div className="scroll-feed">
       
                                <div className="channel-window">
          
                                    {this.state.conversation ? <Channel convertTime={this.convertTime} toggleThread={this.toggleThread} messages={this.state.conversation.messages} currentChannel={this.state.conversation} /> : null}

                                    <div ref={el => { this.el = el; }} />
                                </div>
                            </div>
                            {
                                this.state.conversation ?
                                    <MessageField placeholder={"Message " + this.state.conversation.name} handleSubmit={this.postMessage} channel={this.state.conversation} /> : null
                            }
                        </div>
                    </div>
                    {/* -----Sidebar for Threads------- */}
                    { this.state.thread?
                    <div className="five wide stretched column">
                        <div className="ui segment">

                            <div className="scroll-feed">
                                <div className="channel-window">
                                    <Thread convertTime={this.convertTime} message={this.state.thread} />
                                </div>
                            </div>
                            {
                             
                                this.state.conversation ?
                                    <MessageField handleSubmit={this.postMessage} channel={this.state.conversation} /> : null
                            }
                        </div>
                        
                    </div>
                    :
                    null}
                </div>
                
            </div>
        )
    }
}
