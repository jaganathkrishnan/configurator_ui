import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";


class AppDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appData: this.props.appData,
      allServices: this.props.allServices,
      show: true,
      closeAppDetails: this.props.closeAppDetails
    };
  }

  setliveDataKeyValue = (appDatakey, value) => {

    let { appData } = this.state;

    appData[appDatakey] = value

    console.log(appData)

    this.setState({
      appData
    })
  };

  closeModal = () => {
    this.state.closeAppDetails();
  }

  checkIfValid = (property) => {
    console.log(property)
    console.log(property === true ? true : (property === "true" ? true : false))
    console.log("-----------------------")
    return property === true ? true : (property === "true" ? true : false)
  }

  renderOptGroups = () => {
    let finalOptGroupList = [];
    const allServices = [...this.state.allServices];
    allServices.forEach((service) => {
      if (this.ifElegibleService(service)) {
        finalOptGroupList.push(
          <optgroup label={`${service.name}`}>
            {this.renderOptGroup(service)}
          </optgroup>
        );
        finalOptGroupList.push(<option disabled>──────────</option>);
      }
    })
    return finalOptGroupList;
  }

  ifElegibleService = (service) => {
    const web_app = this.state.appData.web_exists
    const mobile_app = this.state.appData.mobile_app_exists

    return (web_app && mobile_app) ? (service.is_web || service.is_app) : (web_app) ? (service.is_web) : (service.is_app)
  }

  isServiceAddedToApplication = (service, appData) => {
    return appData.full_services.includes(service.id)
  }

  getServiceObject = (serviceID) => {
    const { allServices } = this.state;
    for (let index = 0; index < allServices.length; index++) {
      const service = allServices[index]
      if (service.id == serviceID) {
        return {...service}
      }
    }
    return {}
  }

  addAllFeaturesExceptOne = (appData, service, featureID) => {
    let newFeatureIDList = [...appData.features]
    for (let index = 0; index < service.features.length; index++) {
      let featureId = service.features[index].id;
      if (featureId !== featureID) {
        newFeatureIDList.push(featureId);
      }
    }
    return [...newFeatureIDList];
  }

  checkIfWholeServiceToBeAdded = (appData, service, featureID) => {
    let appDataFeatureIDList = [...appData.features]
    for (let index = 0; index < service.features.length; index++) {
      let featureId = service.features[index].id;
      if (featureId !== featureID && !appDataFeatureIDList.includes(featureId)) {
        return false;
      }
      if (featureId === featureID && appDataFeatureIDList.includes(featureId)) {
        return false;
      }
    }
    return true;
  }

  selectUnselectFeature = (event) => {
    let [ serviceID, featureID ] = event.target.id.split("___")
    serviceID = parseInt(serviceID)
    featureID = parseInt(featureID)
    const service = this.getServiceObject(serviceID)
    let { appData } = this.state;
    if (appData.full_services.includes(serviceID)) {
      appData.full_services = appData.full_services.filter((element) => {return element !== serviceID})
      appData.features = this.addAllFeaturesExceptOne(appData, service, featureID)
    } else if (this.checkIfWholeServiceToBeAdded(appData, service, featureID)) {
      appData.features = this.removeFeatureIdsForWholeServiceAddition(appData, service);
      appData.full_services.push(serviceID)
    } else if (appData.features.includes(featureID)) {
      appData.features = appData.features.filter((element) => {return element !== featureID})
    } else {
      appData.features.push(featureID)
    }

    this.setState({
      appData
    })

  }

  removeFeatureIdsForWholeServiceAddition = (appData, service) => {
    const featureIDs = service.features.map((feature) => {return feature.id})
    return appData.features.filter((element) => {return !featureIDs.includes(element)})
  }

  selectUnselectAllFeatures = (event) => {
    const serviceId = parseInt(event.target.id);
    const { appData } = this.state;
    if (appData.full_services.includes(serviceId)) {
      appData.full_services = appData.full_services.filter((element) => {return element !== serviceId});
    } else {
      appData.full_services.push(serviceId);
      const service = this.getServiceObject(serviceId);
      appData.features = this.removeFeatureIdsForWholeServiceAddition(appData, service);
    }

    this.setState({
      appData
    })
  }

  renderSelectedFeatures = (service, appData, allSelected) => {
    let listOfFeaturesJsx = [];
    const featuresToBeChecked = appData.features;
    const allServices = allSelected ? true : false;
    service.features.forEach((feature) => {
      const toBeChecked = allServices ? true : featuresToBeChecked.includes(feature.id) ? true : false;
      listOfFeaturesJsx.push(
        <option id={`${service.id}___${feature.id}`} onClick={(e) => {this.selectUnselectFeature(e)}}>
          <input checked={toBeChecked} type="checkbox" id={`${feature.id}`} name={`${feature.id}`}/>
          <label for={`${feature.id}`}>{`${feature.name}`}</label>
        </option>
      )
    })
    listOfFeaturesJsx.push(
      <option id={`${service.id}`} onClick={(e) => {this.selectUnselectAllFeatures(e)}}>
          <input checked={allServices} type="checkbox"/>
          <label>Select all features of this service</label>
      </option>
    )
    return listOfFeaturesJsx;
  }

  renderOptGroup = (service) => {

    const appData = this.state.appData;

    return this.renderSelectedFeatures(service, appData, this.isServiceAddedToApplication(service, appData))
  }

  renderAppData = () => {

    const { appData } = this.state;

    return (
    <Modal show={this.state.show}>
      <Modal.Header>
        <Modal.Title>{appData.id ? "Update Application Configuration" : "Create new Application"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <Form>

          <Form.Group controlId="formBasicName">
            <Form.Label>Application Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Application Name"
              value={appData.name}
              onChange={(e) => this.setliveDataKeyValue("name", e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicDescription">
            <Form.Label>Application Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Application Description"
              value={appData.description}
              onChange={(e) => this.setliveDataKeyValue("description", e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicWebExists">
            <Form.Check
              inline
              label={`Web Application exists (on unchecking this, all services having only websites will no longer work for this application)`}
              type="checkbox"
              checked={this.checkIfValid(appData.web_exists)}
              onChange={(e) => this.setliveDataKeyValue("web_exists", !appData.web_exists)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicMobileAppExists">
            <Form.Check
              inline
              label={"Mobile Application exists (on unchecking this, all services having only mobile application will no longer work for this application)"}
              type="checkbox"
              checked={this.checkIfValid(appData.mobile_app_exists)}
              onChange={(e) => this.setliveDataKeyValue("mobile_app_exists", !appData.mobile_app_exists)}
            />
          </Form.Group>

          <Form.Group>
            <h5>
              Feature and Service selection
            </h5>
            <div>
              Services -
            </div>
            <Form.Control as="select" multiple>
              {this.renderOptGroups()}
            </Form.Control>
          </Form.Group>

        </Form>

      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" onClick={this.submitData}>Submit</Button>
        <Button variant="primary" onClick={this.closeModal}>Close</Button>
      </Modal.Footer>
      </Modal>
    )
  };

  submitData = () => {
    //TO-DO: Send route to backend and get list of apps response
    alert(`App successfully ${this.state.appData.id ? "updated" : "created"}`);
    window.location.reload();
  }

  render() {
    return (
      <React.Fragment>
        {this.renderAppData()}
      </React.Fragment>
    );
  }
}

export default AppDetails;
