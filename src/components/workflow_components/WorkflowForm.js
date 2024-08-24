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

      const result = {"data":{"workflow":{"id":2,"name":"Sample Workflow 1","workflow_type":"default","start_status_id":2,"created_at":"2024-06-21T18:38:49.359Z","updated_at":"2024-07-05T21:09:55.797Z","chat_bot_id":4,"is_published":true,"start_status_label":"Start"},"status_tree":[{"id":2,"label":"Start","google_form_id":"","created_at":"2024-06-21T18:38:49.329Z","updated_at":"2024-08-17T06:33:08.850Z","api_name":"sample_start_1718995129","variables":[{"id":5,"name":"New var 1","status_id":2,"datatype":"select","created_at":"2024-08-17T09:21:32.659Z","updated_at":"2024-08-18T08:47:26.109Z","api_name":"TmV3IHZhcl8xNzIzODg2NDky\n","options":"[{\"label\":\"b\",\"value\":\"bb\",\"description\":\"bbb\"}]","description":"New var 1 desc"},{"id":6,"name":"New var 2","status_id":2,"datatype":"text","created_at":"2024-08-17T09:46:15.932Z","updated_at":"2024-08-17T09:46:15.932Z","api_name":"TmV3IHZhciAyXzE3MjM4ODc5NzU=\n","options":"[]","description":"new var 2 desc"}],"status_level_actions":[],"children":[{"id":7,"label":"Second Status","google_form_id":"","created_at":"2024-07-23T12:11:05.159Z","updated_at":"2024-08-01T11:43:23.715Z","api_name":"New Status_1721736665"},{"id":8,"label":"Status 3","google_form_id":"","created_at":"2024-08-01T16:07:52.016Z","updated_at":"2024-08-01T16:07:52.016Z","api_name":"Status 3_1722528472"},{"id":9,"label":"Status 4","google_form_id":"","created_at":"2024-08-03T08:18:24.897Z","updated_at":"2024-08-03T08:18:24.897Z","api_name":"Status 4_1722673104"}],"self_occuring_conditions":[]},{"id":7,"label":"Second Status","google_form_id":"","created_at":"2024-07-23T12:11:05.159Z","updated_at":"2024-08-01T11:43:23.715Z","api_name":"New Status_1721736665","variables":[],"status_level_actions":[],"children":[{"id":8,"label":"Status 3","google_form_id":"","created_at":"2024-08-01T16:07:52.016Z","updated_at":"2024-08-01T16:07:52.016Z","api_name":"Status 3_1722528472"},{"id":9,"label":"Status 4","google_form_id":"","created_at":"2024-08-03T08:18:24.897Z","updated_at":"2024-08-03T08:18:24.897Z","api_name":"Status 4_1722673104"}],"self_occuring_conditions":[{"parent_id":2,"condition":{"id":2,"rule":"[]","created_at":"2024-07-23T12:11:05.076Z","updated_at":"2024-07-23T12:11:05.076Z"}},{"parent_id":8,"condition":{"id":2,"rule":"[]","created_at":"2024-07-23T12:11:05.076Z","updated_at":"2024-07-23T12:11:05.076Z"}},{"parent_id":9,"condition":{"id":2,"rule":"[]","created_at":"2024-07-23T12:11:05.076Z","updated_at":"2024-07-23T12:11:05.076Z"}}]},{"id":8,"label":"Status 3","google_form_id":"","created_at":"2024-08-01T16:07:52.016Z","updated_at":"2024-08-01T16:07:52.016Z","api_name":"Status 3_1722528472","variables":[],"status_level_actions":[],"children":[{"id":7,"label":"Second Status","google_form_id":"","created_at":"2024-07-23T12:11:05.159Z","updated_at":"2024-08-01T11:43:23.715Z","api_name":"New Status_1721736665"},{"id":9,"label":"Status 4","google_form_id":"","created_at":"2024-08-03T08:18:24.897Z","updated_at":"2024-08-03T08:18:24.897Z","api_name":"Status 4_1722673104"}],"self_occuring_conditions":[{"parent_id":7,"condition":{"id":2,"rule":"[]","created_at":"2024-07-23T12:11:05.076Z","updated_at":"2024-07-23T12:11:05.076Z"}},{"parent_id":9,"condition":{"id":2,"rule":"[]","created_at":"2024-07-23T12:11:05.076Z","updated_at":"2024-07-23T12:11:05.076Z"}},{"parent_id":2,"condition":{"id":2,"rule":"[]","created_at":"2024-07-23T12:11:05.076Z","updated_at":"2024-07-23T12:11:05.076Z"}}]},{"id":9,"label":"Status 4","google_form_id":"","created_at":"2024-08-03T08:18:24.897Z","updated_at":"2024-08-03T08:18:24.897Z","api_name":"Status 4_1722673104","variables":[],"status_level_actions":[],"children":[{"id":7,"label":"Second Status","google_form_id":"","created_at":"2024-07-23T12:11:05.159Z","updated_at":"2024-08-01T11:43:23.715Z","api_name":"New Status_1721736665"},{"id":8,"label":"Status 3","google_form_id":"","created_at":"2024-08-01T16:07:52.016Z","updated_at":"2024-08-01T16:07:52.016Z","api_name":"Status 3_1722528472"},{"id":10,"label":"Status 5","google_form_id":"","created_at":"2024-08-17T05:22:45.466Z","updated_at":"2024-08-17T05:22:45.466Z","api_name":"Status 5_1723872165"}],"self_occuring_conditions":[{"parent_id":7,"condition":{"id":2,"rule":"[]","created_at":"2024-07-23T12:11:05.076Z","updated_at":"2024-07-23T12:11:05.076Z"}},{"parent_id":8,"condition":{"id":2,"rule":"[]","created_at":"2024-07-23T12:11:05.076Z","updated_at":"2024-07-23T12:11:05.076Z"}},{"parent_id":2,"condition":{"id":2,"rule":"[]","created_at":"2024-07-23T12:11:05.076Z","updated_at":"2024-07-23T12:11:05.076Z"}}]},{"id":10,"label":"Status 5","google_form_id":"","created_at":"2024-08-17T05:22:45.466Z","updated_at":"2024-08-17T05:22:45.466Z","api_name":"Status 5_1723872165","variables":[],"status_level_actions":[],"children":[],"self_occuring_conditions":[{"parent_id":9,"condition":{"id":2,"rule":"[]","created_at":"2024-07-23T12:11:05.076Z","updated_at":"2024-07-23T12:11:05.076Z"}}]}],"workflow_variables":[],"workflow_level_actions":[],"chat_bots":[{"id":4,"name":"Testing","api_details":"{\"api_token\":\"6717594960:AAHD6FG7e6hZQGy4zQILe5O0EEGvwall7Ps\",\"adapter\":\"telegram\",\"username\":\"@testing_society_chat_17_bot\"}","is_active":true,"created_at":"2024-06-17T16:13:26.018Z","updated_at":"2024-06-17T16:13:33.684Z","chat_bot_type":"society"}]}}
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
