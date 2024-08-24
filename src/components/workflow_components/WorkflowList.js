import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import { Workflow } from '../../lib/WorkflowLib';
import 'devextreme/dist/css/dx.light.css';
import Button from 'devextreme-react/button';

export default class WorkflowList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      workflows: [],
      error: null,
    };
  }

  componentDidMount() {
    if (!localStorage.getItem('apartix_session_id')) {
      window.location.href = `${window.location.origin}/login`
    } else {
      this.fetchWorkflows();
    }
  }

  handleAddWorkflow = () => {
    window.location.href = `${window.location.origin}/workflows/new`
  }

  fetchWorkflows = async () => {
    try {
      const response = await fetch('http://localhost:1001/workflows', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}` // Replace with your actual token or header value
        }
      }); // Replace with your API endpoint
      const result = await response.json();
      if (response.ok) {
        const data = result["data"].map((workflowRecord) => {
          return new Workflow(workflowRecord)
        })
        this.setState({ workflows: data });
      } else {
        this.setState({ error: result });
      }
    } catch (err) {
      // const response = await fetch('http://localhost:1001/workflows', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}` // Replace with your actual token or header value
      //   }
      // }); // Replace with your API endpoint
      const result = {"data":[{"id":2,"name":"Sample Workflow 1","workflow_type":"default","start_status_id":2,"created_at":"2024-06-21T18:38:49.359Z","updated_at":"2024-07-05T21:09:55.797Z","chat_bot_id":4,"is_published":true},{"id":3,"name":"Compliants testing","workflow_type":"default","start_status_id":3,"created_at":"2024-06-22T09:41:38.164Z","updated_at":"2024-08-17T06:38:23.872Z","chat_bot_id":4,"is_published":true}]}
      // const result = await response.json();
      // if (response.ok) {
        const data = result["data"].map((workflowRecord) => {
          return new Workflow(workflowRecord)
        })
        this.setState({ workflows: data });
      // } else {
      //   this.setState({ error: result });
      // }
      this.setState({ error: err.message });
    }
  }

  render() {

    const { workflows, error, showWorkflowForm, selectedWorkflow } = this.state;

    return (
      <div className='workflow-list-container'>
        {this.props.renderMenuButton()}
        <h1>Workflow List</h1>
        <Button
          text="+ Add Workflow"
          className="add-workflow-button"
          onClick={this.handleAddWorkflow}
        />
        <DataGrid
          dataSource={workflows}
          keyExpr="id"
          showBorders={true}
        >
          <Column dataField="name" caption="Name" cellRender={({data}) => (
            <p>{data.name()}</p>
          )} />
          <Column dataField="workflow_type" caption="Workflow Type" cellRender={({data}) => (
            <p>{data.workflowType()}</p>
          )} />
          <Column dataField="is_published" caption="Is Published" cellRender={({data}) => (
            <p>{data.isPublished() ? "Published" : "Unpublished"}</p>
          )} />
          <Column caption="Actions" cellRender={({data}) => (
            <Button onClick={(e) => {
              window.location.href = `${window.location.origin}/workflows/${data.id()}`
            }}>View Details</Button>
          )} />
        </DataGrid>

      </div>
    )
  }
}
