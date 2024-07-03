import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import { Chatbot } from '../../lib/ChatbotLib';

class AddChatbot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatbot: null
    }
  }

  componentDidMount() {
    if (this.props.chatbot) {
      this.setState({
        chatbot: this.props.chatbot ? this.props.chatbot : new Chatbot()
      })
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    const { chatbot } = this.state;
    chatbot.setValue(name, value);
    this.setState({
      chatbot
    })
  }

  handleAddChatbot = (e) => {
    e.preventDefault();
    const { chatbot } = this.state;
    try {
      this.props.updateChatBotList(chatbot.createChatbotRecord());
      window.location.reload();
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  handleSidebarClose = () => {
    this.props.handleSidebarClose();
  }

  render() {

    const { sidebarOpen, chatbot } = this.props;

    return (
      <Sidebar
        className="right-sidebar"
        sidebar={
          <div className="add-chatbot-form">
            <h2>Add Chatbot</h2>
            <form onSubmit={this.handleFormSubmit}>
              <div>
                <label>Name:</label>
                {" "}
                <input
                  className="input-generic"
                  type="text"
                  name="name"
                  value={chatbot.name()}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div>
                <label>API Details:</label>
                {" "}
                <input
                  type="text"
                  className="input-generic"
                  name="api_token"
                  value={chatbot.apiToken()}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Bot Username:</label>
                {" "}
                <input
                  type="text"
                  className="input-generic"
                  name="bot_username"
                  value={chatbot.botUsername()}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Is Active:</label>
                {" "}
                <input
                  type="checkbox"
                  className="input-generic"
                  name="is_active"
                  checked={chatbot.isActive()}
                  onChange={(e) => this.handleInputChange({
                    target: { name: 'is_active', value: e.target.checked },
                  })}
                />
              </div>
              <div>
                <label>Chatbot Type:</label>
                {" "}
                <input
                  disabled={true}
                  type="text"
                  className="input-generic"
                  name="chatBotType"
                  value={chatbot.chatBotType()}
                  required
                />
              </div>
              <button onClick={this.handleAddChatbot} type="submit">Add Chatbot</button>
            </form>
          </div>
        }
        open={sidebarOpen}
        onSetOpen={this.handleSidebarClose}
        styles={{ sidebar: { background: "white", width: "calc(70vw)", "marginLeft": "60%", "padding": "5px"} }}
      />
    );
  }
}


export default AddChatbot;
