import React, { useState } from "react";
import { Button, Header, Modal, Dropdown } from "semantic-ui-react";

let userOptions = [];

export const ChannelSettings = ({ deleteChannel, channelUsers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    userOptions = [];
    channelUsers.forEach(function(user) {
      userOptions.push({
        value: user,
        text: user.username,
        key: user.id
      });
    });
    setIsOpen(true);
  };

  return (
    <Modal
      trigger={
        <button onClick={handleOpen} className="ui basic button">
          {" "}
          <i className="icon settings"></i>Settings
        </button>
      }
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <Modal.Header>Search Channel for Users</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Channel Users</Header>
          <Dropdown
            placeholder="Select Channel"
            fluid
            search
            selection
            options={userOptions}
          />
          <br></br>
          <Button onClick={deleteChannel} className="ui red basic button">
            Leave Channel
          </Button>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};
