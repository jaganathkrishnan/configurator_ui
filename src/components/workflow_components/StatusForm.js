import React, { Component } from 'react'
import RightSideFormLayout from '../../util_components/RightSideFormLayout'
import AddStatusForm from './status_components/AddStatusForm'
import EditStatusForm from './status_components/EditStatusForm'

export default class StatusForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      statusObj: this.props.statusObj,
      workflowId: this.props.workflowId,
      newStatus: this.props.statusObj.id ? false : true
    }
    this.closeForm = this.props.closeForm;
  }

  formComponent = () => {

    const { newStatus, statusObj, workflowId } = this.state;

    return newStatus ? <AddStatusForm workflowId={workflowId} statusObj={statusObj} /> : <EditStatusForm statusObj={statusObj} />;
  }

  render() {

    const { newStatus, statusObj } = this.state

    return (
      <>
        <RightSideFormLayout formTitle={newStatus ? "Add new status" : `Edit ${statusObj.name} status`} formComponent={this.formComponent()} onClose={this.closeForm} onBlur={this.closeForm}/>
      </>
    )
  }
}
