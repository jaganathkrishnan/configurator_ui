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
    console.log(eligibleParentStatuses)
    console.log("--------------------")

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
