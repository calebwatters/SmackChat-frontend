import React, { useState, useEffect } from "react";
import { Button, Header, Modal, Dropdown } from "semantic-ui-react";

export const AddChannelModal = ({ channels, handleUserChannelAdd }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [channelOptions, setChannelOptions] = useState([]);
  useEffect(() => {
    const options = channels.map(channel => ({
      value: channel,
      text: channel.name,
      key: channel.id
    }));
    setChannelOptions(options);
  }, [channels, isOpen]);

  const handleChange = (ev, { value }) => {
    setSelectedChannel(value);
  };

  const handleSubmit = () => {
    setIsOpen(false);
    handleUserChannelAdd(selectedChannel);
  };

  return (
    <Modal
      trigger={
        <button onClick={() => setIsOpen(true)} className="ui basic button">
          {" "}
          <i className="icon hashtag"></i>Add Channel
        </button>
      }
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <Modal.Header>Search for a Channel to Add</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Channel Name</Header>
          <Dropdown
            onChange={handleChange}
            placeholder="Select Channel"
            fluid
            search
            selection
            options={channelOptions}
          />
          <br></br>
          <Button onClick={handleSubmit}>Add Channel</Button>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};
