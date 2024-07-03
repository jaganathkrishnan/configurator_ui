import axios from 'axios';

export class Workflow {

  static generateEmptyWorkflowObject() {
    const metadata = {
      id: null,
      name: null,
      start_status_label: null,
      chat_bot_id: null,
      is_published: false
    }
    const statuses = []
    const workflowActions = []
    const workflowVariables = []
    return new Workflow(metadata, statuses, workflowActions, workflowVariables);
  }

  constructor(metadata, statuses, workflowActions, workflowVariables) {
    this.metadata = metadata
    this.statuses = statuses
    this.workflowActions = workflowActions
    this.workflowVariables = workflowVariables
  }

  setMetadataValue(key, value) {
    this.metadata[key] = value
  }

  id() {
    return this.metadata.id
  }

  name() {
    return this.metadata.name
  }

  workflowType() {
    return this.metadata.workflow_type
  }

  isPublished() {
    return this.metadata.is_published.toString() === "true"
  }

  startStatus() {
    return this.metadata.start_status_label
  }

  chatBotId(){
    return this.metadata.chat_bot_id
  }

  createObj() {
    const payload = {
      workflow: {
        name: this.name(),
        type: "default",
        is_published: this.isPublished(),
        chat_bot_id: this.chatBotId(),
        start_status: {
          label: "Start",
          google_form_id: ""
        }
      }
    }
    try {
      axios.post("http://localhost:1001/workflow", payload, {
        headers: this.generateHeaders()
      }).then((response) => {
        if (response.ok) {
          return true
        } else {
          throw response.json()
        }
      })
    } catch(error) {
      throw error
    }
  }

  generateHeaders(){
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}`
    }
  }

}
