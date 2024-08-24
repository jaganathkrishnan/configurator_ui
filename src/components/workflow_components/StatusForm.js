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
    const { rootStatusId } = this.props;

    return newStatus ? <AddStatusForm fetchWorkflow={this.props.fetchWorkflow} workflowId={workflowId} statusObj={statusObj} /> : <EditStatusForm fetchWorkflow={this.props.fetchWorkflow} workflowId={workflowId} statusObj={statusObj} rootStatusId={rootStatusId} />;
  }

  render() {

    const { newStatus, statusObj } = this.state

    return (
      <>
        <RightSideFormLayout formTitle={newStatus ? "Add new status" : `Edit ${statusObj.content} status`} formComponent={this.formComponent()} onClose={this.closeForm} onBlur={this.closeForm}/>
      </>
    )
  }
}
