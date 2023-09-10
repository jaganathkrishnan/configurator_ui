import React, { Component } from 'react';
import AppsList from './Apps/AppsList.jsx';
import AppDetails from './Apps/AppDetails.jsx'
import { Button } from "react-bootstrap";
import authenticationChecker from './../hoc/AuthenticationChecker.jsx'

class Apps extends Component {
  //TO-DO (much later): Add pagination for apps
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      apps: [],
      allServices: [],
      appId: null
    };
  }

  // 4 services - S1, S2, S3, S4
  // 3 apps - A1, A2, A3
  // 15 features -> S1 - 3, S2 - 4, S3 - 3, S4 - 5
  // A1 -> S1 (full), S2 (partial); A2 -> S2 (partial), S3 (partial); A3 -> no services

  getServicesAndTenantApps() {
    //TO-DO fetch data from backend



    return {
      apps: [
        {
          id: 1,
          name: "A1",
          description: "app desc",
          web_exists: true,
          mobile_app_exists: false,
          features: [4],
          full_services: [1]
        }, {
          id: 2,
          name: "A2",
          description: "app desc",
          web_exists: true,
          mobile_app_exists: false,
          features: [5,6,7,8],
          full_services: []
        }, {
          id: 3,
          name: "A3",
          description: "app desc",
          web_exists: true,
          mobile_app_exists: true,
          features: [],
          full_services: []
        }
      ],
      allServices: [
        {
          id: 1,
          name: "S1",
          description: "service description",
          features: [{id: 1, name: "feature_1"},{id: 2, name:"feature_2"},{id: 3, name: "feature_3"}],
          is_web: true, //will be true only if published
          is_app: false//will be true only if published
        }, {
          id: 2,
          name: "S2",
          description: "service description",
          features: [{id: 4, name: "feature_4"},{id: 5, name:"feature_5"},{id: 6, name: "feature_6"}, {id: 7, name: "feature_7"}],
          is_web: true,
          is_app: false
        }, {
          id: 3,
          name: "S3",
          description: "service description",
          features: [{id: 8, name: "feature_8"}, {id: 9, name: "feature_9"}, {id: 10, name: "feature_10"}],
          is_web: true,
          is_app: true
        }, {
          id: 4,
          name: "S4",
          description: "service description",
          features: [{id: 11, name: "feature_11"},{id: 12, name:"feature_12"},{id: 13, name: "feature_13"}, {id: 14, name: "feature_14"}, {id: 15, name: "feature_15"}],
          is_web: false,
          is_app: true
        },
      ]
    }
  }

  componentDidMount() {
    const { apps, allServices } = this.getServicesAndTenantApps();
    this.setState({
      apps, allServices, loading: false
    })
  }

  getOldAppData = (appId) => {
    const apps = [...this.state.apps];
    for (let index = 0; index < apps.length; index++) {
      const app = apps[index];
      if (app.id === appId) {
        return app;
      }
    }
    return null;
  };

  renderAppDetails = (appId) => {
    this.setState({
      appId
    })
  }

  closeAppDetails = () => {
    this.setState({
      appId: null
    })
  }

  getAppData = (appId) => {
    return appId === "new" ? this.newAppData() : this.getOldAppData(this.state.appId)
  }

  newAppData = () => {
    return {
      name: "",
      description: "",
      web_exists: true,
      mobile_app_exists: true,
      features: [],
      full_services: []
    }
  }

  render() {
    const { loading , apps , allServices } = this.state;

    if (loading) {
      return (<div>Loading</div>)
    }

    const appId = this.state.appId;

    return (
      <React.Fragment>
        {
          <AppsList renderAppDetails={this.renderAppDetails} apps={apps}/>
        }
        {
          appId ? (<AppDetails appData={{...this.getAppData(appId)}} allServices={allServices} closeAppDetails={this.closeAppDetails} />) : ""
        }
      </React.Fragment>
    );
  }
}

export default authenticationChecker(Apps);
