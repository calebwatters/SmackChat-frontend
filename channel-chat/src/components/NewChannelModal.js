import React from "react";
import {
  Button,
  Header,
  Modal,
  Form,
  Input,
  Dropdown
} from "semantic-ui-react";
import { API_ROOT } from "../constants/index";
import { fetchJson } from "../util/request";
const userOptions = [];

class ModalModalExample extends React.Component {
  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  state = {
    channelName: "",
    channelUsers: [],
    modalOpen: false
  };

  handleSubmit = () => {
    this.props.handleSubmit(this.state);
    this.handleClose();
  };

  handleChange = (ev, { value }) => {
    if (Array.isArray(value)) {
      this.setState({
        channelUsers: value
      });
    } else {
      this.setState({
        channelName: value
      });
    }
  };

  componentDidMount() {
    setTimeout(() => {
      fetchJson(`${API_ROOT}/users`).then(json => {
        let filtered = json.filter(
          user => user.id !== this.props.currentUser.id
        );
        filtered.forEach(function(user) {
          userOptions.push({
            value: user,
            text: user.username,
            key: user.id
          });
        });
      });
    }, 2000);
  }

  render() {
    return (
      <Modal
        trigger={
          <button onClick={this.handleOpen} className="ui basic button">
            <i className="icon hashtag"></i>Create Channel
          </button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>Create A Channel</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>Channel Info</Header>
            <Form id="new-chanel-form">
              <Form.Group widths="equal">
                <Form.Field
                  onChange={this.handleChange}
                  id="channelName"
                  control={Input}
                  label="#Channel name"
                  placeholder="Channel name"
                  autoComplete="off"
                />
              </Form.Group>
              <Form.Dropdown
                onChange={this.handleChange}
                id="channelUsers"
                placeholder="Friends"
                fluid
                multiple
                search
                selection
                options={userOptions}
              />
              <Form.Field
                onClick={this.handleSubmit}
                id="form-button-control-public"
                control={Button}
                content="Create Channel"
              />
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalModalExample;
