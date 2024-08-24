import React, { Component } from 'react'
import { Chatbot } from '../../lib/ChatbotLib';
import { Workflow } from '../../lib/WorkflowLib';
import { Tab, Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import WorkflowDetails from './WorkflowDetails';
import Statuses from './Statuses';

//please fix this component to be able to pass workflowObj and statuses to WorkflowDetails component
class WorkflowForm extends Component {

  constructor(props){
    super(props);

    const segments = window.location.href.split('/').filter(segment => segment);
    const workflowId =  segments.pop();

    this.state = {
      workflowId: workflowId === "new" ? null : workflowId,
      workflowObj: null,
      chatbots: [],
      error: null,
      activePaneIndex: 0
    }
  }

  componentDidMount() {
    if (!localStorage.getItem('apartix_session_id')) {
      window.location.href = `${window.location.origin}/login`
    } else {
      const { workflowId } = this.state;
      if (workflowId) {
        this.fetchWorkflow();
      } else {
        this.fetchChatbots();
      }
    }
  }

  updateActivePaneIndex = (newActiveIndex) => {
    this.setState({
      activePaneIndex: newActiveIndex
    })
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

  fetchWorkflow = async () => {
    const { workflowId } = this.state;
    try {
      const response = await fetch(`http://localhost:1001/workflows/${workflowId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}` // Replace with your actual token or header value
        }
      }); // Replace with your API endpoint
      const result = await response.json();
      if (response.ok) {

        const { data } = result;
        console.log("workflow response data - ", data)
        const workflowObj = new Workflow(data["workflow"], data["status_tree"],
        data["workflow_variables"],
        data["workflow_level_actions"])
        const chatbots = data["chat_bots"].map((chatBotRecord) => {return new Chatbot(chatBotRecord)})

        this.setState({
          chatbots: chatbots,
          workflowObj: workflowObj
        });
        console.log("Updating state")
      } else {
        this.setState({ error: result });
      }
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  panes = () => {
    const { workflowObj, chatbots } = this.state;
    if (!workflowObj) {
      return []
    }
    return ([
      {
        menuItem: 'Workflow Initial Details',
        render: () => (
          <Tab.Pane>
            <WorkflowDetails workflowObj={workflowObj} chatbots={chatbots} updateActivePaneIndex={this.updateActivePaneIndex} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Statuses',
        render: () => (
          <Tab.Pane>
            <Statuses workflowObj={workflowObj} updateActivePaneIndex={this.updateActivePaneIndex}/>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Workflow Properties (optional)',
        render: () => (
          <Tab.Pane>
            <h3>Content for Tab 3</h3>
            <p>This is the content of the third tab.</p>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Workflow Actions (optional)',
        render: () => (
          <Tab.Pane>
            <h3>Content for Tab 3</h3>
            <p>This is the content of the third tab.</p>
          </Tab.Pane>
        ),
      }
    ]
  )};

  handleTabChange = (e, { activeIndex }) => {
    this.setState({activePaneIndex: activeIndex });
  };

  render() {
    const { activePaneIndex } = this.state;

    return (
      <div className="workflow-form-container">
        {this.props.renderMenuButton()}
        <a href={`${window.location.origin}/workflows`} className={"bread-crumb"}>
          Go to Workflows list
        </a>
        <h1>Workflow Details</h1>
        <Tab panes={this.panes()} activeIndex={activePaneIndex} onTabChange={this.handleTabChange}/>
      </div>
    )
  }
}

export default WorkflowForm;
