import React, { Component } from 'react';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import Button from 'devextreme-react/button';
import { Chatbot } from '../../lib/ChatbotLib';
import AddChatbot from './AddChatbot';
import '../../styling/chatbot.css';

class ChatbotList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatbots: [],
      error: null,
      showChatbotForm: false,
    };
  }

  componentDidMount() {
    // Temporarily bypass authentication
    this.fetchChatbots();
  }

  fetchChatbots = async () => {
    try {
      const response = await fetch('http://localhost:1003/chat_bots', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}`, // Removed authentication for bypass
        },
      });
      const result = await response.json();
      if (response.ok) {
        const chatbots = result.data.map((chatBotRecord) => new Chatbot(chatBotRecord));
        this.setState({ chatbots });
      } else {
        this.setState({ error: result });
      }
    } catch (err) {
      const result = {"data":[{"id":4,"name":"Testing","is_active":true,"chat_bot_type":"society"}]}
      const data = result["data"].map((chatBotRecord) => {
        return new Chatbot(chatBotRecord)
      })
      this.setState({ chatbots: data });
      this.setState({ error: err.message });
    }
  };

  toggleChatbotForm = () => {
    this.setState((prevState) => ({ showChatbotForm: !prevState.showChatbotForm }));
  };

  handleAddChatbot = () => {
    this.toggleChatbotForm();
  };

  render() {
    const { chatbots, showChatbotForm, error } = this.state;

    return (
      <div className="chatbot-list-container">
        <h1>Chatbot List</h1>
        {error && <p>Error: {error}</p>}
        <Button text="+ Add Chatbot" className="add-chatbot-button" onClick={this.handleAddChatbot} />
        {showChatbotForm && <AddChatbot fetchChatbots={this.fetchChatbots} toggleChatbotForm={this.toggleChatbotForm} />}
        <DataGrid dataSource={chatbots} keyExpr="id" showBorders={true}>
          <Column dataField="name" caption="Name" cellRender={({ data }) => <p>{data.name()}</p>} />
          <Column dataField="is_active" caption="Is Active" cellRender={({ data }) => <p>{data.isActive() ? 'Active' : 'Inactive'}</p>} />
          <Column
            caption="Actions"
            cellRender={({ data }) => (
              <Button
                onClick={() => {
                  window.location.href = `${window.location.origin}/chatbots/${data.id()}`;
                }}
              >
                View Details
              </Button>
            )}
          />
        </DataGrid>
      </div>
    );
  }
}

export default ChatbotList;
