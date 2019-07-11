import React from 'react';
import Login from '../containers/Login';
import SignUp from '../components/SignUp';
import ChannelsContainer from './ChannelsContainer'

class Primary extends React.Component {


    render() {
        
        return (
            <div className="App">
                <main>
                    <div className="header">
                        <h1>SmackChat</h1>
                    </div>

                    <SignUp/>
                    <Login />
                    <ChannelsContainer createChannel={this.addChannel} />
                    
                </main>
            </div>
    
        );
    }
}

export default Primary;