import axios from 'axios';
import { Variable } from './VariableLib';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import { refreshPage } from '../utils/Utils';

export class Status {
  constructor(params, coordinates) {
    if (!params.children) {
      params.children = []
    }
    if (!params.self_occuring_conditions) {
      params.self_occuring_conditions = []
    }

    this.id = params.id
    this.content = params.label
    this.api_name = params.api_name
    this.variables = params.variables ? params.variables.map((variable) => new Variable(this, variable.name, variable.description, variable.datatype, variable.api_name, variable.id)) : []
    this.status_level_actions = params.status_level_actions
    this.self_occuring_conditions = params.self_occuring_conditions
    this.setChildrenStatuses(params, coordinates);
    this.setParentStatuses(params);
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

  setChildrenStatuses(params, coordinates) {
    const childrenList = [];
    this.childrenIds = [];
    const noOfChildren = params.children.length;
    if (noOfChildren > 0) {
        params.children.forEach((child, index) => {
        this.childrenIds.push(child.id)
        const x = Number(((index + 1)/(noOfChildren)).toFixed(2)) * 250;
        childrenList.push(new Status(child, {
          x,
          y: coordinates.y + 75
        }))
      })
    }
    this.children = [...childrenList]
  }

  setParentStatuses(params) {
    this.parentIds = this.self_occuring_conditions.length > 0 ? this.self_occuring_conditions.map((link) => link.parent_id) : []
  }

  setStartStatusFlag() {
    this.startStatus = true
  }

  editParentStatus = (newParent) => {
    let result = true;
    axios.put("http://localhost:1001/condition_status_linking", {
      "id": this.id,
      "parent_status": {
        "id": newParent
      },
      "condition": {
        "rule": "[]"
      },
      "child_status": {
        "id": this.id
      }
    }, {
      headers: this.generateHeaders()
    }).then((response) => {
      alert("Parent status updated successfully")
      result = true;
    }).catch((error) => {
      result = false;
      //TO-DO: handle error
      console.log(error)
    })
    return result;
  }

  editChildStatus(newChild) {
    let result = true;
    axios.put("http://localhost:1001/condition_status_linking", {
      "id": this.id,
      "parent_status": {
        "id": this.id
      },
      "condition": {
        "rule": "[]"
      },
      "child_status": {
        "id": newChild
      }
    }, {
      headers: this.generateHeaders()
    }).then((response) => {
      alert("Child status updated successfully");
      result = true;
    }).catch((error) => {
      result = false;
      //TO-DO: handle error
      console.log(error);
    });
    return result;
  }

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
    }).catch((error) => {
      console.log(error)
    })
  }

  editStatusName() {
    axios.patch("http://localhost:1001/status", {
      "id": this.id,
      "label": this.content
    }, {
      headers: this.generateHeaders()
    }).then((response) => {
      alert("Status name updated successfully")
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
        // console.log("Click hits")
        updateFunctionCallback(this)
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
        output: `${childLink.id}`,
        label: `Link from ${this.content} to ${childLink.content}`,
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

  isEqlToStatus(status) {
    return this.id === status.id
  }

  generateHeaders(){
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}`
    }
  }

  setLabel(value) {
    this.content = value;
  }

  name() {
    return this.content;
  }

  createVariable(variable) {
    if (variable.createOrUpdateVariable(this.id)) {
      this.variables.push(variable)
    }
  }

  clone() {
    const clonedStatus = new Status({
      id: this.id,
      label: this.content,
      api_name: this.api_name,
      variables: this.variables,
      status_level_actions: this.status_level_actions,
      self_occuring_conditions: this.self_occuring_conditions,
      children: this.children,
    }, this.coordinates)
    if (this.startStatus) {
      clonedStatus.setStartStatusFlag(this.startStatus)
    }
    return clonedStatus
  }

}
