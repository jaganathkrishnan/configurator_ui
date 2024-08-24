import React, { Component } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';

export default class VariableModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedVariable: this.props.selectedVariable,
      variableSelectedStatus: this.props.variableSelectedStatus
    }
  }

  render() {
    const { selectedVariable } = this.state;

    return (
      <Modal open={selectedVariable !== null} id="variable-centered-modal" style={{
        "marginLeft": "15%",
        "marginTop": "10%",
        "height": "70%"
      }}>
        <Modal.Header>Edit Variable</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Variable Name</label>
              <input
              type="text"
              value={selectedVariable.name}
              onChange={(e) => {
                const { selectedVariable } = this.state;
                selectedVariable.setName(e.target.value)
                this.setState({ selectedVariable: selectedVariable })
              }}
              />
            </Form.Field>

            <Form.Field>
              <label>Variable Description</label>
              <textarea
              value={selectedVariable.description}
              onChange={(e) => {
                const { selectedVariable } = this.state;
                selectedVariable.setDescription(e.target.value)
                this.setState({ selectedVariable: selectedVariable })
              }}
              />
            </Form.Field>

            <Form.Field>
              <label>Variable Data Type</label>
                <select
                value={selectedVariable.dataType}
                onChange={(e) => {
                  const { selectedVariable } = this.state;
                  selectedVariable.setDataType(e.target.value)
                  this.setState({ selectedVariable: selectedVariable })
                }}
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="date_time">DateTime</option>
                  <option value="select">Select</option>
                  <option value="select_boxes">Select boxes</option>
                  <option value="radio">Radio</option>
                  <option value="checkboxes">Checkboxes</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                </select>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button>Save Changes</Button>
          <Button onClick={this.props.closeModal}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
