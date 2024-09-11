import React, { Component } from 'react';
// import Diagram, { createSchema, useSchema } from 'beautiful-react-diagrams';
import 'beautiful-react-diagrams/styles.css';
import { Form, Tab, Button, Table } from 'semantic-ui-react';
import { Status } from '../../lib/StatusLib';
import StatusGraph from './GraphHooksNautanki';
// import RightSideFormLayout from '../../util_components/RightSideFormLayout';
import StatusForm from './StatusForm';
import { refreshPage } from '../../utils/Utils';
import { Variable } from '../../lib/VariableLib';
import VariableModal from './VariableModal';
import '../../styling/WorkflowStatus.css';
export default class Statuses extends Component {

  constructor(props){
    super(props)
    this.state = {
      selectedStatus: null,
      workflowObj: this.props.workflowObj,
      statuses: [],
      newStatusSelected: false,
      variableSelectedStatus: null,
      newVariable: new Variable(),
      selectedVariable: null,
    }
  }

  updateEditVariable = (selectedVariable) => {
    this.setState({
      selectedVariable,
    });
  }

  editStatusEnable = (selectedStatus) => {
    this.setState( {
      selectedStatus
    })
  }

  componentDidMount() {
    const { workflowObj } = this.state
    const statuses = [];
    const statusSet = new Set();
    const rootStatus = new Status(workflowObj.statuses[0], {x: 250, y: 60})
    this.graph = workflowObj.statuses;
    rootStatus.setStartStatusFlag();
    this.rootStatusId = rootStatus.id;
    statuses.push(rootStatus)
    statusSet.add(rootStatus.id)
    const statusObjs = [...this.breadthFirstSearch(statuses, statusSet)]
    this.setState({
      statuses: statusObjs,
      variableSelectedStatus: statusObjs[0]
    })
  }

  breadthFirstSearch = (statuses, statusSet) => {
    const queue = [...statuses];
    while(true) {
      const topStatus = queue[0];
      // console.log("topStatus - ")
      // console.log(topStatus)
      // console.log("--------------")
      topStatus.children.forEach((childObj) => {
        const childObjId = childObj.id
        if (!statusSet.has(childObjId)){
          const childStatus = new Status(this.graph.find((status) => status.id === childObjId), {x: topStatus.children.find((child) => child.id === childObjId).coordinates.x, y: topStatus.coordinates.y + 75})
          queue.push(childStatus)
          statuses.push(childStatus)
          statusSet.add(childObjId)
        }
      })
      queue.shift()
      if (queue.length === 0) {
        break;
      }
    }
    return statuses
  }

  closeForm = () => {
    const { newStatusSelected } = this.state;
    if (newStatusSelected) {
      this.setState({
        newStatusSelected: false
      })
    } else {
      this.setState({
        selectedStatus: null
      })
    }
  }

  handleSubmit = () => {

    const { workflowObj } = this.state;

    try {
      // if (workflowObj.id()) {
      //   workflowObj.updateObj();
      // } else {
      //   workflowObj.createObj();
      // }
      this.props.updateActivePaneIndex(2)

    } catch (error) {
      console.log(error)
    }
  }

  renderStatusGraphSchema = () => {
    const { statuses } = this.state
    const nodes = [];
    const links = [];
    statuses.forEach((status) => {
      nodes.push(status.generateDiagramJson({ updateFunctionCallback: this.editStatusEnable }));
      const statusLinks = status.generateLinks();
      statusLinks.forEach((status) => {
        links.push(status)
      })
    })

    const schema = {
      nodes,
      links
    }
    return (
      schema
    )
  }

  enableNewStatusAddition = () => {
    this.setState({
      newStatusSelected: true
    })
  }

  renderAddNewNodeButton = () => {
    return (
      <div>
        <Button className='add-new-status-button' onClick={this.enableNewStatusAddition}>Add a new Status</Button>
      </div>
    )
  }

  generateTabAndPanes = (tabPaneContent, status) => {
    const tabs = [];
    tabPaneContent.forEach((tabContent) => {
      tabs.push(
        {
          menuItem: tabContent.menuItem,
          render: () => {
            return (
              <Tab.Pane>
                {tabContent.render}
              </Tab.Pane>
            )
          }
        }
      )
    })
    return (
      <div>
        <Tab panes={tabs} activeIndex={status.activePaneIndex} onTabChange={status.changeDetailsPaneIndex}/>
      </div>
    )
  }

