import React, { Component } from 'react';
import { Form, Input, Dropdown, Label, Button } from 'semantic-ui-react';

export default class AddStatusForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      statusObj: this.props.statusObj,
      workflowId: this.props.workflowId,
      eligibleParentStatuses: []
    }
  }

  async getEligibleParentStatuses() {
    const { workflowId } = this.state;

    try {
      if (!localStorage.getItem('apartix_session_id')) {
        return;
      }
      const response = await fetch(`http://localhost:1001/workflows/${workflowId}/status_list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}` // Replace with your actual token or header value
        }
      });
      const result = await response.json();
      if (response.ok) {
        const eligibleParentStatuses = result["data"].map((status) => {
          return {
            key: status["id"],
            text: status["label"],
            value: status["id"]
          }
        })
        this.setState({
          eligibleParentStatuses
        })
      } else {
        throw response
      }
    } catch(error) {
      const result = {"data":[{"id":2,"label":"Start","google_form_id":"","created_at":"2024-06-21T18:38:49.329Z","updated_at":"2024-08-17T06:33:08.850Z","api_name":"sample_start_1718995129"},{"id":7,"label":"Second Status","google_form_id":"","created_at":"2024-07-23T12:11:05.159Z","updated_at":"2024-08-01T11:43:23.715Z","api_name":"New Status_1721736665"},{"id":8,"label":"Status 3","google_form_id":"","created_at":"2024-08-01T16:07:52.016Z","updated_at":"2024-08-01T16:07:52.016Z","api_name":"Status 3_1722528472"},{"id":9,"label":"Status 4","google_form_id":"","created_at":"2024-08-03T08:18:24.897Z","updated_at":"2024-08-03T08:18:24.897Z","api_name":"Status 4_1722673104"},{"id":10,"label":"Status 5","google_form_id":"","created_at":"2024-08-17T05:22:45.466Z","updated_at":"2024-08-17T05:22:45.466Z","api_name":"Status 5_1723872165"}]};
        const eligibleParentStatuses = result["data"].map((status) => {
          return {
            key: status["id"],
            text: status["label"],
            value: status["id"]
          }
        })
        this.setState({
          eligibleParentStatuses
        })
      console.log(error)
    }
  }

  componentDidMount() {
    this.getEligibleParentStatuses()
  }

  handleLabelValueChange = (event) => {
    const { value } = event.target;
    this.newValueLabelValue = value;
  }

  handleParentStatusChange = (e, { name, value }) => {
    this.parentStatusId = value;
  }

  createStatus = (event) => {
    event.preventDefault();
    const { statusObj } = this.state;
    statusObj.createStatus(this.parentStatusId, this.newValueLabelValue)
  }

  render() {

    const { eligibleParentStatuses } = this.state;

    return (
      <Form className="add-status-form">
        <Form.Group>
          <label style={{"marginRight": "15px"}}>
            {"Status Label"}
          </label>
          <Input requied onChange={(event) => this.handleLabelValueChange(event)}>
          </Input>
        </Form.Group>

        {
          eligibleParentStatuses.length > 0 ? (
          <>
            <Form.Group>
              <label>Parent Status </label>
            </Form.Group>
            <Form.Group>
              <Dropdown
              placeholder='Select Parent Status'
              fluid
              selection
              options={eligibleParentStatuses}
              onChange={(e, { name, value }) => this.handleParentStatusChange(e, { name, value })}
            />
            </Form.Group>
            <Button onClick={this.createStatus}>Create Status</Button>
          </>) : <></>
        }

      </Form>
    )
  }
}
