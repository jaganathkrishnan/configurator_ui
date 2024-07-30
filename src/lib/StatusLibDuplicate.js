import axios from 'axios';
import { Form, Label, Tab, Input, Dropdown, Button } from 'semantic-ui-react';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import { refreshPage } from '../utils/Utils';

export class Status {
  constructor(params, coordinates) {
    this.id = params.id
    this.content = params.label
    this.api_name = params.api_name
    this.variables = params.variables
    this.status_level_actions = params.status_level_actions
    this.self_occuring_conditions = params.self_occuring_conditions
    const childrenList = [];
    const noOfChildren = params.children.length;
    if (noOfChildren > 0) {
        params.children.forEach((child, index) => {
        const x = Number(((index + 1)/(noOfChildren)).toFixed(2)) * 250;
        childrenList.push(new Status(child, {
          x,
          y: coordinates.y + 75
        }))
      })
    }

    this.children = [...childrenList]
    this.coordinates = coordinates
    this.activePaneIndex = 0
    // this.heightPercentage = null
    // this.indexPercentageInRow = null
  }

  // setHeightPercentageAndIndexPercentageInRow(heightPercentage, indexPercentage) {
  //   this.heightPercentage = heightPercentage
  //   this.indexPercentageInRow = indexPercentage
  //   this.coordinates = [, ]
  // }

  createStatus(parentStatusId, newValueLabelValue) {
    axios.post("http://localhost:1001/status_linking", {
      "parent_status": {
        "id": parentStatusId
      },
      "condition": {
        "rule": "[]"
      },
      "child_status": {
        "label": newValueLabelValue,
        "google_form_id": ""
      }
    }, {
      headers: this.generateHeaders()
    }).then((response) => {
      refreshPage();
      // if (response.ok) {
      //   refreshPage();
      // } else {
      //   throw response.json()
      // }
    }).catch((error) => {
      console.log(error)
    })
  }

  label() {
    return this.content;
  }

  generateDiagramJson(callbackFunctionMap) {
    // console.log("____________________________")
    // console.log([this.coordinates.x, this.coordinates.y])
    // console.log("____________________________")
    return { id: `${this.id}`, content: this.contentComponent(callbackFunctionMap), coordinates: [this.coordinates.x, this.coordinates.y] }
  }

  contentComponent = (callbackFunctionMap) => {
    const { updateFunctionCallback } = callbackFunctionMap
    return (
      <div
      style={{
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
        cursor: 'pointer'
      }}
      onClick={() => {
        console.log("Click hits")
        // updateFunctionCallback(this)
      }}
    >
      {this.content}
    </div>
    )
  }

  generateLinks() {
    const links = [];
    this.children.forEach((childLink) => {
      links.push({
        input: `${this.id}`,
        output: `${childLink.id}`
      })
    })
    return links;
  }

  changeDetailsPaneIndex = (e, { activeIndex }) => {
    this.activePaneIndex = activeIndex ;
  };

  linkFormDetails = () => {
    const dataSource = []
    this.children.forEach((child) => {
      dataSource.push(
        {
          id: child.id,
          name: child.label,
        }
      )
    })
    return (
      <DataGrid dataSource={dataSource}>
        <Column caption="Status" field={"name"}/>
        <Column caption="Actions" field={"id"}/>
      </DataGrid>
    )
  }

  handleParentStatusChange(e, { value }) {
    this.newParentStatusId = value
  }

  linkToParentStatus() {
    console.log("Hitting here")
  }

  newLinkFormDetails() {
    //get eligible parent statuses
    const parentStatuses = this.getEligibleParentStatuses();
    return (
      <>
      <Label>Parent Status </Label>
      <Dropdown
        placeholder='Select Parent Status'
        fluid
        selection
        options={parentStatuses}
        onChange={this.handleParentStatusChange}
      />
      <Button onClick={this.linkToParentStatus}>Link to Parent Status</Button>
      </>
    )
    //render dropdown
  }

  generateDetailsFormPanes(workflowId) {
    console.log(workflowId)
    this.workflowId = workflowId;
    return [
      {
        menuItem: "Simple details",
        render: (
            <Form>
              <Form.Group>
                <label style={{"margin": "15px"}}>
                  {"Status Label"}
                </label>
                <Input requied onChange={(event) => this.handleApiNameChange(event)}>
                </Input>
              </Form.Group>
            </Form>
          )
      }, {
        menuItem: `Links to ${this.id ? "next statuses" : "parent status"}`,
        render: (
          <Form>
            <Form.Group>
              {this.id ? this.linkFormDetails() : this.newLinkFormDetails()}
            </Form.Group>
          </Form>
        )
      }
    ]
  }

  generateDetailsForm() {
    return <>
      <div>
        <Tab panes={this.generateDetailsFormPanes} activeIndex={this.activePaneIndex} onTabChange={this.changeDetailsPaneIndex}/>
      </div>
    </>
  }

  generateHeaders(){
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}`
    }
  }
}