  renderForm = () => {
    const { newStatusSelected, selectedStatus, workflowObj } = this.state;
    console.log("selectedStatus -")
    console.log(selectedStatus)
    console.log("---------")
    return (
      <>
        <StatusForm fetchWorkflow={this.props.fetchWorkflow} workflowId={workflowObj.id()} statusObj={newStatusSelected ? new Status({}, {}) : selectedStatus} closeForm={this.closeForm} rootStatusId={this.rootStatusId}/>
      </>
    )
  }

  renderStatusSelectionDropdown = () => {
    const statusList = []
    this.state.statuses.forEach((status) => {
      statusList.push(<option key={status.id} value={status.id}>{status.name()}</option>)
    })

    return statusList
  }

  changeSelectedStatus = (event) => {
    this.setState({
      variableSelectedStatus: this.state.statuses.find((status) => status.id === event.target.value),
      newVariable: new Variable()
    })
  }

  addNewVariable = () => {
    const { newVariable, variableSelectedStatus } = this.state;
    variableSelectedStatus.createVariable(newVariable)

    this.setState({
      variableSelectedStatus: variableSelectedStatus.clone(),
      newVariable: new Variable()
    })
  }

  render() {
    const { newStatusSelected, selectedStatus, newVariable, variableSelectedStatus, selectedVariable } = this.state;
    console.log("Statuses - ")
    console.log(this.state.statuses)
    console.log("-------------------------")
    const schema = (this.renderStatusGraphSchema())
    // console.log("Bloddy state - ")
    // console.log(this.state)
    // console.log("Schema - ")
    // console.log(schema)
    // console.log("---------------------------------------")
    return (
      <>
      <h3>Statuses</h3>

      {(newStatusSelected || selectedStatus) && this.renderForm()}
      {this.renderAddNewNodeButton()}
      {schema.nodes.length > 0 && (
        <StatusGraph nodes={schema.nodes} links={schema.links} />
      )}

      <div className="status-variable-form">
        <Form>
        <Form.Field>
          <label>Select Status</label>
          <select onChange={(event) => this.changeSelectedStatus(event)}>
          {this.renderStatusSelectionDropdown()}
          </select>
        </Form.Field>


        <h3>Selected Status New Variable Addition</h3>
        <Form.Field>
          <label>New Variable Name</label>
          <input
          type="text"
          value={newVariable.name}
          onChange={(e) => {
            const { newVariable } = this.state;
            newVariable.setName(e.target.value)
            this.setState({ newVariable: newVariable })
          }}
          />
        </Form.Field>

        <Form.Field>
          <label>New Variable Description</label>
          <textarea
          value={newVariable.description}
          onChange={(e) => {
            const { newVariable } = this.state;
            newVariable.setDescription(e.target.value)
            this.setState({ newVariable: newVariable })
          }}
          />
        </Form.Field>

        <Form.Field>
        <label>New Variable Data Type</label>
          <select
          value={newVariable.dataType}
          onChange={(e) => {
            const updatedVariable = { ...newVariable, dataType: e.target.value };
            const { newVariable, variableSelectedStatus } = this.state;
            newVariable.setDataType(variableSelectedStatus)
            newVariable.setDescription(e.target.value)
            this.setState({ newVariable: newVariable })
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

        <Button onClick={this.addNewVariable}>Add New Variable</Button>

        <Form.Field>
          {variableSelectedStatus && variableSelectedStatus.variables && variableSelectedStatus.variables.length > 0 ? (
          <h3 style={{ margin: '10px' }}>Selected Status Existing Variables</h3>
          ) : (
          <></>
          )}
          {variableSelectedStatus &&
          variableSelectedStatus.variables ?
          <Table>
            <tr>
              <th>Variable Name</th>
              <th>Actions</th>
            </tr>
            {variableSelectedStatus.variables.map((variable) => (
              <tr key={variable.name}>
              <td>{variable.name}</td>
              <td>
              
                <Button onClick={() => this.updateEditVariable(variable)} >Edit</Button>
                <Button>Delete</Button>
              </td>
              </tr>
            ))}
          </Table> : <></>
          }
        </Form.Field>
        </Form>
      </div>

      <Form onSubmit={this.handleSubmit}>
        <Button className="savebutton" type="submit">Save and move to next step</Button>
      </Form>
      <style>
        {`
        table {
          border: 1px solid black;
        }
        `}
      </style>
      { selectedVariable ? <VariableModal selectedVariable={selectedVariable} variableSelectedStatus={variableSelectedStatus} closeModal={() => this.updateEditVariable(null)} /> : <> </> }
      </>
    );
  }
}
