import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap';

class AppsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderAppDetails: this.props.renderAppDetails
    }
  }


  showForm = (appId) => {
    this.state.renderAppDetails(appId);
  }

  renderNewApplication = () => {
    this.showForm("new")
  }

  render() {
    let apps = [...this.props.apps].map((app) => {
      return (
        <ListGroup key={app.id} className={"appsListItemGroup"}>
          <ListGroupItem>
           Application Name - {app.name}
            <Button style={{"float": "right"}} variant="primary" onClick={() => this.showForm(app.id)} value={app.id}>
              Show Details
            </Button>
          </ListGroupItem>
        </ListGroup>
      )
    })

    return (
      <React.Fragment>
        <h2 style={{"margin": "15px"}}>
          List of apps
        </h2>
        <Button style={{"marginLeft": "20px"}} variant="primary" onClick={this.renderNewApplication}>Create new application</Button>
        <div className={"appsListOuterDiv"}>
        {
          apps
        }
        </div>
      </React.Fragment>
    );
  }
}

export default AppsList;
