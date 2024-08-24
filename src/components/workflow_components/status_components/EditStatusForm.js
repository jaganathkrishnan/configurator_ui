import React, { Component } from 'react';
import { Form, Input, Dropdown, Label, Button } from 'semantic-ui-react';
import { Table } from 'semantic-ui-react';

export default class EditStatusForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rootStatusId: this.props.rootStatusId,
      originalStatusObj: this.props.statusObj,
      statusObj: this.props.statusObj,
      workflowId: this.props.workflowId,
      eligibleParentStatuses: [],
      eligibleChildrenStatuses: [],
      newParent: null,
      newChild: null
    }
  }

  async getEligibleParentAndChildrenStatuses() {
    const { workflowId, rootStatusId, statusObj } = this.state;

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
        }).filter((status) => status["key"] !== statusObj.id)

        const eligibleChildrenStatuses = result["data"].filter((status) => status.id !== rootStatusId).map((status) => {
          return {
            key: status["id"],
            text: status["label"],
            value: status["id"]
          }
        }).filter((status) => status["key"] !== statusObj.id)

        this.setState({
          eligibleParentStatuses,
          eligibleChildrenStatuses
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
        }).filter((status) => status["key"] !== statusObj.id)

        const eligibleChildrenStatuses = result["data"].filter((status) => status.id !== rootStatusId).map((status) => {
          return {
            key: status["id"],
            text: status["label"],
            value: status["id"]
          }
        }).filter((status) => status["key"] !== statusObj.id)

        this.setState({
          eligibleParentStatuses,
          eligibleChildrenStatuses
        })

      console.log(error)
    }
  }

  componentDidMount() {
    this.getEligibleParentAndChildrenStatuses()
  }

  handleLabelValueChange = (event) => {
    const { value } = event.target;
    const { statusObj } = this.state;
    statusObj.setLabel(value);
    this.setState({
      statusObj
    })
  }

  editStatusName = (event) => {
    event.preventDefault();
    const { statusObj } = this.state;
    statusObj.editStatusName();
  }

  //generate code to add one section for name update, another for status variables create/edit and another section for editing parent status and another section for editing/adding children statuses

  handleParentStatusChange = (e, { name, value }) => {
    //it should update parent status id in the status object
    // const { statusObj } = this.state;
    this.setState({
      newParent: value
    })
  }

  editParentStatus = (event) => {
    event.preventDefault();
    const { statusObj, originalStatusObj, newParent } = this.state;
    const ifSuccess = statusObj.editParentStatus(newParent);
    if (ifSuccess === true) {
      this.setState({
        statusObj,
        originalStatusObj: statusObj,
        newParent: null
      })
    } else {
      alert("Parent status update failed")
      this.setState({
        statusObj: originalStatusObj,
        newParent: null
      })
    }
  }

  editChildStatus = (event) => {
    event.preventDefault();
    const { statusObj, originalStatusObj, newChild } = this.state;
    const ifSuccess = statusObj.editChildStatus(newChild);

    if (ifSuccess === true) {
      this.setState({
        statusObj,
        originalStatusObj: statusObj,
        newChild: null
      })
    } else {
      alert("Child status update failed")
      this.setState({
        statusObj: originalStatusObj,
        newChild: null
      })
    }
  }

  handleChildStatusChange = (e, { name, value }) => {
    //it should update child status id in the status object
    this.setState({
      newChild: value
    })
  }

  render() {

    const { eligibleParentStatuses, eligibleChildrenStatuses, statusObj } = this.state;
    const eligibleNewParentStatuses = eligibleParentStatuses.filter((status) => !statusObj.parentIds.includes(status["key"]))
    const eligibleNewChildrenStatuses = eligibleChildrenStatuses.filter((status) => !statusObj.childrenIds.includes(status["key"]));

    console.log("eligibleParentStatuses", eligibleParentStatuses)
    console.log("eligibleChildrenStatuses", eligibleChildrenStatuses)
    return (
      <Form className="add-status-form">
        <Form.Group>
          <label style={{"marginRight": "15px"}}>
            {"Status Label"}
          </label>
          <Input requied onChange={(event) => this.handleLabelValueChange(event)} value={this.state.statusObj.content}>
          </Input>
          <Button style={{"marginLeft": "400px"}} onClick={this.editStatusName}>Edit Status Name</Button>
        </Form.Group>

        {/* TO-DO: Make a border around the given sections for parent statuses */}
        {
          !statusObj.startStatus && statusObj.parentIds.length > 0 ? (
          <>
            <Form.Group>
              <label>Current Parent Statuses </label>
            </Form.Group>
            <Form.Group>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Parent Status</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {statusObj.parentIds.map((parentId, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{eligibleParentStatuses.find(status => status.key === parentId)?.text}</Table.Cell>
                      <Table.Cell>
                        <Button className="delete-button" onClick={() => this.deleteParentStatus(index)}>Delete</Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Form.Group>
            {(eligibleNewParentStatuses.length > 0) ? (
              <>
                <Form.Group>
                  <label>Add new parent status </label>
                </Form.Group>
                <Form.Group>
                  <Dropdown
                    placeholder='Select New Parent Status'
                    fluid
                    selection
                    options={eligibleNewParentStatuses}
                    onChange={(e, { name, value }) => this.handleParentStatusChange(e, { name, value })}
                  />
                </Form.Group>
                <Button onClick={this.editParentStatus}>Add Parent Status</Button>
              </>
            ) : <></>}

          </>) : <></>
        }
        <br></br>
        {/* TO-DO: Make a border around the given sections for parent statuses */}
        {
          statusObj.children.length > 0 ? (
          <>
            <Form.Group>
              <label>Current Child Statuses </label>
            </Form.Group>
            <Form.Group>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Child Status</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {eligibleChildrenStatuses.length > 0 && statusObj.children.map((child, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{eligibleChildrenStatuses.find(status => status.key === child.id)?.text}</Table.Cell>
                      <Table.Cell>
                        <Button className="delete-button" onClick={() => this.deleteChildStatus(index)}>Delete</Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Form.Group>

          </>) : <></>
        }
        {eligibleNewChildrenStatuses.length > 0 ? (
          <>
            <Form.Group>
              <label>Add new child status </label>
            </Form.Group>
            <Form.Group>
              <Dropdown
                placeholder='Select New Child Status'
                fluid
                selection
                options={eligibleNewChildrenStatuses}
                onChange={(e, { name, value }) => this.handleChildStatusChange(e, { name, value })}
              />
            </Form.Group>

            <Button onClick={this.editChildStatus}>Add Child Status</Button>
          </>
        ) : <></>}


      </Form>
    )
  }
}
