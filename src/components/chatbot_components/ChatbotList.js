import React, { Component } from 'react';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import Button from 'devextreme-react/button';
import withSessionCheck from '../../higher_order_components/CheckSession.js';
import { Chatbot } from '../../lib/ChatbotLib.js';
import AddChatbot from './AddChatbot.js';

class ChatbotList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatbots: [],
      error: null,
      showChatbotForm: false
    };
  }

  componentDidMount() {
    if (!localStorage.getItem('apartix_session_id')) {
      window.location.href = `${window.location.origin}/login`
    } else {
      this.fetchChatbots();
    }
  }

  fetchChatbots = async () => {
    try {
      const response = await fetch('http://localhost:1003/chat_bots', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}` // Replace with your actual token or header value
        }
      }); // Replace with your API endpoint
      const result = await response.json();
      if (response.ok) {
        const data = result["data"].map((chatBotRecord) => {
          return new Chatbot(chatBotRecord)
        })
        this.setState({ chatbots: data });
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

  handleAddChatbot = () => {
    // Logic to add a new chatbot
    this.setState({
      showChatbotForm: true,
      selectedChatbot: new Chatbot({id: null, name: null, api_token: null, is_active: false, bot_username: null, chat_bot_type: "Society"})
    })
  };

  handleDeleteChatbot = (id) => {
    // Logic to delete a chatbot by id
    const toDeleteChatbot = this.state.chatbots.filter(chatbot => chatbot.id() !== id)[0];
    toDeleteChatbot.deleteRecord();
    window.location.reload();
  };

  handleActivateChatbot = (id) => {
    const toEditChatbot = this.state.chatbots.filter(chatbot => chatbot.id() !== id)[0];
    toEditChatbot.editRecord();
    window.location.reload();
  }

  closeAddChatbotSidebar = () => {
    this.setState({
      showChatbotForm: false,
      selectedChatbot: null
    })
  }

  updateChatBotList = (chatBot) => {
    const { chatbots } = this.state;
    this.setState({
      chatbots: [...chatbots, chatBot]
    })
  }

  render() {
    const { chatbots, showChatbotForm, selectedChatbot, error } = this.state;

    return (
      <div className='chatbot-list-container'>
        {this.props.renderMenuButton()}
        {error && <p>Error: {error}</p>}
        {showChatbotForm && <AddChatbot chatbot={selectedChatbot} sidebarOpen={true} handleSidebarClose={this.closeAddChatbotSidebar} updateChatBotList={this.updateChatBotList} />}
        <Button
          text="+ Add Chatbot"
          className="add-chatbot-button"
          onClick={this.handleAddChatbot}
        />
        <DataGrid
          dataSource={chatbots}
          keyExpr="id"
          showBorders={true}
        >
          <Column dataField="name" caption="Name" />
          <Column dataField="is_active" caption="Active" cellRender={({data}) => (
            <p>{data.isActive() ? "Active" : "Inactive"}</p>
          )} />
          <Column
            caption="Actions"
            cellRender={({ data }) => (
              <Button
                text={data.isActive() ? "Deactivate" : "Activate"}
                onClick={() => data.isActive() ? this.handleDeleteChatbot(data.id) : this.handleActivateChatbot(data.id)}
              />
            )}
          />
        </DataGrid>
      </div>
    );
  }
}

export default ChatbotList;
