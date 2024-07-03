import React, { Component } from 'react'
import { Workflow } from '../../lib/WorkflowLib';
import { Form, Button, Checkbox, Dropdown } from 'semantic-ui-react';

export default class WorkflowDetails extends Component {

  constructor(props) {
    super(props)
    this.state = {
      workflowObj: this.props.workflowObj ? this.props.workflowObj : Workflow.generateEmptyWorkflowObject(),
      chatbots: this.props.chatbots
    }
    debugger;
  }

  chatBotDropdownOptions = () => {
    const { chatbots } = this.props;

    const dropdownOptions = [];
    chatbots.forEach(
      (chatbot) => dropdownOptions.push(
        {
          key: chatbot.id(),
          text: chatbot.name(),
          value: chatbot.id()
        }
      )
    )
    return dropdownOptions
  }

  handleChange = (e, { name, value }) => {
    const { workflowObj } = this.state;
    workflowObj.setMetadataValue(name, value)
    this.setState({
      workflowObj
    })
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    const { workflowObj } = this.state;
    workflowObj.setMetadataValue(name, value)
    this.setState({
      workflowObj
    })
  }

  handleSubmit = () => {

    const { workflowObj } = this.state;

    try {
      workflowObj.createObj();
    } catch (error) {
      console.log(error)
    }
  }

  renderForm = () => {
    const { workflowObj } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Field required>
          <label>Workflow Name</label>
          <input
            required={true}
            placeholder='Workflow Name'
            name='name'
            value={workflowObj.name()}
            onChange={this.handleInputChange}
          />
        </Form.Field>
        <Form.Field required>
          <label>Workflow Type</label>
          <input
            disabled={true}
            placeholder='Worfklow Type'
            name='workflow_type'
            value={workflowObj.workflowType() || "default"}
            onChange={this.handleInputChange}
          />
        </Form.Field>
        <Form.Field required>
          <label>Linked Chat Bot</label>
          <Dropdown
            required={true}
            placeholder='Select an option'
            fluid
            selection
            options={this.chatBotDropdownOptions()}
            name='chat_bot_id'
            value={workflowObj.chatBotId()}
            onChange={(e, { name, value }) => this.handleChange(e, { name, value })}
          />
        </Form.Field>
        <Form.Field required>
          <Checkbox
            required={true}
            label='Is it ready to use?'
            name='is_published'
            checked={workflowObj.isPublished()}
            onChange={(e, { name, checked }) => this.handleChange(e, { name, value: checked })}
          />
        </Form.Field>
        <Button type='submit'>Save and move to next step</Button>
      </Form>
    )
  }

  render() {
    return (
      <div>
        <h3>
          Initial Details
          {this.renderForm()}
        </h3>
      </div>
    )
  }
}
