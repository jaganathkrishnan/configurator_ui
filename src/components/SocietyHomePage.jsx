import React, { Component } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { validImageExtensionCheck, validImageFileSize } from './../utils/Utils.jsx'
import authenticationChecker from './../hoc/AuthenticationChecker.jsx'

class SocietyHomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originalData: {},
      liveData: {},
      loading: true
    };
  }

  getSocietyData = () => {
    //TO-DO: Hit backend to get data for tenant
    return {
      "name": "sample_society",
      "aoa_number": "sample_aoa_number_123",
      "society_logo_file_upload": "sample file 1234"
    };
  }

  setliveDataKeyValue = (key, value) => {
    this.setState({
      [key]: value
    })
  };

  componentDidMount() {
    const societyData = this.getSocietyData();
    this.setState({
      originalData: {...societyData},
      liveData: {...societyData},
      loading: false
    })
  }

  renderLiveData = () => {
    const { name, aoa_number, society_logo_file_upload } = this.state.liveData;

    return (
      <React.Fragment>
        <Container>
        <Row className="justify-content-center mt-5">
          <Col xs={6}>
            <h1>Welcome to Our Website</h1>
              <Form>

              <Form.Group controlId="formBasicname">
                  <Form.Label>Apartment Owners Association (AOA) Registration Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Apartment Owners Association (AOA) Registration Number"
                    value={name}
                    onChange={(e) => this.setliveDataKeyValue("name", e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicaoaNumber">
                  <Form.Label>Apartment Owners Association (AOA) Registration Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Apartment Owners Association (AOA) Registration Number"
                    value={aoa_number}
                    onChange={(e) => this.setliveDataKeyValue("aoa_number", e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicsocietyLogoFileUpload">
                  <Form.Label>
                    Society Logo { society_logo_file_upload ? "(File already uploaded!!!! Click Browse to replace uploaded logo)" : "" }
                  </Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => this.saveLogoFileInFrontend(e.target.files[0])}
                  />
                </Form.Group>

                <Button variant="primary" style={{"marginTop": "15px"}} onClick={this.submitSocietyData}>
                  { this.state.originalData.name ? "Update details" : "Add details" }
                </Button>{' '}
              </Form>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  };

  fileHasError(fileObj) {
    const message = validImageExtensionCheck(fileObj) ? (validImageFileSize(fileObj, 5) ? "" : "File size is too big. Max allowed file size is 5 MB") : "Extension is wrong. Allowed extensions are .png, .jpg, .jpeg";
    return message.length === 0 ? { status: false } : { status: true, message }
  }

  saveLogoFileInFrontend(fileObj) {
    const error = this.fileHasError(fileObj);

    if (error.status) {
      alert(error.message);
    } else {
      let newLiveData = {...this.state.liveData};
      newLiveData["society_logo_file_upload"] = fileObj;

      this.setState({
        liveData: newLiveData
      })
    }
  }

  navigateToAppsPage = () => {
    window.location.href = '/apps';
  }

  sendLiveDataToBackend() {
    //TO-DO: Send actual data to backend and return response
    const liveData = {...this.state.liveData};
    return {
      data: {
        "name": liveData["name"],
        "aoa_number": liveData["aoa_number"],
        "society_logo_file_upload": liveData["society_logo_file_upload"]
      }
    }

  }

  submitSocietyData = () => {
    const response = this.sendLiveDataToBackend();
    this.setState({
      originalData: {...response.data},
      liveData: {...response.data}
    });
    alert("Data succesfully updated");
  }

  render() {

    const { loading } = this.state;

    return (
      <React.Fragment>
        { loading ? <p>Loading Data</p> : this.renderLiveData()}
        <Button variant="primary" style={{"marginTop": "15px", "marginLeft": "30%"}} onClick={this.navigateToAppsPage} >
          Proceed to create/update apps for the society
        </Button>
      </React.Fragment>
    );
  }
}

export default authenticationChecker(SocietyHomePage);
