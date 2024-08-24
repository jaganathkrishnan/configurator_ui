import axios from 'axios';
import { refreshPage } from '../utils/Utils';

export class Variable {
  constructor(statusObj=null, name=null, description=null, datatype="text", apiName=null, id=null) {
    this.statusObj = statusObj;
    this.name = name;
    this.description = description;
    this.dataType = datatype;
    this.options = [];
    this.apiName = apiName;
    this.id = id;
  }

  setStatusObj(statusObj) {
    this.statusObj = statusObj;
  }
  setName(name) {
    this.name = name;
  }

  setDescription(description) {
    this.description = description;
  }

  addOption(newOption) {
    this.options.push(newOption);
  }

  editOption(index, newOption) {
    this.options[index] = newOption;
  }

  deleteOption(index) {
    this.options.splice(index, 1);
  }

  setDataType(datatype) {
    this.dataType = datatype;
  }

  createOrUpdateVariable = (statusId) => {
    const payload = {
      "status_variable": {
        "name": this.name,
        "description": this.description,
        "datatype": this.dataType,
        "options": JSON.stringify(this.options)
      }, "status": {
        "id": statusId
      }
    }

    try {
      axios.put("http://localhost:1001/status_variables", payload, {
        headers: this.generateHeaders()
      }).then((response) => {
        //TO-DO: Correct the response handling
        if (response.status === 201) {
          console.log("status variable creation response")
          console.log(response)
          refreshPage()
          this.apiName = response.data.apiName
          return true
        } else {
          throw response.json()
        }
      })
    } catch(error) {
      console.log(error)
      return false
    }
  }

  generateHeaders(){
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('apartix_session_id')}`
    }
  }
}
