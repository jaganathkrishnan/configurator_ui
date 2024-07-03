import axios from 'axios';

export class Chatbot {

  static createChatbot(attributes) {
    return new Chatbot(attributes)
  }

  constructor(record=null) {
    this.record = record
  }

  setValue(key, value) {
    this.record[key] = value
  }

  id() {
    return this.record.id;
  }

  name(){
    return this.record.name;
  }

  apiToken(){
    return this.record.api_token;
  }

  botUsername(){
    return this.record.bot_username;
  }

  isActive() {
    return this.record.is_active;
  }

  chatBotType(){
    return this.record.chat_bot_type;
  }

  createChatbotRecord() {
    const payload = {
      chat_bot_details: {
        name: this.name(),
        chat_bot_type: this.chatBotType().toLowerCase(),
        api_details: {
          api_token: this.apiToken(),
          adapter: "telegram",
          username: this.botUsername()
        }
      }
    }
    try {
      axios.post("http://localhost:1004/create_chat_bot", payload, {
        headers: this.generateHeaders()
      }).then((response) => {
        if (response.ok) {
          return true
        } else {
          throw response.json()
        }
      })
    } catch(error) {
      throw error
    }
  }

  deleteRecord() {
    try {
      axios.delete(`http://localhost:1004/delete_chat_bot/${this.id()}`, {
        headers: this.generateHeaders()
      }).then((response) => {
        if (response.ok) {
          return this.record
        } else {
          throw response.json()
        }
      })
    } catch (error) {
      throw error
    }
  }

  generateHeaders(){
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}`
    }
  }
}
